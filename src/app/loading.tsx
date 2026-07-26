import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen w-full fixed inset-0 z-50 flex 
    flex-col items-center justify-center bg-black relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px]
       bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none animate-pulse" />
      
      <div className="flex flex-col items-center gap-6 z-10 animate-in fade-in zoom-in-95 
      duration-500">
        
        {/* Premium Glassmorphic Spinner Box */}
        <div className="w-24 h-32 rounded-2xl bg-zinc-950/60 backdrop-blur-xl border
         border-indigo-500/30 flex items-center justify-center shadow-2xl shadow-indigo-500/10">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        </div>
        
        {/* Animated Text */}
        <div className="flex flex-col items-center gap-1">
          <h3 className="text-white font-medium tracking-wide">Loading</h3>
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-mono animate-pulse">
            Please wait...
          </p>
        </div>

      </div>
    </div>
  );
}