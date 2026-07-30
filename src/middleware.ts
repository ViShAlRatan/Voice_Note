import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  // 1. Supabase Server Client Setup
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value; },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // 2. Check if user is logged in (Admin check)
  const { data: { user } } = await supabase.auth.getUser();

  // 3. Agar user logged in HAIN (yani aap Admin hain), toh direct aage jaane do
  if (user) {
    return response;
  }

  // 4. Agar user logged in NAHI hai, toh DB se check karo ki Maintenance ON hai kya?
  const { data: settings } = await supabase.from('site_settings').select('is_maintenance').eq('id', 1).single();

  // 5. Agar Maintenance ON hai, toh unhe 'maintenance' page par rewrite kar do (URL change nahi hoga)
  if (settings?.is_maintenance) {
    const url = request.nextUrl.clone();
    url.pathname = '/maintenance';
    return NextResponse.rewrite(url);
  }

  return response;
}

// Ye define karta hai ki middleware kahan chalega
// middleware.ts ke bilkul aakhir mein ye likhein:

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - admin (admin dashboard)
     * - maintenance (YE BAHUT ZAROORI HAI - warna 404 aayega)
     * - sitemap.xml (SEO sitemap - Googlebot ke liye)
     * - robots.txt (SEO robots - Googlebot ke liye)
     */
    '/((?!_next/static|_next/image|favicon.ico|admin|maintenance|sitemap\\.xml|robots\\.txt).*)',
  ],
};