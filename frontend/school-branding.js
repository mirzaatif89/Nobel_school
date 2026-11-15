// Preserve sessions and school records while migrating only the school identity.
(() => {
  const name = 'Nobel School Of Integrated Studies Pindsultani';
  const address = 'main pindi kohat road pindsultani';
  const email = 'nsis.pk@gmail.com';
  window.SCHOOL_BRANDING = Object.freeze({name, address, email, phone:'+92 333 2207577', whatsapp:'+92 333 2207577', logo:'images/Logo.jpeg?v=nsis-20261115'});
  try {
    const settings = JSON.parse(localStorage.getItem('eduCore_settings') || '{}') || {};
    if (settings.nobelBrandingVersion !== 20261115) {
      Object.assign(settings, {schoolName:name, schoolTitle:name, address, schoolAddress:address, email, whatsapp:'+92 333 2207577', phone:'+92 333 2207577', logoDataUrl:'', greenLandBrandingVersion:1, nobelBrandingVersion:20261115});
      localStorage.setItem('eduCore_settings', JSON.stringify(settings));
    }
  } catch (_) { /* The static branding also works when storage is disabled. */ }
})();
