import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (code) {
    // Next.js 15 mein cookies ko aise get karte hain
    const cookieStore = await cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { 
            return cookieStore.get(name)?.value; 
          },
          set(name: string, value: string, options: CookieOptions) { 
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) { 
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );

    // Code ko verify karke session start karein
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Verify hote hi user ko seedha Dashboard bhej dein
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // Agar verify fail ho jaye toh wapas login bhej dein error ke sath
  return NextResponse.redirect(`${origin}/login?error=Verification_Failed`);
}