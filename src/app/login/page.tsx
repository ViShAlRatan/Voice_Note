"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // .trim() add kiya taaki aage/peeche ka space hat jaye
    const submittedEmail = (formData.get("email") as string).trim(); 

    // --- SECURITY CHECK FOR ADMIN ---
    if (submittedEmail.toLowerCase() === "admin@creator.com") {
      toast("Admin Account Detected!", {
        icon: "👑",
        description: "Please use the Admin Gateway to securely log in.",
        style: {
          background: "#18181b",
          color: "white",
          border: "-0.1px solid#a855f7", 
        },
        action: { label: "Admin Gateway", onClick: () => router.push("/admin-login") },
        duration: 5000,
      });
      return; 
    }

    startTransition(async () => {
      const result = await loginAction(formData);
      
      if (result?.error) {
        toast.error(`Error: ${result.error}`, { icon: "⚠️" });
      } else {
        // 🔥 PREMIUM LOGIN TOAST 🔥
        toast("Welcome back buddy! 🚀", {
          icon: "✨",
          description: "Logging you in securely...",
          style: {
            background: "#18181b",
            color: "white",
            border: "1px solid #6366f1", 
          },
        });
        
        setTimeout(() => {
          if (result?.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/dashboard");
          }
        }, 1000); 
      }
    });
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-black p-4
     text-white overflow-hidden selection:bg-white selection:text-black">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px]
       bg-indigo-500/15 blur-[150px] rounded-full pointer-events-none" />

      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-10">
        <Link href="/" className="group inline-flex items-center gap-2 px-4 py-2 rounded-full
        bg-zinc-900/60 border border-white/10 text-sm text-zinc-300 hover:text-white
         hover:bg-zinc-800/80 transition-all duration-300 backdrop-blur-xl shadow-lg">
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Home</span>
        </Link>
      </div>

      <div className="z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-700">
        <div className="rounded-3xl border border-white/10 bg-zinc-950/60 backdrop-blur-2xl p-8 
        md:p-10 shadow-2xl relative overflow-hidden">
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center 
            mb-4 border border-indigo-500/20 text-indigo-400">
              <LogIn className="w-6 h-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Welcome Back</h2>
            <p className="text-sm text-zinc-400 text-center">Enter your credentials to access your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Email Address</Label>
              <Input 
                name="email" 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending} 
                placeholder="you@gmail.com" 
                className="bg-black/50 border-white/10 text-white placeholder:text-zinc-600
                 focus-visible:ring-1 focus-visible:ring-indigo-500 h-11 rounded-xl" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  required 
                  placeholder="••••••••" 
                  disabled={isPending} 
                  className="bg-black/50 border-white/10 text-white placeholder:text-zinc-600 
                  focus-visible:ring-1 focus-visible:ring-indigo-500 h-11 pr-10 transition-all duration-300" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
  <Link href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
    Forgot password?
  </Link>
</div>
            
            <Button type="submit" disabled={isPending} className="w-full h-11 mt-4 bg-white text-black
             hover:bg-zinc-200 font-medium transition-all shadow-lg rounded-xl flex items-center justify-center gap-2">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-400">
            Don't have an account? <Link href="/register" className="text-white hover:underline underline-offset-4">Sign up</Link>
          </div>
          
          {/* Admin Navigation Link */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <Link href="/admin-login" className="block w-full">
              <Button 
                type="button" 
                variant="outline"
                className="group w-full h-11 border-zinc-800 bg-mauve-400 hover:bg-blue-500/10
                 hover:border-blue-500/20 text-black hover:text-purple-400 font-medium rounded-xl flex items-center justify-center gap-2 transition-all duration-300"
              >
                <ShieldCheck className="w-4 h-4 transition-transform group-hover:scale-110" />
                Access Admin Gateway
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}