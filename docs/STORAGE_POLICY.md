# School branding and storage

School identity: Nobel School Of Integrated Studies Pindsultani; nsis.pk@gmail.com;
WhatsApp +92 333 2207577; main pindi kohat road pindsultani.

Public static assets use private browser caching. CDN and proxy caching are disabled.
The service worker caches only same-origin static assets. API responses, uploaded
documents, HTML pages, and mutations bypass the service worker cache. Old school
service worker caches are removed on activation.

Business records remain authoritative on the server. Existing SQL and mobile API
record stores remain in use. Legacy forms for classes, settings, bills, visitor
books, schedules, class assignments, promotions, alumni, family-card exclusions,
fine rules, and exam templates now use the SQL `SchoolRecords` table. This table
is created by the existing database startup synchronization. Keep normal database
backups and retain `data/` for existing file-backed business records.

The compatibility adapter preserves the synchronous interface used by legacy
forms. Those specific collections use synchronous HTTP requests; a slow server
can briefly block the page. SQL writes must be confirmed before the browser copy
is updated. Revision checks reject concurrent overwrites from stale devices.
Other collections keep their existing APIs and browser caches. Browser preference
and session values remain local. Clearing a browser copy never deletes a SQL record.

Existing browser-only legacy records are preserved and become server records on
their next deliberate save. They are not silently uploaded or discarded on login.

Run `node --test tests/storage-and-cache.test.cjs`. The integration checks require
the configured MySQL database; the SQL write test rolls back its transaction.
Restart/deploy the Node application to make these local source changes live.
Native app icons and display names are updated in source; installed native apps
require rebuilding and installing a new binary.
