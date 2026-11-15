const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const vm = require('vm');
const {createRecordStore} = require('../api/_lib/schoolRecords');

test('durable store rejects stale devices, invalid data and unknown collections', async () => {
  const rows = new Map();
  const Model = {
    async findByPk(key) {return rows.get(key);},
    async create(row) {
      if (rows.has(row.key)) throw Object.assign(new Error('Duplicate'), {name:'SequelizeUniqueConstraintError'});
      rows.set(row.key, {...row});
    },
    async update(row, {where}) {
      const old = rows.get(where.key);
      if (!old || old.revision !== where.revision) return [0];
      rows.set(where.key, {...old,...row}); return [1];
    }
  };
  const store = createRecordStore(Model);
  assert.deepEqual(await store.read('eduCore_bills'), {revision:0,value:null});
  await store.write('eduCore_bills', '[{"id":"bill-1"}]', 0);
  const otherDevice = createRecordStore(Model);
  assert.equal((await otherDevice.read('eduCore_bills')).value, '[{"id":"bill-1"}]');
  await assert.rejects(store.write('eduCore_bills','[]',0), {statusCode:409});
  await store.write('eduCore_bills','[]',1);
  await assert.rejects(otherDevice.write('eduCore_bills','[]',1), {statusCode:409});
  await assert.rejects(store.write('eduCore_bills','invalid',2), {statusCode:400});
  await assert.rejects(store.read('../secrets'), {statusCode:400});
  await store.write('eduCore_bills',null,2);
  assert.deepEqual(await otherDevice.read('eduCore_bills'), {revision:3,value:null});
});

test('service worker excludes APIs, uploads, pages, foreign origins and mutations', async () => {
  const handlers = {};
  let puts = 0;
  const context = {
    URL,
    self:{location:{origin:'https://school.test'},addEventListener:(name,fn)=>handlers[name]=fn},
    caches:{open:async()=>({put:async()=>puts++,match:async()=>null})},
    fetch:async()=>({ok:true,type:'basic',headers:{get:()=> 'private, max-age=3600'},clone(){return this;}})
  };
  vm.runInNewContext(fs.readFileSync('frontend/mobile-sw.js','utf8'),context);
  for (const [path,method] of [['/api/students','GET'],['/api/report.js','GET'],['/uploads/photo.jpg','GET'],['/student_portal','GET'],['https://other.test/a.js','GET'],['/app.js','POST']]) {
    let intercepted = false;
    handlers.fetch({request:{url:new URL(path,'https://school.test').href,method},respondWith:()=>intercepted=true});
    assert.equal(intercepted,false,path);
  }
  let result;
  handlers.fetch({request:{url:'https://school.test/style.css',method:'GET'},respondWith:p=>result=p});
  await result;
  assert.equal(puts,1);
});

test('legacy form saves only update browser copy after server confirmation', () => {
  const values = new Map([['eduCore_bills','[]']]);
  const local = {getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
  let fail = false;
  let serverRecord = {revision:0,value:null};
  const context = {Map,Set,JSON,Error,
    window:{localStorage:local,alert:()=>{},addEventListener:()=>{}},
    navigator:{},location:{origin:'https://school.test'},
    sessionStorage:{getItem:()=> 'token'},
    XMLHttpRequest:class {
      open(method){this.method=method;} setRequestHeader(){}
      send(body){
        this.status = fail ? 503 : 200;
        if (!fail && body) serverRecord = {revision:serverRecord.revision+1,value:JSON.parse(body).value};
        this.responseText=JSON.stringify(fail?{message:'Offline'}:{record:serverRecord});
      }
    }
  };
  vm.runInNewContext(fs.readFileSync('frontend/school-record-storage.js','utf8'),context);
  const store = context.window.schoolRecordStorage;
  store.setItem('eduCore_bills','[{"id":"one"}]');
  assert.equal(serverRecord.value,'[{"id":"one"}]');
  fail=true;
  assert.throws(()=>store.setItem('eduCore_bills','[]'));
  assert.equal(local.getItem('eduCore_bills'),'[{"id":"one"}]');
  assert.equal(serverRecord.value,'[{"id":"one"}]');
  store.removeItem('eduCore_bills');
  assert.equal(serverRecord.value,'[{"id":"one"}]');
  store.setItem('eduCore_sidebar_scroll_position','20');
  assert.equal(local.getItem('eduCore_sidebar_scroll_position'),'20');
});

test('HTTP cache headers allow browser assets and prevent API/proxy caching', async () => {
  const {app} = require('../backend/server');
  const http = require('http');
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  try {
    const asset = await fetch(`${origin}/images/Logo.jpeg?v=nsis-20261115`);
    assert.equal(asset.status,200);
    assert.match(asset.headers.get('cache-control'), /^private,/);
    assert.equal(asset.headers.get('cdn-cache-control'),'no-store');
    await asset.arrayBuffer();
    const api = await fetch(`${origin}/api/school-records/eduCore_bills`);
    assert.equal(api.status,401);
    assert.match(api.headers.get('cache-control'),/no-store/);
    await api.text();
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({id:'test-student',role:'Student'},process.env.JWT_SECRET || 'eduCore_secret_key_2026');
    const forbidden = await fetch(`${origin}/api/school-records/eduCore_bills`, {headers:{Authorization:`Bearer ${token}`}});
    assert.equal(forbidden.status,403);
    await forbidden.text();
  } finally {
    server.closeAllConnections();
    await new Promise(resolve=>server.close(resolve));
  }
});

test('SQL records survive a fresh store instance and reject stale writes (rolled back)', async () => {
  const backend = require('../backend/server');
  await backend.startServer();
  const db = backend.getSequelize();
  const Model = db.models.SchoolRecord;
  const transaction = await db.transaction();
  const bound = {
    findByPk:key=>Model.findByPk(key,{transaction}),
    create:row=>Model.create(row,{transaction}),
    update:(row,options)=>Model.update(row,{...options,transaction})
  };
  try {
    const first = createRecordStore(bound);
    const previous = await first.read('eduCore_bills');
    const saved = await first.write('eduCore_bills','[{"id":"storage-validation"}]',previous.revision);
    const second = createRecordStore(bound);
    assert.deepEqual(await second.read('eduCore_bills'),saved);
    await assert.rejects(second.write('eduCore_bills','[]',previous.revision),{statusCode:409});
  } finally {
    await transaction.rollback();
    await db.close();
  }
});
