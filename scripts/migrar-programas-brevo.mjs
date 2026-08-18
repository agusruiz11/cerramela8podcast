/**
 * Migracion one-shot: asigna los tres programas a los contactos que todavia
 * no eligieron ninguno. Sin esto quedarian fuera de los tres segmentos y
 * dejarian de recibir el newsletter que ya venian recibiendo.
 *
 *   node scripts/migrar-programas-brevo.mjs           # dry-run, no escribe nada
 *   node scripts/migrar-programas-brevo.mjs --aplicar # escribe en Brevo
 *
 * Es idempotente: saltea a quien ya tenga al menos un programa marcado, asi
 * que se puede correr de nuevo sin pisar elecciones de la gente.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const APLICAR = process.argv.includes('--aplicar');

const ATTRS = [
  process.env.BREVO_ATTR_PROG_LATE_CHECK_OUT || 'PROG_LATE_CHECK_OUT',
  process.env.BREVO_ATTR_PROG_CERRAME_LA_8 || 'PROG_CERRAME_LA_8',
  process.env.BREVO_ATTR_PROG_NO_COMPRES_HUMO || 'PROG_NO_COMPRES_HUMO'
];

function loadEnv(file) {
  const out = {};
  try {
    for (const line of fs.readFileSync(path.join(ROOT, file), 'utf8').split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#') || !t.includes('=')) continue;
      const [k, ...rest] = t.split('=');
      out[k.trim()] = rest.join('=').trim().replace(/^["']|["']$/g, '');
    }
  } catch { /* archivo opcional */ }
  return out;
}

const env = { ...loadEnv('.env.example'), ...loadEnv('.env'), ...process.env };
const API_KEY = env.BREVO_API_KEY;
const LIST_ID = env.BREVO_LIST_ID || '2';

if (!API_KEY) {
  console.error('Falta BREVO_API_KEY (.env o variable de entorno).');
  process.exit(1);
}

async function brevo(pathname, options = {}) {
  const res = await fetch(`https://api.brevo.com/v3${pathname}`, {
    headers: { 'api-key': API_KEY, 'content-type': 'application/json', accept: 'application/json' },
    ...options
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} en ${pathname}: ${(await res.text()).slice(0, 200)}`);
  }
  return res.status === 204 ? {} : res.json();
}

const contacts = [];
for (let offset = 0; ; ) {
  const page = await brevo(`/contacts/lists/${LIST_ID}/contacts?limit=500&offset=${offset}`);
  const batch = page.contacts || [];
  contacts.push(...batch);
  offset += batch.length;
  if (batch.length < 500 || offset >= (page.count ?? 0)) break;
}

const pendientes = contacts.filter((c) => !ATTRS.some((a) => c.attributes?.[a] === true));

console.log(`Lista #${LIST_ID}: ${contacts.length} contactos`);
console.log(`Ya tienen programa:  ${contacts.length - pendientes.length}`);
console.log(`A migrar:            ${pendientes.length}`);
console.log(`Atributos:           ${ATTRS.join(', ')}\n`);

if (!APLICAR) {
  console.log('DRY-RUN: no se escribio nada. Volve a correr con --aplicar para hacerlo.');
  process.exit(0);
}

const attributes = Object.fromEntries(ATTRS.map((a) => [a, true]));
let ok = 0;
const fallos = [];

for (const [i, c] of pendientes.entries()) {
  try {
    await brevo(`/contacts/${encodeURIComponent(c.email)}`, {
      method: 'PUT',
      body: JSON.stringify({ attributes })
    });
    ok += 1;
  } catch (err) {
    fallos.push({ email: c.email, error: err.message });
  }
  if ((i + 1) % 25 === 0) console.log(`  ${i + 1}/${pendientes.length}...`);
  await new Promise((r) => setTimeout(r, 120)); // Brevo limita a ~10 req/s
}

console.log(`\nActualizados: ${ok}`);
if (fallos.length) {
  console.log(`Fallaron: ${fallos.length}`);
  for (const f of fallos.slice(0, 10)) console.log(`  ${f.email}: ${f.error}`);
}
