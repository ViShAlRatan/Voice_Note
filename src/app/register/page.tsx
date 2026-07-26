"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, UserPlus, Loader2, UploadCloud } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
 
import { sendWelcomeEmail } from "@/app/actions/auth";

export default function RegisterPage() {
  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    toast.loading("Creating your account...", { id: "register-toast" });

    startTransition(async () => {
      // 1. Sign Up User
      const { data: authData, error: authError } = await supabase.auth.signUp({ 
        email, 
        password 
      });
      
      if (authError) {
        toast.dismiss("register-toast");
        toast.error(authError.message, {
          style: { background: "#18181b", color: "white", border: "1px solid #ef4444" }
        });
        return;
      }

      const userId = authData.user?.id;
      let avatarUrl = "";

      // 2. Upload Profile Image if selected
      if (file && userId) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);
        
        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
          avatarUrl = publicUrlData.publicUrl;
        } else {
          toast.error("Image upload failed, but account was created.", {
            style: { background: "#18181b", color: "white", border: "1px solid #f59e0b" }
          });
        }
      }

      // 3. Update Profile Table with Name and Image
      if (userId) {
        await supabase.from('profiles').update({ 
          full_name: name, 
          avatar_url: avatarUrl 
        }).eq('id', userId);
      }

      // 🔥 4. SEND PREMIUM WELCOME EMAIL 🔥
      await sendWelcomeEmail(email, name);

      toast.dismiss("register-toast");

      toast("Account created successfully! 🎉", {
        icon: "🥳",
        description: "Check your email for a welcome message!", // Updated message
        duration: 4000, 
        style: {
          background: "#18181b",
          color: "white",
          border: "-0.5px solid #10b981", 
        },
      });
      
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    });
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-black p-4 text-white overflow-hidden selection:bg-white selection:text-black">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 blur-[130px] rounded-full pointer-events-none" 
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute top-4 left-4 md:top-8 md:left-8 z-10"
      >
        <Link 
          href="/" 
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/60 border border-white/10 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/80 hover:border-white/20 transition-all duration-300 backdrop-blur-xl shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </Link>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.1 }} 
        className="z-10 w-full max-w-md my-8"
      >
        <div className="rounded-3xl border border-white/10 bg-zinc-950/60 backdrop-blur-2xl p-8 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center mb-6"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/10 shadow-inner text-indigo-400">
              <UserPlus className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">Create an account</h2>
            <p className="text-sm text-zinc-400 mt-2 text-center">Enter your details to get started with the platform</p>
          </motion.div>
          
          <motion.form 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onSubmit={handleSubmit} 
            className="space-y-4"
          >
            <div className="flex flex-col items-center justify-center w-full mb-2">
              <label className="w-20 h-20 rounded-full border-2 border-dashed border-zinc-600 hover:border-indigo-500 bg-black/50 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all duration-300">
                {file ? (
                  <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-zinc-500 flex flex-col items-center">
                    <UploadCloud className="w-5 h-5 mb-1"/>
                    <span className="text-[9px] uppercase tracking-wider font-medium">Photo</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)} 
                  disabled={isPending}
                />
              </label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-300">Full Name</Label>
              <Input 
                id="name" 
                name="name" 
                type="text" 
                required 
                placeholder="Rudra Sharma" 
                disabled={isPending} 
                className="bg-black/50 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-indigo-500 h-11 transition-all duration-300" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                required 
                placeholder="hello@gmail.com" 
                disabled={isPending} 
                className="bg-black/50 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-indigo-500 h-11 transition-all duration-300" 
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
                  className="bg-black/50 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-indigo-500 h-11 pr-10 transition-all duration-300" 
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
            
            <Button 
              type="submit" 
              disabled={isPending} 
              className="w-full h-11 mt-6 bg-white text-black hover:bg-zinc-200 font-medium transition-all duration-300 active:scale-[0.98] shadow-lg rounded-xl"
            >
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isPending ? "Creating account..." : "Create Account"}
            </Button>
          </motion.form>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center text-xs text-zinc-500 mt-6"
          >
            Already have an account? <Link href="/login" className="text-white hover:underline transition-all">Sign in</Link>
          </motion.p>
        </div>
      </motion.div>
    </main>
  );
}