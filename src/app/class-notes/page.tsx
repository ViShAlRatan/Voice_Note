export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import LockedScreen from "@/components/ui/LockedScreen";
import PermissionLocked from "@/components/ui/PermissionLocked";
import { ArrowLeft, BookOpen, Sparkles, Layers, ChevronRight, FileText } from "lucide-react";
import Link from "next/link";

export default async function ClassNotesIndexPage({ searchParams }: { searchParams: Promise<{ paper?: string }> }) {
  const supabase = await createClient();
  const params = await searchParams;
  const activePaper = params.paper || "paper1";

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <LockedScreen title="Class Notes" />;

  const { data: profile } = await supabase.from("profiles").select("can_view_notes").eq("id", user.id).single();
  if (!profile || profile.can_view_notes === false) {
    return <div className="min-h-screen bg-[#050507]"><PermissionLocked moduleName="Class Notes" /></div>;
  }

  // Fetch Class Notes filtered by Paper Type
  const { data: notes } = await supabase
    .from("class_notes")
    .select("*")
    .eq("paper_type", activePaper)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#050507] text-white selection:bg-emerald-500/30 selection:text-white relative overflow-hidden font-sans pb-24">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="fixed -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[380px] bg-gradient-to-b from-emerald-500/12 via-cyan-500/5 to-transparent blur-[140px] pointer-events-none" />

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#050507]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/notes" className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-zinc-900/70 border border-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-all">
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Back to Knowledge Base</span>
          </Link>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-emerald-300 font-bold bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/25">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Classroom Vault</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-10 relative z-20">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            Class <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Notes.</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl">
            Select your paper and open interactive notebooks with handwritten session pages.
          </p>
        </div>

        {/* Paper 1 & Paper 2 Tabs */}
        <div className="flex bg-black/60 border border-white/10 rounded-2xl p-1.5 w-full sm:w-max mb-10 shadow-xl">
          <Link
            href="/class-notes?paper=paper1"
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 text-xs sm:text-sm rounded-xl font-bold transition-all ${
              activePaper === "paper1" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25" : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Layers className="w-4 h-4" /> Paper 1 (General)
          </Link>
          <Link
            href="/class-notes?paper=paper2"
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 text-xs sm:text-sm rounded-xl font-bold transition-all ${
              activePaper === "paper2" ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25" : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Layers className="w-4 h-4" /> Paper 2 (Computer Science)
          </Link>
        </div>

        {/* Notes Grid */}
        {!notes || notes.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-white/10 rounded-[28px] bg-zinc-950/50 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-5 border border-white/10">
              <FileText className="w-8 h-8 text-zinc-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Class Notes Found</h3>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-md">
              No handwritten notebook sessions available for {activePaper === 'paper1' ? 'Paper 1' : 'Paper 2'} right now.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <Link
                key={note.id}
                href={`/class-notes/${note.id}`}
                className="relative overflow-hidden rounded-[26px] border border-white/10 bg-zinc-950/75 backdrop-blur-xl p-6 sm:p-7 hover:border-emerald-500/40 transition-all duration-300 group flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/25 text-emerald-400 group-hover:scale-110 transition-transform">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] text-emerald-300 font-mono font-bold uppercase tracking-wider bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                      {note.subject || "Lecture"}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold mb-2 text-white group-hover:text-emerald-300 transition-colors">
                    {note.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6 line-clamp-3">
                    {note.description || "Interactive classroom notes with handwritten page scans."}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/[0.06] text-xs font-bold text-emerald-400">
                  <span>Open Notebook ({note.image_urls?.length || 0} Pages)</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}