import { PlayCircle, Library, FileText, Trophy } from "lucide-react";

export default function StudyWorkflow() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 z-20 relative pointer-events-auto">
      <div className="rounded-3xl bg-zinc-900/40 border border-white/10 p-5 sm:p-8 backdrop-blur-xl">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-indigo-400">The Smart Study Workflow</span>
          <h2 className="text-xl sm:text-3xl font-black mt-1 text-white">How to Use This Platform With My Videos</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-black/50 border border-white/5 hover:border-red-500/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-black px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/20">STEP 1</span>
              <PlayCircle className="w-5 h-5 text-red-400" />
            </div>
            <h4 className="font-bold text-white text-sm sm:text-base mb-1">Watch YT Class</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">Understand the core intuition and tricks from my YouTube lecture first.</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-black/50 border border-white/5 hover:border-indigo-500/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-black px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">STEP 2</span>
              <Library className="w-5 h-5 text-indigo-400" />
            </div>
            <h4 className="font-bold text-white text-sm sm:text-base mb-1">Read Digital Notes</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">Revise the exact theorems, tables, and color-coded points on the website.</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-black/50 border border-white/5 hover:border-amber-500/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-black px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">STEP 3</span>
              <FileText className="w-5 h-5 text-amber-400" />
            </div>
            <h4 className="font-bold text-white text-sm sm:text-base mb-1">Handwritten PDF</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">Download my personal scanned notebook PDFs for offline last-minute revision.</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-black/50 border border-white/5 hover:border-emerald-500/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-black px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">STEP 4</span>
              <Trophy className="w-5 h-5 text-emerald-400" />
            </div>
            <h4 className="font-bold text-white text-sm sm:text-base mb-1">Solve 120+ MCQs</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">Test your concept clarity with CS & UGC NET level questions and explanations.</p>
          </div>
        </div>
      </div>
    </section>
  );
}