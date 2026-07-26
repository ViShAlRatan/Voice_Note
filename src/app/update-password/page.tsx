"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Loader2 } from "lucide-react";
import { updatePasswordAction } from "@/app/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updatePasswordAction(formData);
      if (result?.error) toast.error(result.error);
      else {
        toast.success(result.message);
        router.push("/dashboard"); // Password update hone ke baad direct dashboard!
      }
    });
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-black p-4 text-white overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="rounded-3xl border border-white/10 bg-zinc-950/60 backdrop-blur-2xl p-8 md:p-10 shadow-2xl relative">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Create New Password</h2>
          <p className="text-sm text-zinc-400 mb-8">Your identity has been verified. Please enter your new password below.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input name="password" type="password" required disabled={isPending} placeholder="Enter a strong password" className="bg-black/50 border-white/10 h-11 rounded-xl" />
            </div>
            <Button type="submit" disabled={isPending} className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium mt-2">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {isPending ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}