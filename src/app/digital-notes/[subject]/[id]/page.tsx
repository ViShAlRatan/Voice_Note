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

  // 2. Usi subject ke saare baaki topics fetch karna (Sidebar list ke liye)
  const { data: allTopics } = await supabase
    .from("digital_topics")
    .select("id, title, read_time, paper_type, unit_number")
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
        <div className="flex items-center gap-3">
          {topic.paper_type && (
            <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-500/20 hidden md:block">
              {topic.paper_type === 'paper1' ? 'Paper 1' : 'Paper 2'}
            </span>
          )}
          <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-500/20 hidden md:block">
            {subjectName}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-10 lg:gap-12 relative">
        
        {/* ==========================================
            SIDEBAR (Course Index)
        ========================================== */}
        <div className="w-full lg:w-80 shrink-0 mt-2 lg:mt-0">
          <div className="lg:sticky lg:top-24 lg:bg-zinc-950/60 lg:backdrop-blur-md lg:border border-white/10 rounded-3xl lg:p-5 lg:shadow-2xl">
            
            <div className="flex flex-col gap-1 mb-6 pb-4 border-b border-white/10">
              <span className="text-emerald-500 font-bold text-xs tracking-widest uppercase flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Syllabus Index
              </span>
              <h3 className="font-extrabold text-2xl text-white">{subjectName}</h3>
            </div>
            
            {/* Dynamic Sidebar list of topics */}
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
                        {t.title || "Untitled"}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] flex items-center gap-1 opacity-70">
                          <Clock className="w-3 h-3" /> {t.read_time}
                        </p>
                        {t.unit_number && (
                          <span className="text-[9px] bg-white/10 px-1.5 rounded opacity-70">
                            {String(t.unit_number).replace('unit', 'Unit ')}
                          </span>
                        )}
                      </div>
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
            <div className="flex items-center gap-2 mb-3">
               {topic.unit_number && (
                  <span className="bg-purple-500/10 text-purple-400 text-xs px-2 py-1 rounded-md border border-purple-500/20 font-bold uppercase tracking-wider">
                    {String(topic.unit_number).replace('unit', 'Unit ')}
                  </span>
                )}
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-5 leading-tight">{topic.title}</h1>
            <div className="flex items-center gap-4 text-zinc-400 text-sm font-medium">
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <Clock className="w-4 h-4 text-emerald-400" /> {topic.read_time} read
              </span>
            </div>
          </div>

          {/* 🔥 CRASH-PROOF ARTICLE BODY (Handles both Pages & Single Content) 🔥 */}
          <div className="space-y-12">
            
            {/* 1. Agar Admin ne naya Multi-page Note upload kiya hai */}
            {topic.pages && Array.isArray(topic.pages) && topic.pages.length > 0 ? (
              topic.pages.map((pageContent: string, idx: number) => (
                <div key={idx} className="relative">
                  {topic.pages.length > 1 && (
                    <div className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-4 border-b border-white/5 pb-2">
                      Page {idx + 1}
                    </div>
                  )}
                  <div className="prose prose-invert prose-emerald max-w-none text-zinc-300 md:text-lg leading-loose"
                       dangerouslySetInnerHTML={{ __html: (pageContent || "").replace(/\n/g, '<br/>') }} 
                  />
                </div>
              ))
            ) : (
              /* 2. Agar Purana Single-page Note hai */
              <div className="prose prose-invert prose-emerald max-w-none text-zinc-300 md:text-lg leading-loose"
                   dangerouslySetInnerHTML={{ __html: (topic.content || "").replace(/\n/g, '<br/>') }} 
              />
            )}

          </div>
        </div>

      </div>
    </div>
  );
}