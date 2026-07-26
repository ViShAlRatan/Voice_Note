import { createClient } from "@/lib/supabase/server";
import LockedScreen from "@/components/ui/LockedScreen";
import { ArrowLeft, Smartphone, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function AppsPage() {
  const supabase = await createClient();
  
  // 1. Authentication Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return <LockedScreen title="Flutter Apps Hub" />;
  }

  // 2. Permission Check (RBAC)
  const { data: profile } = await supabase.from("profiles").select("can_view_apps").eq("id", user.id).single();
  if (profile && profile.can_view_apps === false) {
    return <LockedScreen title="Flutter Apps Hub" isPermissionDenied={true} />;
  }

  // 3. Fetch Apps if everything is correct
  const { data: apps } = await supabase.from("apps").select("*").order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 selection:bg-white selection:text-black relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-500/10 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto mb-12 flex items-center justify-between relative z-30">
        <Link href="/dashboard" className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/60 border border-white/10 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-all">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back</span>
        </Link>
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400 font-mono bg-zinc-900/40 px-3 py-1.5 rounded-full border border-white/5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" /><span>Unlocked</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
          Apps Hub.
        </h1>
        <p className="text-zinc-400 text-lg max-w-xl leading-relaxed">
          Explore the latest cross-platform applications built with Flutter. View screenshots, details, and download APKs.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {apps?.map((app) => (
          <div key={app.id} className="rounded-3xl border border-white/10 bg-zinc-950/60 backdrop-blur-xl p-6 hover:border-indigo-500/30 transition-all group flex flex-col justify-between hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1">
            <div>
              {/*  Dynamic App Logo integration  */}
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center mb-6 border border-white/10 text-indigo-400 overflow-hidden shadow-lg">
                {app.logo_url ? (
                  <img 
                    src={app.logo_url} 
                    alt={app.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                ) : (
                  <Smartphone className="w-7 h-7" />
                )}
              </div>
              
              <h2 className="text-xl font-semibold mb-2 group-hover:text-indigo-400 transition-colors">{app.title}</h2>
              <p className="text-xs text-indigo-400 font-mono mb-4 bg-indigo-500/10 inline-block px-2 py-1 rounded-md border border-indigo-500/20">
                v {app.version || "1.0.0"}
              </p>
              
              <p className="text-sm text-zinc-400 leading-relaxed mb-6 line-clamp-3">
                {app.short_description || app.description}
              </p>
            </div>
            
            {/* 🔥 Directs User to the New Premium App Details Page 🔥 */}
            <Link 
              href={`/apps/${app.id}`} 
              className="flex items-center justify-center gap-2 w-full bg-white text-black hover:bg-zinc-200 font-semibold h-11 rounded-xl transition-all active:scale-95 shadow-lg group-hover:shadow-white/20"
            >
              Explore App <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        ))}
        {apps?.length === 0 && (
          <div className="col-span-full text-center py-20 border border-white/5 rounded-3xl bg-zinc-950/50">
            <Smartphone className="w-10 h-10 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-500 font-medium">No apps published yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}