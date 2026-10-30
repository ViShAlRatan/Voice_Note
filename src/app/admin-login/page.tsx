"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, ArrowLeft, Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await loginAction(formData);
      
      if (result?.error) {
        toast.error(`Admin Auth Error: ${result.error}`, { icon: "🛡️" });
      } else if (result?.role !== "admin") {
        toast.error("Access Denied: Admin privileges required.", { icon: "⛔" });
      } else {
        toast("Admin Gateway Verified! 👑", {
          icon: "✨",
          description: "Entering secure publishing CMS...",
          style: {
            background: "#1A1C24",
            color: "#F4F4F6",
            border: "1px solid rgba(139,92,246,0.4)",
          },
        });
        
        setTimeout(() => {
          router.push("/admin");
        }, 800); 
      }
    });
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#121318] p-4 text-[#F4F4F6] overflow-hidden">
      
      {/* Background Ambient Violet Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-10">
        <Link href="/" className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl clay-button text-sm text-zinc-300 hover:text-white transition-all shadow-lg border border-white/5">
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1 text-violet-400" />
          <span>Home</span>
        </Link>
      </div>

      <div className="z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-700">
        <div className="clay-card p-8 md:p-10 relative overflow-hidden bg-gradient-to-br from-[#1A1C24] to-[#121318] border border-violet-500/20">
          
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full clay-badge text-violet-400 text-xs font-semibold shadow-inner">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Restricted Admin Gateway</span>
            </div>
          </div>

          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-3xl clay-button flex items-center justify-center mb-4 text-violet-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">Admin Portal</h2>
            <p className="text-xs text-zinc-400 text-center font-medium">Enter authorized credentials to manage publishing CMS.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-violet-400" /> Admin Email
              </Label>
              <Input 
                name="email" 
                type="email" 
                required 
                disabled={isPending} 
                placeholder="admin@creator.com" 
                className="clay-input text-white placeholder:text-zinc-600 h-12 px-4 border-none" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-violet-400" /> Password
              </Label>
              <div className="relative">
                <Input 
                  id="password" 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  required 
                  placeholder="••••••••" 
                  disabled={isPending} 
                  className="clay-input text-white placeholder:text-zinc-600 h-12 px-4 pr-12 border-none" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-violet-400 hover:text-violet-300 transition-colors font-semibold"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            
            <Button type="submit" disabled={isPending} className="w-full h-12 mt-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold transition-all shadow-[0_10px_20px_rgba(139,92,246,0.3)] rounded-2xl flex items-center justify-center gap-2 border border-violet-400/20 active:scale-[0.98]">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isPending ? "Verifying Admin..." : "Authenticate Admin CMS"}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <Link href="/login" className="text-xs text-zinc-400 hover:text-white transition-colors font-medium">
              ← Return to Student Login
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}