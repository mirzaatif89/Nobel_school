import { build } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const directory = path.dirname(fileURLToPath(import.meta.url));
await build({configFile:path.join(directory,'vite.config.mjs')});
const output = path.resolve(directory,'../../frontend/homepage/index.html');
fs.copyFileSync(output,path.resolve(directory,'../../frontend/website.html'));
console.log('Supplied homepage theme built into frontend/website.html.');
