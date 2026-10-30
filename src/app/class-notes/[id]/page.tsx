"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2, BookOpen, Sparkles } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function NotebookViewerPage() {
  const { id } = useParams();
  const supabase = createClient();

  const [note, setNote] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      const { data } = await supabase.from("class_notes").select("*").eq("id", id).single();
      if (data) setNote(data);
      setLoading(false);
    };
    fetchNote();
  }, [id, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050507] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mb-3" />
        <p className="text-xs font-mono uppercase tracking-widest text-zinc-400">Opening Notebook...</p>
      </div>
    );
  }

  if (!note || !note.image_urls || note.image_urls.length === 0) {
    return (
      <div className="min-h-screen bg-[#050507] text-white flex flex-col items-center justify-center p-6 text-center">
        <BookOpen className="w-12 h-12 text-zinc-600 mb-4" />
        <h2 className="text-xl font-bold mb-2">Notebook Not Found or Empty</h2>
        <p className="text-zinc-400 text-sm mb-6">This notebook does not contain any pages yet.</p>
        <Link href="/class-notes" className="px-5 py-2.5 bg-white text-black font-bold rounded-xl text-sm">
          Back to Class Notes
        </Link>
      </div>
    );
  }

  const pages = note.image_urls;

  const nextPage = () => {
    if (currentPage < pages.length - 1) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="min-h-screen bg-[#060609] text-white flex flex-col justify-between selection:bg-emerald-500/30 relative overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0c_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Header */}
      <header className="z-30 border-b border-white/[0.06] bg-[#060609]/85 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <Link href="/class-notes" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-all">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Notes</span>
        </Link>

        <div className="text-center">
          <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-xs sm:max-w-md">{note.title}</h2>
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">{note.subject}</span>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono font-bold text-emerald-300">
          Page {currentPage + 1} / {pages.length}
        </div>
      </header>

      {/* Realistic Notebook Viewer Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative z-20">
        <div className="relative w-full max-w-4xl aspect-[4/3] sm:aspect-[16/10] bg-[#121215] border-2 border-zinc-700/60 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex items-center justify-center p-3 sm:p-6 group">
          
          {/* Notebook Spiral Binding Effect in Middle */}
          <div className="absolute left-4 top-0 bottom-0 w-6 hidden md:flex flex-col justify-around items-center py-6 z-10 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-4 h-3 bg-zinc-400 rounded-sm shadow-md border border-zinc-900" />
            ))}
          </div>

          {/* Current Page Photo with Animation */}
          <div className="w-full h-full relative rounded-xl overflow-hidden bg-black flex items-center justify-center shadow-inner">
            <img
              src={pages[currentPage]}
              alt={`Notebook Page ${currentPage + 1}`}
              className="max-w-full max-h-full object-contain transition-all duration-300 animate-in fade-in zoom-in-95"
            />
          </div>

          {/* Left / Right Flip Navigation Buttons */}
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className={`absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-zinc-900/90 border border-white/15 flex items-center justify-center text-white shadow-xl transition-all hover:bg-emerald-600 hover:border-emerald-400 disabled:opacity-30 disabled:pointer-events-none cursor-pointer z-30`}
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextPage}
            disabled={currentPage === pages.length - 1}
            className={`absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-zinc-900/90 border border-white/15 flex items-center justify-center text-white shadow-xl transition-all hover:bg-emerald-600 hover:border-emerald-400 disabled:opacity-30 disabled:pointer-events-none cursor-pointer z-30`}
            aria-label="Next Page"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Bottom Thumbnail Navigation / Progress Bar */}
        <div className="w-full max-w-4xl mt-6 flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {pages.map((imgUrl: string, idx: number) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`relative w-14 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                currentPage === idx ? "border-emerald-400 scale-105 shadow-lg shadow-emerald-500/30" : "border-white/10 opacity-50 hover:opacity-100"
              }`}
            >
              <img src={imgUrl} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}