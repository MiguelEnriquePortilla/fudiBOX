import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseEnv } from "@/lib/supabase/env";
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { url, key } = supabaseEnv();
  const client = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(values) {
        values.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      }
    }
  });
  // Only refresh an existing session. Pages independently verify identity with getUser.
  if (request.cookies.getAll().some(({ name }) => name.startsWith("sb-") && name.includes("-auth-token"))) {
    await client.auth.getUser();
  }
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  return response;
}
export const config = { matcher: ["/", "/acceso", "/cuenta/:path*", "/chicanito/:path*", "/negocio/:path*", "/admin/:path*", "/restaurantes/:path*", "/auth/:path*"] };
