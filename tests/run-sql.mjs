// Isolated PostgreSQL/WASM runner. Never connects to Supabase or reads .env.
// Supply PGLITE_MODULE as a local module path, or install @electric-sql/pglite separately.
import { readFile, readdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const modulePath = process.env.PGLITE_MODULE;
const { PGlite } = await import(modulePath ? pathToFileURL(resolve(modulePath)).href : '@electric-sql/pglite');
const db = new PGlite();
try {
 await db.exec(`create role anon; create role authenticated;
 create schema auth;
 create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz);
 create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
 grant usage on schema auth to authenticated,anon;
 grant execute on function auth.uid() to authenticated,anon;
 insert into auth.users values('00000000-0000-4000-8000-000000000001','miguel.e.portilla@gmail.com',now());`);
 for (const file of (await readdir('supabase/migrations')).filter(f => f.endsWith('.sql')).sort()) {
  if (process.argv.includes('--baseline') && file.startsWith('20261021')) continue;
  await db.exec(await readFile('supabase/migrations/'+file,'utf8'));
 }
 await db.exec(`insert into fudi_private.admins(user_id) values('00000000-0000-4000-8000-000000000001');`);
 for (const file of ['order-transactions.sql','pickup-ready.sql','complete-pickup.sql','pickup-pilot.sql','order-methods.sql']) {
  await db.exec(await readFile('tests/'+file,'utf8'));
  console.log('PASS '+file);
 }
} catch (error) {
 console.error('SQL verification failed:', error.message);
 process.exitCode = 1;
} finally { await db.close(); }
