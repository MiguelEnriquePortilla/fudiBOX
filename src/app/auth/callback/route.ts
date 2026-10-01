import { NextResponse, type NextRequest } from "next/server";
import { serverClient } from "@/lib/supabase/server";
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  let path = "/acceso?error=oauth";
  if (code && !request.nextUrl.searchParams.has("error")) {
    try {
      const client = await serverClient();
      const { error } = await client.auth.exchangeCodeForSession(code);
      if (!error) path = "/cuenta";
    } catch {
      // Never render or log OAuth codes, tokens, or provider error details.
    }
  }
  const response = NextResponse.redirect(new URL(path, request.nextUrl.origin));
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  return response;
}
