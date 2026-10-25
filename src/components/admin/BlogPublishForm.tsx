"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Terminal, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createBlogAction } from "@/app/actions/admin";

export default function BlogPublishForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isBlogPending, setIsBlogPending] = useState(false);

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget; 
    setIsBlogPending(true);
    
    startTransition(async () => {
      const result = await createBlogAction(new FormData(form));
      if (result?.error) {
        toast.error(result.error);
      } else { 
        toast.success(result?.message || "Blog Published Successfully!"); 
        form.reset(); 
        router.refresh(); 
      }
      setIsBlogPending(false);
    });
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl p-8 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
          <Terminal className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Publish Tech Blog Article</h2>
          <p className="text-xs text-zinc-400">Write and broadcast an engineering deep-dive</p>
        </div>
      </div>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-zinc-300">Article Title</Label>
            <Input name="title" required disabled={isBlogPending} placeholder="e.g. Mastering Next.js" className="bg-black/50 border-white/10 text-white h-11 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Read Time</Label>
            <Input name="read_time" required disabled={isBlogPending} placeholder="e.g. 5 min read" className="bg-black/50 border-white/10 text-white h-11 rounded-xl" />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-zinc-300">Excerpt / Summary</Label>
          <Input name="excerpt" required disabled={isBlogPending} placeholder="Short preview text..." className="bg-black/50 border-white/10 text-white h-11 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label className="text-zinc-300">Full Content / Markdown</Label>
          <textarea name="content" required disabled={isBlogPending} placeholder="Write your full article body here..." className="flex min-h-[120px] w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 mt-1" />
        </div>
        <Button type="submit" disabled={isBlogPending} className="w-full bg-white text-black hover:bg-zinc-200 font-medium h-11 rounded-xl mt-4">
          {isBlogPending ? <><Loader2 className="animate-spin w-4 h-4 mr-2"/> Publishing...</> : "Publish Article"}
        </Button>
      </form>
    </div>
  );
}