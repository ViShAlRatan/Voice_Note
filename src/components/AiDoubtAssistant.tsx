"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePathname } from "next/navigation";
import { Send, Sparkles, Loader2, MessageSquare, CheckCircle2, X, Bot, LucideMessageSquareText } from "lucide-react";
import { submitContactAction } from "@/app/actions/contact";
import { toast } from "sonner";

export function AiDoubtAssistant() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);

  // "Ask me doubt" bubble ko 4 seconds baad auto-hide karne ke liye
  useEffect(() => {
    const timer = setTimeout(() => setShowBubble(false), 7000);
    return () => clearTimeout(timer);
  }, []);

  // Home Page ("/") par dikhane ke liye check
  if (pathname !== "/") {
    return null;
  }

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
        // 4 seconds baad success state reset karein
        setTimeout(() => setSubmitted(false), 4000);
      }
    });
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Floating Button with Auto-Hiding Bubble  */}
      {!isOpen && (
        <div className="relative flex items-center mb-2">
          {showBubble && (
            <div className="absolute right-16 bg-zinc-700 text-gray-300 text-xs font-bold px-3.5 py-2 rounded-xl border border-indigo-500/30 shadow-lg whitespace-nowrap animate-in fade-in duration-300">
              Ask me doubt
              <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-2 h-2 bg-zinc-700 border-r border-t border-indigo-500/30 rotate-45" />
            </div>
          )}

          <button
            onClick={() => {
              setIsOpen(true);
              setShowBubble(false);
            }}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo via-purple to-indigo-700 flex items-center justify-center text-white shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:scale-110 transition-transform duration-300 border-2 border-gray-600 cursor-pointer"
            aria-label="Open Doubt Form"
          >
            <LucideMessageSquareText className="w-7 h-7 animate-pulse text-white" />
          </button>
        </div>
      )}

      {/* Popup Glassmorphism Contact Card */}
      {isOpen && (
        <div className="w-[360px] sm:w-[440px] animate-in fade-in zoom-in-95 duration-300">
          <div className="rounded-3xl border border-white/10 bg-zinc-950/90 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.95)] relative overflow-hidden group hover:border-white/20 transition-all duration-500">
            
            {/* Background Ambient Glow inside Card */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/10 to-transparent blur-[80px] rounded-full pointer-events-none" />

            {/* Top Glowing Shimmer Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

            {/* Close (X) Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900/80 border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer z-20"
              aria-label="Close Form"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Section */}
            <div className="flex flex-col items-center mb-6 text-center relative z-10">
              <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-3 border border-indigo-500/20 text-indigo-400 shadow-inner group-hover:scale-110 transition-transform duration-500">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300 mb-2 backdrop-blur-md">
                <Sparkles className="w-3 h-3" />
                <span>Get in Touch</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                Any Doubt ?
              </h2>
              <p className="text-xs text-zinc-400 mt-1.5 max-w-xs leading-relaxed">
                Have an architecture question, Any doubt related to Content and Website, or want to collaborate? Drop a direct message.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 relative z-10">
              <div className="space-y-1.5">
                <Label className="text-zinc-300 text-[11px] uppercase tracking-wider font-mono">
                  Your Name
                </Label>
                <Input
                  name="name"
                  required
                  disabled={isPending}
                  placeholder="Rudra Sharma"
                  className="bg-black/60 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-indigo-500 h-10 rounded-xl text-xs transition-all duration-300 hover:border-white/20"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-zinc-300 text-[11px] uppercase tracking-wider font-mono">
                  Email Address
                </Label>
                <Input
                  name="email"
                  type="email"
                  required
                  disabled={isPending}
                  placeholder="rudra@gmail.com"
                  className="bg-black/60 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-indigo-500 h-10 rounded-xl text-xs transition-all duration-300 hover:border-white/20"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-zinc-300 text-[11px] uppercase tracking-wider font-mono">
                  Message
                </Label>
                <textarea
                  name="message"
                  required
                  disabled={isPending}
                  rows={3}
                  placeholder="Write your message here..."
                  className="flex w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 disabled:opacity-50 transition-all duration-300 hover:border-white/20 resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className={`w-full h-10 mt-2 font-medium text-xs transition-all duration-300 active:scale-95 shadow-xl rounded-xl flex items-center justify-center gap-2 cursor-pointer ${
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
                    <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    <span>Send Message</span>
                  </>
                )}
              </Button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}