"use client";

import { useState, useEffect, useRef } from "react";
import { Search, FileText, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DigitalSearch({ allTopics }: { allTopics: any[] }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // User ki query ke hisaab se topics filter karna
  const filteredTopics = allTopics.filter(topic =>
    topic.title.toLowerCase().includes(query.toLowerCase()) ||
    (topic.digital_subjects?.name && topic.digital_subjects.name.toLowerCase().includes(query.toLowerCase()))
  );

  // Agar user bahar click kare toh dropdown band ho jaye
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Jab user topic par click kare toh us page par redirect karna
  const handleSelect = (subjectId: string, topicId: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/digital-notes/${subjectId}/${topicId}`);
  };

  return (
    <div className="relative w-full max-w-2xl mb-8 z-40 animate-in fade-in duration-500" ref={searchRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-zinc-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="🔍  Search for any digital topic or subject..."
          className="w-full bg-zinc-900/80 border border-white/10 text-white h-14 pl-12 pr-4 rounded-2xl focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-xl backdrop-blur-xl"
        />
      </div>

      {/* 🔴 SEARCH DROPDOWN RESULTS 🔴 */}
      {isOpen && query.trim() !== "" && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
          {filteredTopics.length > 0 ? (
            <div className="p-2">
              {filteredTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => handleSelect(topic.subject_id, topic.id)}
                  className="w-full flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{topic.title}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{topic.digital_subjects?.name || topic.subject_id}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600" />
                </button>
              ))}
            </div>
          ) : (
            // Agar topic nahi mila toh ye message dikhayega
            <div className="p-8 text-center">
              <p className="text-zinc-300 font-medium text-lg">No topic found! 🚫</p>
              <p className="text-sm text-zinc-500 mt-1">We couldn't find anything matching "{query}".</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}