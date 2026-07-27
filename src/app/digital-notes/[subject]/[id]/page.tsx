import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Clock, ChevronRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ReadingPage({ params }: { params: Promise<{ subject: string, id: string }> }) {
  const { subject, id } = await params;
  const supabase = await createClient();

  // 1. Current Topic Fetch karna
  const { data: topic } = await supabase.from("digital_topics").select("*, digital_subjects(name)").eq("id", id).single();
  if (!topic) return notFound(); 

  // 2. Usi subject ke saare baaki topics fetch karna (Aage chal kar isko Unit-wise filter karenge)
  const { data: allTopics } = await supabase
    .from("digital_topics")
    .select("id, title, read_time")
    .eq("subject_id", subject)
    .order("created_at", { ascending: true });

  const subjectName = topic.digital_subjects?.name || "Subject Topics";

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 font-sans pb-24">
      
      {/* --- TOP NAVIGATION BAR --- */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 py-4 flex items-center justify-between">
        <Link href={`/notes?view=digital&subject=${subject}`} className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-emerald-400 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Notes
        </Link>
        <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-500/20 hidden md:block">
          {subjectName}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-10 lg:gap-12 relative">
        
        {/* ==========================================
            SIDEBAR: UGC NET SYLLABUS & UNITS
        ========================================== */}
        <div className="w-full lg:w-80 shrink-0 mt-2 lg:mt-0">
          <div className="lg:sticky lg:top-24 lg:bg-zinc-950/60 lg:backdrop-blur-md lg:border border-white/10 rounded-3xl lg:p-5 lg:shadow-2xl">
            
            {/* Main Heading */}
            <div className="flex flex-col gap-1 mb-6 pb-4 border-b border-white/10">
              <span className="text-emerald-500 font-bold text-xs tracking-widest uppercase flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Syllabus
              </span>
              <h3 className="font-extrabold text-2xl text-white">UGC NET Computer Science</h3>
            </div>
            
            {/* 🔥 PAPER 1 BUTTON & 10 UNITS 🔥 */}
            <details className="group mb-3 border border-white/10 rounded-2xl bg-zinc-900/40 open:bg-zinc-900/80 transition-all duration-300">
              <summary className="flex items-center justify-between p-4 cursor-pointer list-none font-bold text-zinc-200 select-none">
                Paper 1 (General)
                <ChevronRight className="w-5 h-5 transition-transform duration-300 group-open:rotate-90 text-emerald-500" />
              </summary>
              <div className="p-4 pt-0 border-t border-white/5 mt-2 flex flex-col gap-2 max-h-60 overflow-y-auto scrollbar-hide">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((unit) => (
                  <div key={unit} className="p-2.5 bg-black/50 rounded-xl text-sm font-medium text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 cursor-pointer border border-transparent hover:border-emerald-500/30 transition-all">
                    Unit {unit}: Teaching & Research
                  </div>
                ))}
              </div>
            </details>

            {/* 🔥 PAPER 2 BUTTON & 10 UNITS 🔥 */}
            <details className="group border border-white/10 rounded-2xl bg-zinc-900/40 open:bg-zinc-900/80 transition-all duration-300">
              <summary className="flex items-center justify-between p-4 cursor-pointer list-none font-bold text-zinc-200 select-none">
                Paper 2 (CS)
                <ChevronRight className="w-5 h-5 transition-transform duration-300 group-open:rotate-90 text-emerald-500" />
              </summary>
              <div className="p-4 pt-0 border-t border-white/5 mt-2 flex flex-col gap-2 max-h-60 overflow-y-auto scrollbar-hide">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((unit) => (
                  <div key={unit} className="p-2.5 bg-black/50 rounded-xl text-sm font-medium text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 cursor-pointer border border-transparent hover:border-emerald-500/30 transition-all">
                    Unit {unit}: CS Subject Name
                  </div>
                ))}
              </div>
            </details>

          </div>
        </div>

        {/* ==========================================
            MAIN ARTICLE CONTENT
        ========================================== */}
        <div className="flex-1">
          {/* Article Header */}
          <div className="mb-8 pb-8 border-b border-white/10 mt-2 lg:mt-0">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-5 leading-tight">{topic.title}</h1>
            <div className="flex items-center gap-4 text-zinc-400 text-sm font-medium">
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <Clock className="w-4 h-4 text-emerald-400" /> {topic.read_time} read
              </span>
            </div>
          </div>

          {/* Article Body */}
          <div className="prose prose-invert prose-emerald max-w-none text-zinc-300 md:text-lg leading-loose"
               dangerouslySetInnerHTML={{ __html: topic.content.replace(/\n/g, '<br/>') }} 
          />
        </div>

      </div>
    </div>
  );
}