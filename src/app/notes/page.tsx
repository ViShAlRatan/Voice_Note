export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import LockedScreen from "@/components/ui/LockedScreen";
import PermissionLocked from "@/components/ui/PermissionLocked";
import {
  ArrowLeft,
  BookOpen,
  ExternalLink,
  Sparkles,
  MonitorSmartphone,
  PenTool,
  ChevronRight,
  Clock,
  FileText,
  Layers,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import DigitalSearch from "@/components/ui/DigitalSearch";

// 🔥 STATIC UNITS FROM PDF SYLLABUS 🔥
const PAPER1_UNITS = [
  { id: "unit1", name: "Teaching Aptitude" },
  { id: "unit2", name: "Research Aptitude" },
  { id: "unit3", name: "Comprehension" },
  { id: "unit4", name: "Communication" },
  { id: "unit5", name: "Mathematical Reasoning and Aptitude" },
  { id: "unit6", name: "Logical Reasoning" },
  { id: "unit7", name: "Data Interpretation" },
  { id: "unit8", name: "Information and Communication Technology (ICT)" },
  { id: "unit9", name: "People, Development and Environment" },
  { id: "unit10", name: "Higher Education System" },
];

const PAPER2_UNITS = [
  { id: "unit1", name: "Discrete Structures and Optimization" },
  { id: "unit2", name: "Computer System Architecture" },
  { id: "unit3", name: "Programming Languages and Computer Graphics" },
  { id: "unit4", name: "Database Management Systems" },
  { id: "unit5", name: "System Software and Operating System" },
  { id: "unit6", name: "Software Engineering" },
  { id: "unit7", name: "Data Structures and Algorithms" },
  { id: "unit8", name: "Theory of Computation and Compilers" },
  { id: "unit9", name: "Data Communication and Computer Networks" },
  { id: "unit10", name: "Artificial Intelligence (AI)" },
];

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; unit?: string; paper?: string }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;

  const activeView = params.view || "digital";
  const activePaper = params.paper || "paper1";
  const activeUnit = params.unit || "unit1"; // Default to Unit 1

  // 1. Authentication Check (Login check)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return <LockedScreen title="Knowledge Base" />;

  // 2. PERMISSION CHECK (Database se profile check karna)
  const { data: profile } = await supabase
    .from("profiles")
    .select("can_view_notes")
    .eq("id", user.id)
    .single();

  // Agar profile nahi mili ya admin ne permission 'false' kar di hai
  if (!profile || profile.can_view_notes === false) {
    return (
      <div className="min-h-screen bg-[#050507]">
        <PermissionLocked moduleName="Knowledge Base" />
      </div>
    );
  }

  // 3. Fetch Data from Real Database
  const { data: handwrittenNotes } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });

  // Search bar aur logic ke liye SAARE topics ek sath fetch kiye
  const { data: allDigitalTopics } = await supabase
    .from("digital_topics")
    .select("*, digital_subjects(name)");

  // 🔥 Determine which list of units to display
  const activeUnitsList = activePaper === "paper1" ? PAPER1_UNITS : PAPER2_UNITS;
  const activeUnitDetails = activeUnitsList.find((u) => u.id === activeUnit);

  // Topics ko filter karna (Paper aur Unit Number dono match hone chahiye)
  const currentTopics =
    allDigitalTopics?.filter(
      (topic) =>
        topic.paper_type === activePaper && topic.unit_number === activeUnit
    ) || [];

  // 🔥 GROUPING LOGIC FOR MAIN TOPICS 🔥
  const groupedTopics = currentTopics.reduce((acc: any, topic: any) => {
    // Agar admin ne main_topic nahi likha, toh usko 'General Topics' mein daal do
    const mainHeading = topic.main_topic || "General Topics";

    if (!acc[mainHeading]) {
      acc[mainHeading] = [];
    }
    acc[mainHeading].push(topic);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#050507] text-white selection:bg-emerald-500/30 selection:text-white relative overflow-hidden font-sans pb-24">
      {/* Subtle Background Grid & Ambient Glows */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="fixed -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[380px] bg-gradient-to-b from-emerald-500/12 via-cyan-500/5 to-transparent blur-[140px] pointer-events-none" />

      {/* STICKY TOP COMMAND HEADER */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#050507]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-zinc-900/70 border border-white/10 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/80 hover:border-white/20 transition-all duration-300"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Back to Workspace</span>
          </Link>

          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-emerald-300 font-bold bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/25">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Unlocked</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-10 relative z-20">
        {/* HERO BENTO BANNER + PERFORMANCE CARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Left: Knowledge Base Title Card */}
          <div className="lg:col-span-8 rounded-[28px] border border-white/10 bg-gradient-to-b from-zinc-900/70 to-zinc-950/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono uppercase tracking-wider text-emerald-300 mb-4">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Study Vault & Syllabus Hub</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
                Knowledge{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  Base.
                </span>
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base max-w-xl leading-relaxed">
                Master engineering subjects with structured digital guides,
                handwritten PDF notes, and topic-wise practice banks.
              </p>
            </div>
          </div>

          {/* Right: My Performance Bento Card */}
          <Link
            href="/performance"
            className="lg:col-span-4 rounded-[28px] border border-white/10 bg-zinc-950/80 hover:bg-zinc-900/70 hover:border-emerald-500/40 backdrop-blur-2xl p-6 sm:p-8 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between shadow-2xl"
          >
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-60 group-hover:opacity-100" />
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                Analytics <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="mt-6">
              <h4 className="font-bold text-xl text-white group-hover:text-emerald-300 transition-colors">
                My Performance
              </h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Track your mock test scores, accuracy metrics & attempt history.
              </p>
            </div>
          </Link>
        </div>

        {/* VIEW TOGGLE BAR */}
        <div className="mb-10 p-1.5 rounded-2xl bg-zinc-950/90 border border-white/10 backdrop-blur-xl inline-flex flex-wrap items-center gap-1.5 shadow-xl">
          <Link
            href="?view=digital"
            scroll={false}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeView === "digital"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-lg shadow-emerald-500/20"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <MonitorSmartphone className="w-4 h-4" /> Study Notes
          </Link>
          <Link
            href="?view=handwritten"
            scroll={false}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeView === "handwritten"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-lg shadow-emerald-500/20"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <PenTool className="w-4 h-4" /> E - Notes
          </Link>
          <Link
            href="/class-notes"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-zinc-400 hover:text-white hover:bg-white/5"
          >
            <FileText className="w-4 h-4" /> Class Notes
          </Link>
          <Link
            href="?view=questions"
            scroll={false}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeView === "questions"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-lg shadow-emerald-500/20"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <BookOpen className="w-4 h-4" /> Question Bank
          </Link>
        </div>

        {/* ==========================================
            VIEW 1: STUDY NOTES (GFG STYLE)
        ========================================== */}
        {activeView === "digital" && (
          <div className="relative z-20 space-y-8">
            {/* Top Control Bento Bar: Exam Title + Search + Paper Switcher */}
            <div className="rounded-[26px] border border-white/10 bg-zinc-950/75 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Exam Badge & Title */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] font-mono font-bold tracking-widest uppercase">
                    <span className="text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
                      Paper 1
                    </span>
                    <span className="text-zinc-600">+</span>
                    <span className="text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-500/20">
                      Paper 2
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex flex-wrap items-center gap-2">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">
                      UGC NET
                    </span>
                    <span className="text-white">Computer Science</span>
                  </h2>
                </div>

                {/* Paper 1 & Paper 2 Toggle */}
                <div className="flex bg-black/60 border border-white/10 rounded-2xl p-1.5 w-full lg:w-max shrink-0">
                  <Link
                    href="?view=digital&paper=paper1&unit=unit1"
                    scroll={false}
                    className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm rounded-xl font-bold transition-all ${
                      activePaper === "paper1"
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Layers className="w-4 h-4" /> Paper 1 (General)
                  </Link>
                  <Link
                    href="?view=digital&paper=paper2&unit=unit1"
                    scroll={false}
                    className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm rounded-xl font-bold transition-all ${
                      activePaper === "paper2"
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Layers className="w-4 h-4" /> Paper 2 (CS)
                  </Link>
                </div>
              </div>

              {/* SAFE Search Bar */}
              <div className="mt-6 pt-6 border-t border-white/[0.07]">
                <DigitalSearch
                  allTopics={(allDigitalTopics || []).map((topic) => ({
                    ...topic,
                    title: topic.title || "",
                    description: topic.description || "",
                  }))}
                />
              </div>
            </div>

            {/* Main Workspace Split: Syllabus Sidebar + Topics Area */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* 🔥 SYLLABUS UNITS SIDEBAR 🔥 */}
              <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-24 rounded-[24px] border border-white/10 bg-zinc-950/70 backdrop-blur-xl p-4">
                <div className="flex items-center justify-between px-2 mb-3">
                  <h3 className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-400">
                    Syllabus Units
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-500">
                    10 Units
                  </span>
                </div>

                <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
                  {activeUnitsList.map((unit) => {
                    const isActive = activeUnit === unit.id;
                    const unitNum = unit.id.replace("unit", "");
                    return (
                      <Link
                        key={unit.id}
                        href={`?view=digital&paper=${activePaper}&unit=${unit.id}`}
                        scroll={false}
                        className={`group flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all border shrink-0 lg:shrink whitespace-nowrap lg:whitespace-normal text-left ${
                          isActive
                            ? "bg-emerald-500/15 text-white border-emerald-500/30 shadow-lg"
                            : "bg-black/40 text-zinc-400 border-white/[0.05] hover:bg-zinc-900 hover:text-zinc-200"
                        }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-mono font-bold shrink-0 ${
                            isActive
                              ? "bg-emerald-500 text-black"
                              : "bg-zinc-900 text-zinc-500 group-hover:text-zinc-300"
                          }`}
                        >
                          {unitNum.padStart(2, "0")}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-xs sm:text-sm leading-snug line-clamp-2">
                            {unit.name}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </aside>

              {/* 🔥 TOPICS DISPLAY AREA 🔥 */}
              <div className="flex-1 w-full min-w-0">
                {/* Active Unit Header Banner */}
                <div className="rounded-[24px] border border-white/10 bg-zinc-950/60 p-6 mb-8 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                      {activeUnit.replace("unit", "Unit ")} •{" "}
                      {activePaper === "paper1" ? "Paper 1" : "Paper 2 (CS)"}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                      {activeUnitDetails?.name || "Select Unit"}
                    </h2>
                  </div>
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs px-3.5 py-1.5 rounded-xl font-mono font-bold">
                    {currentTopics?.length || 0} Topics Available
                  </span>
                </div>

                {/* 🔥 GROUPED TOPICS DISPLAY 🔥 */}
                {Object.keys(groupedTopics).length > 0 ? (
                  <div className="space-y-10">
                    {Object.entries(groupedTopics).map(
                      ([mainTopic, subTopics]: any) => (
                        <div
                          key={mainTopic}
                          className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                        >
                          {/* MAIN TOPIC HEADING */}
                          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-white/10">
                            <div className="h-6 w-1.5 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
                            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                              {mainTopic}
                            </h3>
                            <span className="ml-auto bg-zinc-900 border border-white/10 text-zinc-400 text-[10px] uppercase font-mono font-bold tracking-wider px-2.5 py-1 rounded-lg">
                              {subTopics.length} Topics
                            </span>
                          </div>

                          {/* SUB TOPICS BENTO GRID */}
                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                            {subTopics.map((topic: any) => (
                              <Link
                                href={`/digital-notes/${activeUnit}/${topic.id}`}
                                key={topic.id}
                                className="group relative overflow-hidden bg-zinc-950/75 backdrop-blur-xl border border-white/10 hover:border-emerald-500/40 p-6 rounded-[24px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-emerald-500/5 flex flex-col justify-between"
                              >
                                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div>
                                  <div className="flex items-center gap-2 mb-3">
                                    {topic.paper_type && (
                                      <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2.5 py-0.5 rounded-md border border-blue-500/20 font-mono font-bold uppercase tracking-wider">
                                        {topic.paper_type === "paper1"
                                          ? "Paper 1"
                                          : "Paper 2"}
                                      </span>
                                    )}
                                    {topic.unit_number && (
                                      <span className="bg-purple-500/10 text-purple-400 text-[10px] px-2.5 py-0.5 rounded-md border border-purple-500/20 font-mono font-bold uppercase tracking-wider">
                                        {String(topic.unit_number).replace(
                                          "unit",
                                          "Unit "
                                        )}
                                      </span>
                                    )}
                                  </div>

                                  <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mb-2">
                                    {topic.title}
                                  </h4>
                                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6 line-clamp-2">
                                    {topic.description}
                                  </p>
                                </div>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/[0.06]">
                                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
                                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                                    <span>{topic.read_time}</span>
                                  </div>
                                  <div className="flex items-center text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                                    <span>Read Topic</span>
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="py-20 text-center border border-dashed border-white/10 rounded-[28px] bg-zinc-950/40">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-7 h-7 text-zinc-500" />
                    </div>
                    <h4 className="text-base font-bold text-zinc-300 mb-1">
                      No Topics Published Yet
                    </h4>
                    <p className="text-xs text-zinc-500">
                      Topics are currently being updated for this unit.
                    </p>
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
          <div className="relative z-20">
            {!handwrittenNotes || handwrittenNotes.length === 0 ? (
              <div className="py-24 text-center border border-dashed border-white/10 rounded-[28px] bg-zinc-950/50 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
                <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-5 border border-white/10">
                  <BookOpen className="w-8 h-8 text-zinc-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  No Notes Available
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm max-w-md leading-relaxed">
                  The admin hasn&apos;t published any handwritten PDFs yet.
                  Please check back later for updates!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                {handwrittenNotes.map((note) => (
                  <div
                    key={note.id}
                    className="relative overflow-hidden rounded-[26px] border border-white/10 bg-zinc-950/75 backdrop-blur-xl p-6 sm:p-7 hover:border-emerald-500/35 transition-all duration-300 group flex flex-col justify-between hover:shadow-2xl hover:shadow-emerald-500/5"
                  >
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

                    <div>
                      <div className="flex items-center justify-between gap-3 mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/25 text-emerald-400">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] text-emerald-300 font-mono font-bold uppercase tracking-wider bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                          {note.subject}
                        </span>
                      </div>

                      <h2 className="text-xl font-bold mb-2 text-white group-hover:text-emerald-300 transition-colors">
                        {note.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6 line-clamp-3">
                        {note.description}
                      </p>
                    </div>

                    <a
                      href={note.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-5 w-full bg-emerald-500/10 hover:bg-emerald-500 text-emerald-300 hover:text-black border border-emerald-500/25 font-bold text-xs sm:text-sm h-12 rounded-xl transition-all duration-300 mt-4"
                    >
                      <span>View / Download PDF</span>
                      <ExternalLink className="w-4 h-4" />
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
          <div className="relative z-20 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Paper 1 Card */}
              <div className="relative overflow-hidden bg-zinc-950/75 backdrop-blur-xl border border-white/10 p-8 rounded-[28px] hover:border-blue-500/40 transition-all duration-300 group hover:shadow-2xl hover:shadow-blue-500/5 flex flex-col justify-between">
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[70px] rounded-full pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/25 text-blue-400">
                      <BookOpen className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-blue-300 bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20 font-bold">
                      10 Units • General
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Paper 1 (General)
                  </h3>
                  <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
                    Practice MCQs for Teaching & Research Aptitude. Chapter-wise
                    questions with detailed explanations.
                  </p>
                </div>

                <Link
                  href="/practice?paper=paper1"
                  className="inline-flex items-center justify-between px-6 w-full bg-blue-500/15 hover:bg-blue-500 text-blue-300 hover:text-white border border-blue-500/30 font-bold text-sm h-12 rounded-xl transition-all"
                >
                  <span>Start Practice</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Paper 2 Card */}
              <div className="relative overflow-hidden bg-zinc-950/75 backdrop-blur-xl border border-white/10 p-8 rounded-[28px] hover:border-purple-500/40 transition-all duration-300 group hover:shadow-2xl hover:shadow-purple-500/5 flex flex-col justify-between">
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 blur-[70px] rounded-full pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/25 text-purple-400">
                      <BookOpen className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-purple-300 bg-purple-500/10 px-3 py-1 rounded-lg border border-purple-500/20 font-bold">
                      10 Units • Core CS
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Paper 2 (Computer Science)
                  </h3>
                  <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
                    Master Computer Science with 10 Units of topic-wise MCQs.
                    Test your knowledge now.
                  </p>
                </div>

                <Link
                  href="/practice?paper=paper2"
                  className="inline-flex items-center justify-between px-6 w-full bg-purple-500/15 hover:bg-purple-500 text-purple-300 hover:text-white border border-purple-500/30 font-bold text-sm h-12 rounded-xl transition-all"
                >
                  <span>Start Practice</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}