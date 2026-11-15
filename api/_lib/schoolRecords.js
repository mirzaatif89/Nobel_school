// Durable business records for modules which predate the SQL API; never a response cache.
const RECORD_KEYS = new Set(['eduCore_bills', 'eduCore_visitor_books', 'eduCore_classes',
  'eduCore_settings', 'eduCore_student_schedules', 'eduCore_teacher_class_assignments',
  'eduCore_promotion_history', 'eduCore_alumni', 'eduCore_deleted_family_cards', 'eduCore_fee_fine_rule',
  'AMERICAN_LYCEUM_DATE_SHEET_V1', 'AMERICAN_LYCEUM_RESULT_CARD_V1', 'APEXIUMS_DATE_SHEET_V1', 'APEXIUMS_RESULT_CARD_V1']);
function createRecordStore(Model) {
  function validateKey(key) {
    if (!RECORD_KEYS.has(key)) throw Object.assign(new Error('Unknown record collection.'), {statusCode:400});
  }
  async function read(key) {
    validateKey(key);
    const record = await Model.findByPk(key);
    return record ? {revision:record.revision, value:record.value} : {revision:0, value:null};
  }
  async function write(key, value, revision) {
    validateKey(key);
    const conflict = () => Object.assign(new Error('Records changed on another device. Reload before saving.'), {statusCode:409});
    if (!Number.isInteger(revision) || revision < 0) throw Object.assign(new Error('Invalid revision.'), {statusCode:400});
    if (typeof value !== 'string' && value !== null) throw Object.assign(new Error('Invalid record value.'), {statusCode:400});
    if (value !== null) {
      try { JSON.parse(value); } catch (_) { throw Object.assign(new Error('Record must contain valid JSON.'), {statusCode:400}); }
    }
    const record = {revision:revision + 1, value};
    if (revision === 0) {
      try { await Model.create({key, ...record}); }
      catch (error) { if (error.name === 'SequelizeUniqueConstraintError') throw conflict(); throw error; }
    } else {
      const [count] = await Model.update(record, {where:{key, revision}});
      if (count !== 1) throw conflict();
    }
    return record;
  }
  return {read, write};
}
module.exports = {RECORD_KEYS, createRecordStore};
