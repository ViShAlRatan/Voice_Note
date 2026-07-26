import { createClient } from "@/lib/supabase/server";
import { Wrench, Lock } from "lucide-react";
import MaintenanceRealtimeListener from "@/components/MaintenanceRealtimeListener";

export default async function MaintenanceWrapper({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  // 1. Fetch Maintenance Status
  const { data: settings } = await supabase
    .from('site_settings')
    .select('is_maintenance')
    .eq('id', 1)
    .single();

  // 2. Check if user is Admin
  let isAdmin = false;

  if (settings?.is_maintenance) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
        
      if (profile?.role === 'admin') {
        isAdmin = true; // Admin Bypass
      }
    }
  }

  // 3. MAINTENANCE SCREEN WITH RESPONSIVE BACKGROUND GIANT TEXT
  if (settings?.is_maintenance && !isAdmin) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-white relative overflow-hidden selection:bg-white selection:text-black">
        
        {/* Realtime listener for instant status updates */}
        <MaintenanceRealtimeListener />

        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none z-0" />

        {/* 🔥 RESPONSIVE GIANT BACKGROUND TEXT 🔥 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden px-2">
          <h1 
            className="text-[14vw] sm:text-[11vw] md:text-[10vw] font-black whitespace-nowrap select-none tracking-widest opacity-20 uppercase"
            style={{ WebkitTextStroke: '2px rgba(255, 255, 255, 0.3)', color: 'transparent' }}
          >
            MAINTENANCE
          </h1>
        </div>

        {/*  MAIN GLASS BOX (Z-10 taaki text ke upar rahe)  */}
        <div className="z-10 relative w-full max-w-lg bg-zinc-950/80 backdrop-blur-xl border
         border-white/10 rounded-[1rem] p-8 md:p-12 flex flex-col items-center text-center shadow-2xl
          animate-in fade-in slide-in-from-bottom-8 zoom-in-95 duration-1000">
          
          {/* Animated Icons */}
          <div className="relative w-24 h-24 flex items-center justify-center mb-8">
            <div className="absolute inset-0 border border-blue-500/30 rounded-full animate-[spin_4s_linear_infinite]" />
            <div className="absolute inset-2 border border-dashed border-indigo-500/40 rounded-full animate-[spin_6s_linear_infinite_reverse]" />
            <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.2)] backdrop-blur-md">
              <Wrench className="w-7 h-7 text-blue-400 animate-pulse" />
            </div>
          </div>
          
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 border border-blue-500/20 text-xs
           text-blue-400 mb-6 backdrop-blur-md uppercase tracking-widest font-mono font-semibold shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
            </span>
            System Update in Progress
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
            We'll be right back.
          </h1>
          
          <p className="text-zinc-400 text-sm md:text-base max-w-md mb-8 leading-relaxed">
            The platform is currently undergoing scheduled maintenance to bring you a better experience. Please check back shortly.
          </p>

          {/* 3 Bouncing Loading Dots Animation */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>

          {/* Footer Line */}
          <div className="w-full pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-xs text-zinc-600 font-mono">
            <Lock className="w-3.5 h-3.5" />
            <span>Secured by Voice Note Admins</span>
          </div>
          
        </div>
      </div>
    );
  }

  // 4. ALLOW ACCESS: Realtime listener included
  return (
    <>
      <MaintenanceRealtimeListener />
      {children}
    </>
  );
}