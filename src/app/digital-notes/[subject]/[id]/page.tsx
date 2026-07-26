import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Clock, List, ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ReadingPage({ params }: { params: Promise<{ subject: string, id: string }> }) {
  const { subject, id } = await params;
  const supabase = await createClient();

  // 1. Current Topic Fetch karna
  const { data: topic } = await supabase.from("digital_topics").select("*, digital_subjects(name)").eq("id", id).single();
  if (!topic) return notFound(); 

  // 2. Usi subject ke saare baaki topics fetch karna
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
            SIDEBAR: OTHER TOPICS IN THIS SUBJECT
            (Mobile: Horizontal Swipe Slider, Desktop: Vertical List)
        ========================================== */}
        <div className="w-full lg:w-80 shrink-0 mt-2 lg:mt-0">
          <div className="lg:sticky lg:top-24 lg:bg-zinc-950/60 lg:backdrop-blur-md lg:border border-white/10 rounded-3xl lg:p-5 lg:shadow-2xl">
            <div className="flex items-center gap-3 mb-4 lg:mb-6 lg:pb-4 lg:border-b border-white/10">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <List className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-lg text-white">Course Index</h3>
            </div>
            
            {/* 🔥 MOBILE HORIZONTAL SLIDER & DESKTOP VERTICAL LIST 🔥 */}
            <div className="flex gap-3 overflow-x-auto lg:flex-col lg:overflow-y-auto lg:max-h-[60vh] scrollbar-hide pb-4 lg:pb-0 snap-x snap-mandatory lg:snap-none pr-4 lg:pr-2">
              {allTopics?.map((t: any, index: number) => {
                const isActive = t.id === id;
                return (
                  <Link 
                    href={`/digital-notes/${subject}/${t.id}`} 
                    key={t.id}
                    className={`shrink-0 w-64 lg:w-full flex items-start gap-3 p-3.5 rounded-2xl transition-all snap-start ${
                      isActive 
                      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-md" 
                      : "bg-zinc-950/80 lg:bg-transparent border border-white/10 lg:border-transparent text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className={`text-xs font-mono mt-0.5 ${isActive ? 'text-emerald-500' : 'text-zinc-600'}`}>
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <div className="flex-1">
                      <p className={`text-sm font-bold leading-snug mb-1.5 ${isActive ? 'text-emerald-400' : 'text-zinc-300'}`}>
                        {t.title}
                      </p>
                      <p className="text-[10px] flex items-center gap-1 opacity-70">
                        <Clock className="w-3 h-3" /> {t.read_time}
                      </p>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4 mt-1 opacity-50" />}
                  </Link>
                );
              })}
            </div>
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

          {/* Article Body (HTML/Markdown render) */}
          <div className="prose prose-invert prose-emerald max-w-none text-zinc-300 md:text-lg leading-loose"
               dangerouslySetInnerHTML={{ __html: topic.content.replace(/\n/g, '<br/>') }} 
          />
        </div>

      </div>
    </div>
  );
}