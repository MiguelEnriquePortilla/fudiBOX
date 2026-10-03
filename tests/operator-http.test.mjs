import test from "node:test";
import assert from "node:assert/strict";
const base=process.env.TEST_BASE_URL||"http://localhost:3000";
test("anonymous operator console redirects without exposing business data",async()=>{
 const r=await fetch(base+"/admin?section=repas",{redirect:"manual"});
 assert.equal(r.status,307);assert.equal(new URL(r.headers.get("location"),base).pathname,"/admin/acceso");
 assert.match(r.headers.get("cache-control"),/no-store/);
});
test("legacy restaurant app redirects to protected operation",async()=>{
 const r=await fetch(base+"/negocio",{redirect:"manual"});
 assert.equal(new URL(r.headers.get("location"),base).pathname,"/admin");
});
test("operator login stays separate from customer login",async()=>{
 const r=await fetch(base+"/admin/acceso");assert.equal(r.status,200);
 const body=await r.text();assert.match(body,/Acceso del equipo/);
});
test("generic restaurant route renders verified catalog",async()=>{
 const r=await fetch(base+"/restaurantes/chicken-chicanito");assert.equal(r.status,200);
 assert.match(await r.text(),/Chicken Chicanito/);
});
test("unknown restaurant returns not found",async()=>{
 const r=await fetch(base+"/restaurantes/missing-test-restaurant");assert.equal(r.status,404);
});

