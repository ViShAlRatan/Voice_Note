"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, KeyRound } from "lucide-react";
import Link from "next/link";
import { resetPasswordAction } from "@/app/actions/auth";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await resetPasswordAction(formData);
      if (result?.error) toast.error(result.error);
      else toast.success(result.message);
    });
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-black p-4 text-white overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="absolute top-6 left-6 z-10">
        <Link href="/login" className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/60 border border-white/10 text-sm hover:text-white transition-all backdrop-blur-xl">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Login
        </Link>
      </div>

      <div className="z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="rounded-3xl border border-white/10 bg-zinc-950/60 backdrop-blur-2xl p-8 md:p-10 shadow-2xl relative">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/20 text-indigo-400">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
          <p className="text-sm text-zinc-400 mb-8">Enter your email and we'll send you a secure link to reset your password.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input name="email" type="email" required disabled={isPending} placeholder="you@example.com" className="bg-black/50 border-white/10 h-11 rounded-xl" />
            </div>
            <Button type="submit" disabled={isPending} className="w-full h-11 bg-white text-black hover:bg-zinc-200 rounded-xl font-medium mt-2">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {isPending ? "Sending Link..." : "Send Reset Link"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}