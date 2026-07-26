export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import LockedScreen from "@/components/ui/LockedScreen";
import PermissionLocked from "@/components/ui/PermissionLocked";
import { ArrowLeft, BookOpen, ExternalLink, Sparkles, MonitorSmartphone, PenTool, ChevronRight, Clock, FileText } from "lucide-react";
import Link from "next/link";
import DigitalSearch from "@/components/ui/DigitalSearch";

export default async function NotesPage({ searchParams }: { searchParams: Promise<{ view?: string, subject?: string }> }) {
  const supabase = await createClient();
  const params = await searchParams;
  
  const activeView = params.view || "digital"; 

  // 1. Authentication Check (Login check)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <LockedScreen title="Knowledge Base" />;

  //  2. PERMISSION CHECK (Database se profile check karna) 
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("can_view_notes") 
    .eq("id", user.id)
    .single();

    console.log("Fetched Profile:", profile);
  console.log("Profile Fetch Error:", profileError);

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
  
  // Dynamic Active Subject Handle karna
  const activeSubject = params.subject || (digitalSubjects && digitalSubjects.length > 0 ? digitalSubjects[0].id : null);
  
  const { data: currentTopics } = await supabase.from("digital_topics").select("*").eq("subject_id", activeSubject).order("created_at", { ascending: true });

  //  Search bar ke liye SAARE topics ek sath fetch kiye
  const { data: allDigitalTopics } = await supabase.from("digital_topics").select("*, digital_subjects(name)");

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
      </div>

      {/* ==========================================
          VIEW 1: DIGITAL NOTES (GFG STYLE)
      ========================================== */}
      {activeView === "digital" && (
        <div className="max-w-7xl mx-auto relative z-20">
          
          {/*  Search Bar  */}
          <div className="mb-8 w-full max-w-2xl">
            <DigitalSearch allTopics={allDigitalTopics || []} />
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* RESPONSIVE HORIZONTAL SCROLL FOR MOBILE, VERTICAL FOR PC */}
            <div className="w-full md:w-64 shrink-0">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 px-1">Subjects</h3>
              <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
                {digitalSubjects?.map((sub) => (
                  <Link key={sub.id} href={`?view=digital&subject=${sub.id}`} scroll={false}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all border shrink-0 md:shrink border-transparent whitespace-nowrap ${activeSubject === sub.id ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-lg" : "bg-zinc-950/50 text-zinc-400 border-white/5"}`}
                  >
                    <span className="text-lg">{sub.icon}</span>
                    <span className="font-semibold text-sm">{sub.name}</span>
                  </Link>
                ))}
                {(!digitalSubjects || digitalSubjects.length === 0) && <p className="text-xs text-zinc-600">No subjects found</p>}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-2xl font-bold">{digitalSubjects?.find(s => s.id === activeSubject)?.name || "Select Subject"}</h2>
                <span className="bg-zinc-800 text-zinc-300 text-xs px-2.5 py-1 rounded-full font-mono">{currentTopics?.length || 0} Topics</span>
              </div>

              {currentTopics && currentTopics.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {currentTopics.map((topic) => (
                    <Link href={`/digital-notes/${activeSubject}/${topic.id}`} key={topic.id} className="group bg-zinc-950/60 backdrop-blur-md border border-white/10 hover:border-emerald-500/40 p-5 rounded-3xl transition-all hover:shadow-2xl hover:shadow-emerald-500/5 flex flex-col justify-between">
                      <div>
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
            //   BEAUTIFUL EMPTY STATE FOR NO NOTES 
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
            // 📚 NOTES GRID 📚
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
    </div>
  );
}