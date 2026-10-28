// middleware.ts
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

  const path = request.nextUrl.pathname;

  // 🔒 Allow login, admin-login, and auth routes to bypass middleware freely
  if (path.startsWith('/login') || path.startsWith('/admin-login') || path.startsWith('/auth')) {
    return response;
  }

  // 2. Get current user session safely
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  // 3. SECURE /admin ROUTES ON THE SERVER-SIDE (Exclude /admin-login exactly!)
  if (path.startsWith('/admin') && path !== '/admin-login') {
    if (userError || !user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Verify if the user has 'admin' role in the profiles table (Safe query)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    // If profile doesn't exist or role is not admin, redirect safely
    if (!profile || profile.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return response;
  }

  // 4. Agar user logged in hai, toh aage jaane do
  if (user) {
    return response;
  }

  // 5. Check Maintenance mode safely using .maybeSingle()
  try {
    const { data: settings } = await supabase
      .from('site_settings')
      .select('is_maintenance')
      .eq('id', 1)
      .maybeSingle();

    // 6. Agar Maintenance ON hai, toh 'maintenance' page par rewrite kar do
    if (settings?.is_maintenance) {
      const url = request.nextUrl.clone();
      url.pathname = '/maintenance';
      return NextResponse.rewrite(url);
    }
  } catch (err) {
    console.error("Maintenance check skipped:", err);
  }

  return response;
}

// 7. Matcher Config
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|maintenance|sitemap\\.xml|robots\\.txt).*)',
  ],
};