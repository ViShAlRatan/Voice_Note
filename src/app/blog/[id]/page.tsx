import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Sparkles, Terminal } from "lucide-react";

interface BlogPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch the specific blog post by ID
  const { data: blog, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !blog) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 selection:bg-white selection:text-black relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-500/10 blur-[120px] pointer-events-none" />

      {/* Header & Back Button */}
      <div className="max-w-3xl mx-auto mb-12 flex items-center justify-between relative z-30">
        <a 
          href="/blog" 
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/60 border border-white/10 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/80 hover:border-white/20 transition-all duration-300 backdrop-blur-xl shadow-lg cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Back to Articles</span>
        </a>
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400 font-mono bg-zinc-900/40 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Engineering Post</span>
        </div>
      </div>

      {/* Article Header */}
      <article className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-4 mb-6 text-xs font-mono text-zinc-400">
          <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            {new Date(blog.created_at).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            {blog.read_time || "5 min read"}
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 leading-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
          {blog.title}
        </h1>

        {blog.excerpt && (
          <p className="text-xl text-zinc-300 font-normal leading-relaxed mb-8 p-6 rounded-2xl bg-zinc-950/40 border border-white/10 backdrop-blur-xl">
            {blog.excerpt}
          </p>
        )}

        {/* Article Body Content */}
        <div className="rounded-3xl border border-white/10 bg-zinc-950/40 p-8 md:p-12 backdrop-blur-xl shadow-2xl space-y-6 text-zinc-300 leading-relaxed text-base md:text-lg whitespace-pre-wrap">
          {blog.content || "No content provided for this article."}
        </div>

        {/* Footer Navigation Back */}
        <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
            <Terminal className="w-4 h-4 text-indigo-400" /> Published via Portfolio Admin CMS
          </div>
          <a 
            href="/blog" 
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
          >
            &larr; More Articles
          </a>
        </div>
      </article>

    </div>
  );
}