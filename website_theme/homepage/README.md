This is the front page from the supplied `nobel-pathways-admissions-main.zip`.
Its original React components, Tailwind design tokens, animations and 3D hero
are retained. Asset metadata points to the matching local school photographs.

Build with `npm run build:website` from the project root. The generated entry is
`frontend/website.html`; bundles are in `frontend/homepage/`. Production runs with
the existing `npm start` command and needs no separate frontend server.

Admission and login buttons use the existing school's server-backed routes.
The ZIP's unrelated Supabase database, authentication and secrets are not imported.
