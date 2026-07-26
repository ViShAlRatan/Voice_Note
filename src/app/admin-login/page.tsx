"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, ArrowLeft, Loader2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  // Maine admin credentials pehle se fill kar diye hain taaki aapko baar-baar type na karna pade
  const [email, setEmail] = useState("admin@creator.com");
  const [password, setPassword] = useState("Admin@12345");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Button click hote hi turant Loading Toast show hoga
    toast.loading("Verifying Admin Identity...", { id: "admin-auth" });

    startTransition(async () => {
      const result = await loginAction(formData);
      
      if (result?.error) {
        toast.error(`Login Failed: ${result.error}`, { id: "admin-auth" });
      } else {
        // Check if user is actually an admin
       // Check if user is actually an admin
        if (result?.role === "admin") {
          
          // 1. Purane loading toast ko turant delete/kill kar do
          toast.dismiss("admin-auth"); 

          // 2. Ekdum naya VIP toast banao (isme ID ki zarurat nahi hai)
          toast("Admin Gateway Unlocked! ⚡", {
            icon: "🛡️",
            description: "Welcome back, Commander. Authorizing access...",
            duration: 2000, 
            style: {
              background: "#18181b", 
              color: "white",
              border: "1px solid #a855f7", 
            },
          });
          
          setTimeout(() => {
            router.push("/admin"); 
          }, 1000);
        } else {
          toast.error("Access Denied: This account is not an Admin.", { id: "admin-auth" });
        }
      }
    });
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-black p-4 text-white overflow-hidden selection:bg-white selection:text-black">
      
      {/* Red/Purple VIP Admin Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-red-purple/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-10">
        <Link href="/login" className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/60 border border-white/10 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-all duration-300 backdrop-blur-xl shadow-lg">
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Back</span>
        </Link>
      </div>

      <div className="z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-700">
        <div className="rounded-3xl border border-purple-500/20 bg-zinc-950/80 backdrop-blur-2xl p-8 md:p-10 shadow-2xl shadow-red-500/5 relative overflow-hidden">
          
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4 border border-purple-500/20 text-purple-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Admin Gateway</h2>
            <p className="text-sm text-zinc-400">Restricted Area. Authorized personnel only.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Admin Email</Label>
              <Input 
                name="email" 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending} 
                className="bg-black/50 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-blue-200 h-11 rounded-xl" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Master Password</Label>
              <Input 
                name="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPending} 
                className="bg-black/50 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-blue-200 h-11 rounded-xl" 
              />
            </div>
            
            <Button type="submit" disabled={isPending} className="w-full h-12 mt-6 bg-purple-600 hover:bg-purple-700 text-white font-medium transition-all shadow-lg shadow-purple-500/20 rounded-xl flex items-center justify-center gap-2">
              {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldAlert className="h-5 w-5" />}
              {isPending ? "Authenticating..." : "Login to Admin CMS"}
            </Button>
          </form>

        </div>
      </div>
    </main>
  );
}