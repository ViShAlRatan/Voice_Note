import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Sparkles, Calendar, Clock, Terminal, Lock } from "lucide-react";

export default async function BlogPage() {
  const supabase = await createClient();

  // 1. Fetch current logged in user
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Agar user login nahi hai, ya phir profile mein uski permissions check karein
  let hasAccess = false;
  
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, can_view_blogs')
      .eq('id', user.id)
      .single();

    // Agar Admin hai YA phir blog permission true hai, tabhi access do
    if (profile?.role === 'admin' || profile?.can_view_blogs === true) {
      hasAccess = true;
    }
  }

  // 3. AGAR ACCESS NAHI HAI TOH  LOCK SCREEN DIKHAO 
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-white relative overflow-hidden selection:bg-white selection:text-black">
        {/* Deep Red Warning Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="z-10 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-700">
          <div className="w-24 h-24 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-8 shadow-2xl shadow-red-500/10">
            <Lock className="w-12 h-12 text-red-400" />
          </div>
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs text-red-400 mb-4 backdrop-blur-md uppercase tracking-widest font-mono">
            Security Protocol
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
            Access Restricted
          </h1>
          
          <p className="text-zinc-400 text-base max-w-md mb-10 leading-relaxed">
            Your clearance level does not permit access to the Engineering Journal. Please contact the system administrator to request permissions.
          </p>
          
          <a href="/dashboard" className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Return to Workspace
          </a>
        </div>
      </div>
    );
  }

  // 4. AGAR ACCESS HAI, TOH BLOGS FETCH KARO
  const { data: blogs, error } = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 selection:bg-white selection:text-black relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-500/10 blur-[120px] pointer-events-none" />

      {/* Header & Back Button */}
      <div className="max-w-7xl mx-auto mb-12 flex items-center justify-between relative z-30">
        <a 
          href="/dashboard" 
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/60 border border-white/10 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/80 hover:border-white/20 transition-all duration-300 backdrop-blur-xl shadow-lg cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Back</span>
        </a>
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400 font-mono bg-zinc-900/40 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Engineering Journal</span>
        </div>
      </div>

      {/* Page Title Section */}
      <div className="max-w-7xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 mb-4 backdrop-blur-md">
          <Terminal className="w-3.5 h-3.5" />
          <span>Tech Blogs & Articles</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
          Deep-Dive Architecture.
        </h1>
        <p className="text-zinc-400 text-lg max-w-xl leading-relaxed">
          Read technical breakdowns on Flutter state management, Next.js 15 App Router patterns, and PostgreSQL Row Level Security.
        </p>
      </div>

      {/* Blogs Grid */}
      <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-400 text-center backdrop-blur-xl">
            <p className="font-bold">Database Error:</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        ) : !blogs || blogs.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-950/50 p-16 text-center backdrop-blur-xl shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-zinc-400 shadow-inner">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Articles Found</h3>
            <p className="text-zinc-400 text-sm max-w-sm mx-auto mb-6 leading-relaxed">
              We haven&apos;t published any technical blogs yet. Stay tuned for upcoming architecture deep-dives!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog, index) => (
              <div 
                key={blog.id}
                style={{ animationDelay: `${index * 100}ms` }}
                className="group rounded-2xl border border-white/10 bg-zinc-950/40 p-6 backdrop-blur-xl hover:border-white/30 hover:bg-zinc-900/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 text-xs font-mono text-zinc-500">
                    <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                      <Calendar className="w-3 h-3 text-indigo-400" />
                      {new Date(blog.created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-zinc-400" />
                      {blog.read_time || "5 min read"}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold mb-2 group-hover:text-indigo-400 transition-colors duration-300">
                    {blog.title}
                  </h3>
                  <p className="text-zinc-400 text-sm line-clamp-3 mb-6 leading-relaxed">
                    {blog.excerpt || blog.content || "No excerpt provided for this article."}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <a 
                    href={`/blog/${blog.id}`} 
                    className="w-full inline-block"
                  >
                    <Button className="w-full bg-white text-black hover:bg-zinc-200 text-xs font-medium transition-all duration-300 active:scale-95 shadow-lg rounded-xl">
                      Read Article &rarr;
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}