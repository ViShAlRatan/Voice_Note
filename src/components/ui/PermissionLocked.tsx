"use client";

import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";

export default function PermissionLocked({ moduleName = "this section" }: { moduleName?: string }) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center animate-in fade-in zoom-in-95 duration-700 relative overflow-hidden bg-black w-full">
      
      {/* Background Red Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-red-600/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Premium Lock Icon Design */}
        <div className="relative w-24 h-24 bg-zinc-950 border border-white/5 rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
          <div className="absolute inset-0 bg-red-500/10 rounded-3xl animate-pulse" />
          <Lock className="w-10 h-10 text-red-500 relative z-10" />
          {/* Tiny Shield Badge */}
          <div className="absolute -bottom-3 -right-3 bg-zinc-900 rounded-xl p-2 border border-white/10 shadow-xl">
             <ShieldAlert className="w-5 h-5 text-red-400" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Access Restricted
        </h1>
        
        <p className="text-zinc-400 text-sm md:text-base max-w-md mx-auto mb-10 leading-relaxed">
          Your account doesn't have permission to view <span className="text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded uppercase tracking-widest text-xs border border-red-500/20">{moduleName}</span>. Please request access from the administrator.
        </p>
        
        <Link 
          href="/dashboard" 
          className="group inline-flex items-center gap-2 px-6 py-3.5 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all active:scale-95 shadow-lg hover:shadow-white/20"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Return to Dashboard
        </Link>
      </div>

      {/* Decorative Warning Tape effect (Optional subtle detail) */}
      <div className="absolute bottom-10 flex items-center gap-2 opacity-60">
        <span className="w-2 h-2 rounded-full bg-red-500" />
        <span className="text-[10px] uppercase font-mono tracking-widest text-red-500 underline">Security Clearance Required</span>
        <span className="w-2 h-2 rounded-full bg-red-500" />
      </div>
    </div>
  );
}