const { createHandler, sendJson } = require('../_lib/http');
const { readStore, upsertRecord } = require('../_lib/mobileStore');
const schoolBranding = require('../_lib/schoolBranding');

const defaultAboutSoftware = {
    id: 'ABOUT-SOFTWARE',
    appName: 'Nobel School Of Integrated Studies Pindsultani',
    schoolName: 'Nobel School Of Integrated Studies Pindsultani',
    website: process.env.SCHOOL_WEBSITE || '',
    supportEmail: process.env.SMTP_FROM_EMAIL || '',
    supportPhone: '+92 333 2207577',
    schoolAddress: 'main pindi kohat road pindsultani',
    principalName: 'Malik M. Tahir Suleman',
    description: 'Student and teacher portal APIs for Nobel School Of Integrated Studies Pindsultani.',
    version: '1.0.0'
};

module.exports = createHandler({
    GET: async ({ res }) => {
        const records = readStore('about_software');
        sendJson(res, 200, { success: true, aboutSoftware: {...(records[0] || defaultAboutSoftware), ...schoolBranding} });
    },
    POST: async ({ res, body }) => {
        const { record } = upsertRecord('about_software', {
            ...defaultAboutSoftware,
            ...(body || {}),
            id: body?.id || defaultAboutSoftware.id
        }, 'ABOUT');
        sendJson(res, 200, { success: true, aboutSoftware: record });
    }
});
