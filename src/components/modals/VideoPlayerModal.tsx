"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, PlayCircle, Edit3, BookOpen, Trophy, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { YoutubeLecture } from "../home/YoutubeLectures";

interface VideoPlayerModalProps {
  activeVideo: YoutubeLecture | null;
  isAdmin: boolean;
  onClose: () => void;
  onEditRequest: (video: YoutubeLecture) => void;
}

export default function VideoPlayerModal({ activeVideo, isAdmin, onClose, onEditRequest }: VideoPlayerModalProps) {
  if (!activeVideo) return null;
  const isDummy = activeVideo.youtubeId.startsWith("YOUR_VIDEO_ID");

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
          className="absolute inset-0 bg-black/85 backdrop-blur-xl pointer-events-auto" 
          onClick={onClose} 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.92, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }} 
          className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-zinc-950 border border-indigo-500/30 rounded-2xl sm:rounded-3xl shadow-[0_0_100px_rgba(99,102,241,0.25)] z-10 pointer-events-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/10 bg-zinc-900/60">
            <div className="flex items-center gap-2.5 pr-3 min-w-0">
              <span className="px-2.5 py-1 rounded-md bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] font-bold flex items-center gap-1.5 shrink-0">
                <Play className="w-3 h-3 fill-red-400" /> Classroom
              </span>
              <h3 className="text-xs sm:text-base font-bold text-white truncate">{activeVideo.title}</h3>
            </div>
            <button onClick={onClose} className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Player */}
          <div className="relative aspect-video w-full bg-black">
            {isDummy ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 text-center bg-gradient-to-b from-zinc-900 to-black">
                <PlayCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mb-3 sm:mb-4 animate-pulse" />
                <h4 className="text-base sm:text-xl font-bold text-white mb-2">Video Stream Ready</h4>
                <p className="text-zinc-400 text-xs sm:text-sm max-w-md mb-4">
                  {isAdmin ? "Click the 'Edit' button on this card to paste your YouTube Video Link or ID!" : "This lecture video will be live shortly. Meanwhile, you can access the notes and MCQs below!"}
                </p>
                {isAdmin && (
                  <Button onClick={() => onEditRequest(activeVideo)} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold">
                    <Edit3 className="w-3.5 h-3.5 mr-1.5" /> Add YouTube Link Now
                  </Button>
                )}
              </div>
            ) : (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-6 bg-zinc-900/90 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] sm:text-xs text-indigo-400 font-bold uppercase tracking-wider">{activeVideo.unit}</span>
              <p className="text-xs text-zinc-400 mt-0.5">Done watching? Lock in the concept with notes & practice questions:</p>
            </div>
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Link href={activeVideo.notesLink} className="flex-1 sm:flex-initial" onClick={onClose}>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-10 px-4 sm:px-5 text-xs font-bold">
                  <BookOpen className="w-4 h-4 mr-1.5 shrink-0" /> Read Notes
                </Button>
              </Link>
              <Link href={activeVideo.practiceLink} className="flex-1 sm:flex-initial" onClick={onClose}>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-10 px-4 sm:px-5 text-xs font-bold">
                  <Trophy className="w-4 h-4 mr-1.5 shrink-0" /> Solve {activeVideo.mcqCount}
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}