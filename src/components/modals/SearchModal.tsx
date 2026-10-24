"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, PlayCircle, GraduationCap, Trophy, Smartphone, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchData: { title: string; type: string; link: string; }[];
}

export default function SearchModal({ isOpen, onClose, searchData }: SearchModalProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSearch = searchData.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[14vh] px-3 sm:px-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            onClick={onClose} 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }} 
            className="relative w-full max-w-2xl bg-zinc-950/95 border border-indigo-500/30 rounded-2xl sm:rounded-3xl shadow-[0_0_80px_rgba(99,102,241,0.2)] overflow-hidden z-10 flex flex-col backdrop-blur-xl pointer-events-auto"
          >
            <div className="flex items-center px-4 sm:px-5 border-b border-white/10 bg-white/[0.03]">
              <Search className="w-5 h-5 text-indigo-400 shrink-0" />
              <input 
                type="text" autoFocus placeholder="Search 'Propositional Logic', 'Levels of Teaching', 'MCQs'..." 
                className="w-full bg-transparent border-none px-3 sm:px-4 py-4 sm:py-5 focus:outline-none text-sm sm:text-base text-white placeholder:text-zinc-500 font-medium" 
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} 
              />
              <button onClick={onClose} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <X className="w-5 h-5 text-zinc-400 hover:text-white" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2 sm:p-3">
              {filteredSearch.length === 0 ? (
                <p className="text-center py-10 text-sm text-zinc-500 font-medium">No lecture notes or topics found for "{searchQuery}"</p>
              ) : (
                filteredSearch.map((item, index) => (
                  <button 
                    key={index} onClick={() => { onClose(); router.push(item.link); }}
                    className="w-full flex items-center justify-between text-left px-3 sm:px-4 py-3 rounded-xl hover:bg-indigo-500/10 transition-all text-zinc-300 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-zinc-900 border border-white/5 group-hover:border-indigo-500/40 group-hover:text-indigo-400 transition-colors shrink-0">
                        {item.type === "Video" ? <PlayCircle className="w-4 h-4 text-red-400"/> : item.type === "Topic" ? <GraduationCap className="w-4 h-4 text-indigo-400"/> : item.type === "Practice" ? <Trophy className="w-4 h-4 text-emerald-400"/> : item.type === "App" ? <Smartphone className="w-4 h-4 text-purple-400"/> : <FileText className="w-4 h-4 text-amber-400"/>}
                      </div>
                      <span className="font-semibold text-white group-hover:text-indigo-300 transition-colors text-xs sm:text-base truncate">{item.title}</span>
                    </div>
                    <span className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full bg-zinc-900 border border-white/10 text-zinc-400 font-medium group-hover:border-indigo-500/30 group-hover:text-indigo-300 shrink-0 ml-2">{item.type}</span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}