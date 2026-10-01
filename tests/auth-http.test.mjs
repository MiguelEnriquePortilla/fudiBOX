import test from "node:test";
import assert from "node:assert/strict";
const base = process.env.TEST_BASE_URL || "http://localhost:3000";
test("anonymous account redirects to login without exposing data", async () => {
  const r = await fetch(base + "/cuenta", { redirect: "manual" });
  assert.equal(r.status, 307);
  assert.equal(new URL(r.headers.get("location"), base).pathname, "/acceso");
  assert.match(r.headers.get("cache-control"), /no-store/);
});
test("callback without code ignores external return destinations", async () => {
  const r = await fetch(base + "/auth/callback?next=https://example.com", { redirect: "manual" });
  assert.equal(r.status, 307);
  const target = new URL(r.headers.get("location"), base);
  assert.equal(target.origin, new URL(base).origin);
  assert.equal(target.pathname, "/acceso");
  assert.match(r.headers.get("cache-control"), /no-store/);
});
test("invalid PKCE code cannot establish a session", async () => {
  const r = await fetch(base + "/auth/callback?code=invalid-test-code", { redirect: "manual" });
  assert.equal(new URL(r.headers.get("location"), base).pathname, "/acceso");
});
test("forged session cookie does not grant account access", async () => {
  const r = await fetch(base + "/cuenta", { redirect: "manual", headers: { Cookie: 'sb-aybgfwjbnsqbfnzmztmx-auth-token=base64-eyJhY2Nlc3NfdG9rZW4iOiJmYWtlIiwicmVmcmVzaF90b2tlbiI6ImZha2UifQ' } });
  assert.equal(r.status, 307);
  assert.equal(new URL(r.headers.get("location"), base).pathname, "/acceso");
});
test("login renders Google access and preserves protective headers", async () => {
  const r = await fetch(base + "/acceso");
  assert.equal(r.status, 200);
  assert.equal(r.headers.get("referrer-policy"), "no-referrer");
  assert.equal(r.headers.get("x-frame-options"), "DENY");
  assert.match(await r.text(), /Continuar con Google/);
});
