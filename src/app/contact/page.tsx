"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Send, Sparkles, Loader2, MessageSquare, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { submitContactAction } from "@/app/actions/contact";
import { toast } from "sonner";

export default function ContactPage() {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await submitContactAction(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(result?.message || "Message sent!");
        setSubmitted(true);
        form.reset();
        // Reset success state after 4 seconds
        setTimeout(() => setSubmitted(false), 4000);
      }
    });
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-black p-6
     text-white overflow-hidden selection:bg-white selection:text-black">
      
      {/* Background Animated Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/10 to-transparent blur-[140px] rounded-full pointer-events-none animate-pulse duration-1000" />

      {/* Floating Back Button */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20 animate-in fade-in slide-in-from-top-4 
      duration-500">
        <Link 
          href="/" 
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/60 border
           border-white/10 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/80 hover:border-white/20 transition-all duration-300 backdrop-blur-xl shadow-lg cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Home</span>
        </Link>
      </div>

      {/* Main Glassmorphism Card */}
      <div className="z-10 w-full max-w-lg animate-in fade-in zoom-in-95 duration-700">
        <div className="rounded-3xl border border-white/10 bg-zinc-950/60 backdrop-blur-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden group hover:border-white/20 transition-all duration-500">
          
          {/* Top Glowing Shimmer Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

          {/* Header Section */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4 border border-indigo-500/20 text-indigo-400 shadow-inner group-hover:scale-110 transition-transform duration-500">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 mb-2 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Get in Touch</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Let&apos;s Build Together
            </h2>
            <p className="text-sm text-zinc-400 mt-2 max-w-sm leading-relaxed">
              Have an architecture question, project in mind, or want to collaborate? Drop a direct message.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-300 text-xs uppercase tracking-wider font-mono">Your Name</Label>
              <Input 
                name="name" 
                required 
                disabled={isPending} 
                placeholder="Rudra Sharma" 
                className="bg-black/50 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-indigo-500 h-11 rounded-xl transition-all duration-300 hover:border-white/20" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300 text-xs uppercase tracking-wider font-mono">Email Address</Label>
              <Input 
                name="email" 
                type="email" 
                required 
                disabled={isPending} 
                placeholder="rudra@gmail.com" 
                className="bg-black/50 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-indigo-500 h-11 rounded-xl transition-all duration-300 hover:border-white/20" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300 text-xs uppercase tracking-wider font-mono">Message</Label>
              <textarea 
                name="message" 
                required 
                disabled={isPending}
                rows={4}
                placeholder="Write your message here..." 
                className="flex w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 disabled:opacity-50 transition-all duration-300 hover:border-white/20 resize-none" 
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isPending} 
              className={`w-full h-11 mt-4 font-medium transition-all duration-300 active:scale-95 shadow-xl rounded-xl flex items-center justify-center gap-2 ${
                submitted 
                  ? "bg-emerald-500 text-black hover:bg-emerald-400" 
                  : "bg-white text-black hover:bg-zinc-200"
              }`}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Sending message...</span>
                </>
              ) : submitted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>Message Sent Successfully!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  <span>Send Message</span>
                </>
              )}
            </Button>
          </form>

        </div>
      </div>

    </main>
  );
}