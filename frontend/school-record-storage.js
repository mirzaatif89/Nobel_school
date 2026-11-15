/* Compatibility adapter for legacy synchronous admin forms. SQL-backed records
   and browser preferences retain their existing storage paths. */
(() => {
  const keys = new Set(['eduCore_bills', 'eduCore_visitor_books', 'eduCore_classes',
    'eduCore_settings', 'eduCore_student_schedules', 'eduCore_teacher_class_assignments',
    'eduCore_promotion_history', 'eduCore_alumni', 'eduCore_deleted_family_cards', 'eduCore_fee_fine_rule',
    'AMERICAN_LYCEUM_DATE_SHEET_V1', 'AMERICAN_LYCEUM_RESULT_CARD_V1', 'APEXIUMS_DATE_SHEET_V1', 'APEXIUMS_RESULT_CARD_V1']);
  const records = new Map();
  const local = window.localStorage;
  function active(key) {
    return keys.has(key) && !!sessionStorage.getItem('eduCore_token');
  }
  function request(key, body) {
    const xhr = new XMLHttpRequest();
    const apiBase = typeof getApiBaseUrl === 'function' ? getApiBaseUrl() : '';
    const base = (apiBase ? apiBase.replace(/\/api\/?$/, '') : (window.ENV_BACKEND_URL || location.origin)).replace(/\/$/, '');
    xhr.open(body ? 'PUT' : 'GET', `${base}/api/school-records/${encodeURIComponent(key)}`, false);
    xhr.setRequestHeader('Authorization', `Bearer ${sessionStorage.getItem('eduCore_token')}`);
    xhr.setRequestHeader('X-Auth-Token', sessionStorage.getItem('eduCore_token'));
    if (body) xhr.setRequestHeader('Content-Type', 'application/json');
    try {
      xhr.send(body ? JSON.stringify(body) : null);
      const payload = JSON.parse(xhr.responseText);
      if (xhr.status < 200 || xhr.status >= 300) throw new Error(payload.message || 'Server save failed.');
      return payload.record;
    } catch (error) {
      if (body) {
        const message = `Data was not saved to the server. ${error.message} Please retry before leaving this page.`;
        if (window.showAppAlert) window.showAppAlert(message, 'Save Failed');
        else window.alert(message);
      }
      throw error;
    }
  }
  function read(key) {
    if (!records.has(key)) records.set(key, request(key));
    return records.get(key);
  }
  window.schoolRecordStorage = {
    getItem(key) {
      if (!active(key)) return local.getItem(key);
      const record = read(key);
      return record.revision === 0 ? local.getItem(key) : record.value;
    },
    setItem(key, value) {
      if (!active(key)) return local.setItem(key, value);
      // Keep the read inside the write error path: a failed initial load must also fail the save.
      let previous;
      try { previous = read(key); }
      catch (error) { window.alert('Data was not saved to the server. Please reconnect and reload before saving.'); throw error; }
      records.set(key, request(key, {value:String(value), revision:previous.revision}));
      try { local.setItem(key, value); } catch (_) { /* Server save already succeeded. */ }
    },
    removeItem(key) {
      // Clearing a browser copy must never delete authoritative server records.
      records.delete(key);
      local.removeItem(key);
    }
  };
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('/mobile-sw.js', {updateViaCache:'none'}).catch(() => {}));
  }
})();
