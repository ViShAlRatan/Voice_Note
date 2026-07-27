export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import LockedScreen from "@/components/ui/LockedScreen";
import PermissionLocked from "@/components/ui/PermissionLocked";
import { ArrowLeft, BookOpen, ExternalLink, Sparkles, MonitorSmartphone, PenTool, ChevronRight, Clock, FileText, Layers } from "lucide-react";
import Link from "next/link";
import DigitalSearch from "@/components/ui/DigitalSearch";

export default async function NotesPage({ searchParams }: { searchParams: Promise<{ view?: string, subject?: string, paper?: string }> }) {
  const supabase = await createClient();
  const params = await searchParams;
  
  const activeView = params.view || "digital"; 
  const activePaper = params.paper || "paper1"; // 🔥 NAYA: Paper select karne ke liye default state

  // 1. Authentication Check (Login check)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <LockedScreen title="Knowledge Base" />;

  //  2. PERMISSION CHECK (Database se profile check karna) 
  const { data: profile } = await supabase
    .from("profiles")
    .select("can_view_notes") 
    .eq("id", user.id)
    .single();

  // Agar profile nahi mili ya admin ne permission 'false' kar di hai
  if (!profile || profile.can_view_notes === false) {
    return (
      <div className="min-h-screen bg-black">
        <PermissionLocked moduleName="Knowledge Base" />
      </div>
    );
  }

  // 2. Fetch Data from Real Database
  const { data: handwrittenNotes } = await supabase.from("notes").select("*").order("created_at", { ascending: false });
  const { data: digitalSubjects } = await supabase.from("digital_subjects").select("*").order("created_at", { ascending: true });
  
  // Search bar aur logic ke liye SAARE topics ek sath fetch kiye
  const { data: allDigitalTopics } = await supabase.from("digital_topics").select("*, digital_subjects(name)");

  // 🔥 SMART LOGIC: Sirf wahi Subjects side mein dikhayein jinme Active Paper ke topics dale gaye hain
  const subjectsForActivePaper = digitalSubjects?.filter(sub => {
    return allDigitalTopics?.some(topic => topic.subject_id === sub.id && topic.paper_type === activePaper);
  }) || [];

  // Dynamic Active Subject Handle karna
  const activeSubject = params.subject || (subjectsForActivePaper.length > 0 ? subjectsForActivePaper[0].id : null);
  
  // Topics ko filter karna (Subject aur Paper dono match hone chahiye)
  const currentTopics = allDigitalTopics?.filter(topic => 
    topic.subject_id === activeSubject && topic.paper_type === activePaper
  ) || [];

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-6 py-12 selection:bg-emerald-500/30 selection:text-white relative overflow-hidden font-sans pb-24">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-emerald-500/10 blur-[120px] pointer-events-none" />

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10 flex items-center justify-between relative z-30">
        <Link href="/dashboard" className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/60 border border-white/10 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-all backdrop-blur-md">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back
        </Link>
        <div className="flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-widest text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-emerald-500/20">
          <Sparkles className="w-3.5 h-3.5" /><span>Unlocked</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-white">Knowledge Base.</h1>
        <p className="text-zinc-400 text-base md:text-lg max-w-2xl">Master engineering subjects with structured guides or handwritten notes.</p>
      </div>

      {/* VIEW TOGGLE */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-wrap items-center gap-3">
        <Link href="?view=digital" scroll={false} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${activeView === "digital" ? "bg-white text-black border-white shadow-xl scale-105" : "bg-zinc-900/50 text-zinc-400 border-white/10"}`}>
          <MonitorSmartphone className="w-4 h-4" /> Digital Notes
        </Link>
        <Link href="?view=handwritten" scroll={false} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${activeView === "handwritten" ? "bg-white text-black border-white shadow-xl scale-105" : "bg-zinc-900/50 text-zinc-400 border-white/10"}`}>
          <PenTool className="w-4 h-4" /> Handwritten Notes
        </Link>
        <Link href="?view=questions" scroll={false} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${activeView === "questions" ? "bg-white text-black border-white shadow-xl scale-105" : "bg-zinc-900/50 text-zinc-400 border-white/10"}`}>
          <BookOpen className="w-4 h-4" /> Question Bank
        </Link>
        <Link 
  href="/performance" 
  className="flex items-center gap-4 p-5 rounded-2xl bg-zinc-950/60 border border-white/10 hover:border-emerald-500/50 hover:bg-zinc-900/50 transition-all cursor-pointer group shadow-lg backdrop-blur-md"
>
  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
    📈
  </div>
  <div>
    <h4 className="font-bold text-sm text-zinc-200">My Performance</h4>
    <p className="text-[11px] text-zinc-500">Track your test scores & history</p>
  </div>
</Link>
      </div>

      {/* ==========================================
          VIEW 1: DIGITAL NOTES (GFG STYLE)
      ========================================== */}
      {activeView === "digital" && (
        <div className="max-w-7xl mx-auto relative z-20">
          
          {/* 🔥 SAFE Search Bar 🔥 */}
          <div className="mb-6 w-full max-w-2xl">
            <DigitalSearch 
              allTopics={(allDigitalTopics || []).map(topic => ({
                ...topic,
                title: topic.title || "",
                description: topic.description || ""
              }))} 
            />
          </div>
          <div className="mb-6 flex flex-col gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight flex flex-wrap items-center gap-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">
                UGC NET
              </span>
              <span className="text-white">Computer Science</span>
            </h2>
            <div className="flex items-center gap-2 text-xs md:text-sm font-bold tracking-widest uppercase">
              <span className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">Paper 1</span>
              <span className="text-zinc-500 text-lg">+</span>
              <span className="text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">Paper 2</span>
            </div>
          </div>

          {/* 🔥 NAYA: PAPER 1 & PAPER 2 TOGGLE (SEARCH KE NICHE) 🔥 */}
          <div className="flex bg-zinc-900/80 border border-white/10 rounded-xl p-1 mb-10 w-full md:w-max shadow-xl">
            <Link 
              href="?view=digital&paper=paper1" scroll={false} 
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm rounded-lg font-bold transition-all ${activePaper === 'paper1' ? 'bg-blue-600 text-white shadow-md' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
            >
              <Layers className="w-4 h-4" /> Paper 1 (General)
            </Link>
            <Link 
              href="?view=digital&paper=paper2" scroll={false} 
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm rounded-lg font-bold transition-all ${activePaper === 'paper2' ? 'bg-purple-600 text-white shadow-md' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
            >
              <Layers className="w-4 h-4" /> Paper 2 (CS)
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* RESPONSIVE HORIZONTAL SCROLL FOR MOBILE, VERTICAL FOR PC */}
            <div className="w-full md:w-64 shrink-0">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 px-1">Subjects</h3>
              <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
                
                {/* 🔥 Ab map digitalSubjects par nahi, subjectsForActivePaper par chalega 🔥 */}
                {subjectsForActivePaper?.map((sub) => (
                  <Link key={sub.id} href={`?view=digital&paper=${activePaper}&subject=${sub.id}`} scroll={false}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all border shrink-0 md:shrink border-transparent whitespace-nowrap ${activeSubject === sub.id ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-lg" : "bg-zinc-950/50 text-zinc-400 border-white/5"}`}
                  >
                    <span className="text-lg">{sub.icon}</span>
                    <span className="font-semibold text-sm">{sub.name}</span>
                  </Link>
                ))}

                {/* Empty State for Sidebar */}
                {(!subjectsForActivePaper || subjectsForActivePaper.length === 0) && (
                  <p className="text-xs text-zinc-600 px-2 py-4 border border-dashed border-white/10 rounded-xl text-center">
                    No subjects added for {activePaper === 'paper1' ? 'Paper 1' : 'Paper 2'} yet.
                  </p>
                )}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-2xl font-bold">{subjectsForActivePaper?.find(s => s.id === activeSubject)?.name || "Select Subject"}</h2>
                <span className="bg-zinc-800 text-zinc-300 text-xs px-2.5 py-1 rounded-full font-mono">{currentTopics?.length || 0} Topics</span>
              </div>

              {currentTopics && currentTopics.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {currentTopics.map((topic) => (
                    <Link href={`/digital-notes/${activeSubject}/${topic.id}`} key={topic.id} className="group bg-zinc-950/60 backdrop-blur-md border border-white/10 hover:border-emerald-500/40 p-5 rounded-3xl transition-all hover:shadow-2xl hover:shadow-emerald-500/5 flex flex-col justify-between">
                      <div>
                        
                        {/* 🔥 SAFE: PAPER & UNIT BADGES 🔥 */}
                        <div className="flex items-center gap-2 mb-3">
                          {topic.paper_type && (
                            <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2 py-1 rounded-md border border-blue-500/20 font-bold uppercase tracking-wider">
                              {topic.paper_type === 'paper1' ? 'Paper 1' : 'Paper 2'}
                            </span>
                          )}
                          {topic.unit_number && (
                            <span className="bg-purple-500/10 text-purple-400 text-[10px] px-2 py-1 rounded-md border border-purple-500/20 font-bold uppercase tracking-wider">
                              {String(topic.unit_number).replace('unit', 'Unit ')}
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mb-2">{topic.title}</h3>
                        <p className="text-sm text-zinc-400 leading-relaxed mb-6 line-clamp-2">{topic.description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium"><Clock className="w-3.5 h-3.5" /> {topic.read_time}</div>
                        <div className="flex items-center text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">Read Topic <ChevronRight className="w-4 h-4 ml-1" /></div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl bg-zinc-950/30">
                  <FileText className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                  <p className="text-zinc-500 font-medium">Topics are currently being updated.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          VIEW 2: HANDWRITTEN NOTES (PDFs)
      ========================================== */}
      {activeView === "handwritten" && (
        <div className="max-w-7xl mx-auto relative z-20">
          {(!handwrittenNotes || handwrittenNotes.length === 0) ? (
            <div className="py-24 text-center border border-dashed border-white/10 rounded-3xl bg-zinc-950/40 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500 shadow-xl">
               <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-white/5 shadow-inner">
                 <BookOpen className="w-10 h-10 text-zinc-600" />
               </div>
               <h3 className="text-2xl font-bold text-white mb-3">No Notes Available</h3>
               <p className="text-zinc-400 text-sm max-w-md leading-relaxed">
                 The admin hasn't published any handwritten PDFs yet. Please check back later for updates!
               </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
              {handwrittenNotes.map((note) => (
                <div key={note.id} className="rounded-3xl border border-white/10 bg-zinc-950/60 backdrop-blur-xl p-6 hover:border-emerald-500/30 transition-all group flex flex-col justify-between hover:shadow-2xl hover:shadow-emerald-500/5">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20 text-emerald-400 shadow-inner">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold mb-2 text-white">{note.title}</h2>
                    <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-4 bg-emerald-500/10 inline-block px-2.5 py-1 rounded-md border border-emerald-500/20">
                      {note.subject}
                    </p>
                    <p className="text-sm text-zinc-400 leading-relaxed mb-6 line-clamp-3">
                      {note.description}
                    </p>
                  </div>
                  <a 
                    href={note.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center gap-2 w-full bg-white text-black hover:bg-zinc-200 font-bold h-12 rounded-xl transition-all active:scale-95 shadow-lg group-hover:shadow-white/20 mt-4"
                  >
                     View / Download PDF <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          VIEW 3: QUESTION BANK (MCQs)
      ========================================== */}
      {activeView === "questions" && (
        <div className="max-w-7xl mx-auto relative z-20 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:border-emerald-500/40 transition-all group hover:shadow-2xl hover:shadow-emerald-500/5">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20 text-blue-400">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Paper 1 (General)</h3>
              <p className="text-zinc-400 mb-8 leading-relaxed">Practice MCQs for Teaching & Research Aptitude. Chapter-wise questions with detailed explanations.</p>
              <Link href="/practice?paper=paper1" className="inline-flex items-center justify-center w-full bg-white text-black font-bold h-12 rounded-xl hover:bg-zinc-200 transition-colors">
                Start Practice <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            <div className="bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:border-emerald-500/40 transition-all group hover:shadow-2xl hover:shadow-emerald-500/5">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20 text-purple-400">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Paper 2 (Computer Science)</h3>
              <p className="text-zinc-400 mb-8 leading-relaxed">Master Computer Science with 10 Units of topic-wise MCQs. Test your knowledge now.</p>
              <Link href="/practice?paper=paper2" className="inline-flex items-center justify-center w-full bg-white text-black font-bold h-12 rounded-xl hover:bg-zinc-200 transition-colors">
                Start Practice <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}