import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Renommé de middleware.ts vers proxy.ts pour Next.js 16 : la convention
 * "middleware" est dépréciée depuis la 16.1, et plusieurs correctifs de
 * sécurité de la couche proxy ne s'activent que sous ce nouveau nom.
 */

const PROTECTED_PREFIXES = ["/dashboard", "/clients", "/mon-espace"];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtected = PROTECTED_PREFIXES.some((p) =>
    request.nextUrl.pathname.startsWith(p)
  );

  if (isProtected && !user) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/clients/:path*"],
};
