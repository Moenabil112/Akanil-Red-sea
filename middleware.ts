import { NextResponse, type NextRequest } from "next/server";

/**
 * P4-A internal-route hardening (§2/§19). Applies noindex and no-store to
 * every /[lang]/internal route and coarsely redirects requests without a
 * session cookie to the login page. Route hiding is NOT the security
 * boundary — real authentication and authorization run server-side in every
 * page and server action. This middleware only adds defence-in-depth headers
 * and a fast unauthenticated redirect for a better experience.
 */

const SESSION_COOKIE = "akn_internal_session";
const PUBLIC_INTERNAL = new Set(["login", "denied", "change-password"]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Matches /ar/internal, /fr/internal/..., /en/internal/...
  const segments = pathname.split("/").filter(Boolean);
  const lang = segments[0] ?? "";
  const section = segments[1] ?? "";
  const sub = segments[2];

  const response = maybeRedirect(request, lang, section, sub) ?? NextResponse.next();

  // Never index or cache internal responses.
  response.headers.set(
    "X-Robots-Tag",
    "noindex, nofollow, noarchive, nosnippet",
  );
  response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  );
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "img-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      // Next.js App Router ships an inline hydration bootstrap; 'unsafe-inline'
      // is required until a nonce-based CSP is added (recorded as future work).
      // No third-party script origins are allowed.
      "script-src 'self' 'unsafe-inline'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "base-uri 'self'",
    ].join("; "),
  );
  return response;
}

function maybeRedirect(
  request: NextRequest,
  lang: string,
  section: string,
  sub: string | undefined,
): NextResponse | null {
  if (section !== "internal") return null;
  // Login, denied and change-password are reachable without a prior session.
  if (sub && PUBLIC_INTERNAL.has(sub)) return null;
  if (!sub) {
    // Bare /[lang]/internal is the dashboard — requires a session cookie.
  }
  const hasCookie = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
  if (hasCookie) return null;
  const url = request.nextUrl.clone();
  url.pathname = `/${lang}/internal/login`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/:lang(ar|fr|en)/internal/:path*"],
};
