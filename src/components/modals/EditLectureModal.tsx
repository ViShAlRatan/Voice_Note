"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { YoutubeLecture } from "../home/YoutubeLectures";

const gradientPresets = [
  { label: "Indigo / Purple", value: "from-indigo-600/40 via-purple-900/40 to-zinc-950", accent: "text-indigo-400" },
  { label: "Purple / Pink", value: "from-purple-600/40 via-pink-900/40 to-zinc-950", accent: "text-purple-400" },
  { label: "Emerald / Teal", value: "from-emerald-600/40 via-teal-900/40 to-zinc-950", accent: "text-emerald-400" },
  { label: "Blue / Cyan", value: "from-blue-600/40 via-cyan-900/40 to-zinc-950", accent: "text-cyan-400" }
];

interface EditLectureModalProps {
  isOpen: boolean;
  lecture: YoutubeLecture | null;
  onClose: () => void;
  onSave: (updatedLecture: YoutubeLecture, topicsInput: string) => void;
  isSaving: boolean;
}

export default function EditLectureModal({ isOpen, lecture, onClose, onSave, isSaving }: EditLectureModalProps) {
  const [formData, setFormData] = useState<YoutubeLecture | null>(null);
  const [topicsInput, setTopicsInput] = useState("");

  useEffect(() => {
    if (lecture) {
      setFormData(lecture);
      setTopicsInput(lecture.topicsCovered.join(", "));
    }
  }, [lecture]);

  if (!isOpen || !formData) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/85 backdrop-blur-xl pointer-events-auto" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-950 border border-indigo-500/40 rounded-3xl shadow-[0_0_90px_rgba(99,102,241,0.25)] z-10 pointer-events-auto p-5 sm:p-8">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-indigo-400">Admin Control</span>
              <h3 className="text-xl sm:text-2xl font-black text-white">Customize Video Lecture Card</h3>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); onSave(formData, topicsInput); }} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">Lecture Title *</label>
              <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-xl bg-black border border-white/15 px-3.5 py-2.5 text-white focus:border-indigo-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">YouTube Video Link or ID *</label>
                <input type="text" required value={formData.youtubeId} onChange={(e) => setFormData({ ...formData, youtubeId: e.target.value })} className="w-full rounded-xl bg-black border border-white/15 px-3.5 py-2.5 text-white focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">Select Paper *</label>
                <select value={formData.paper} onChange={(e) => {
                    const val = e.target.value;
                    const isP1 = val.includes("Paper 1");
                    setFormData({ ...formData, paper: val, notesLink: isP1 ? "/notes?paper=paper1&unit=unit1" : "/notes?paper=paper2&unit=unit1", practiceLink: isP1 ? "/practice?paper=paper1&unit=unit1" : "/practice?paper=paper2&unit=unit1" });
                  }} className="w-full rounded-xl bg-black border border-white/15 px-3.5 py-2.5 text-white focus:border-indigo-500">
                  <option value="Paper 2 • Computer Science">Paper 2 • Computer Science</option>
                  <option value="Paper 1 • Teaching Aptitude">Paper 1 • Teaching Aptitude</option>
                  <option value="GATE CSE • Special Class">GATE CSE • Special Class</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">Unit Number & Name *</label>
                <input type="text" required value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} className="w-full rounded-xl bg-black border border-white/15 px-3.5 py-2.5 text-white focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">Card Color Theme</label>
                <select value={formData.gradient} onChange={(e) => {
                    const found = gradientPresets.find((p) => p.value === e.target.value) || gradientPresets[0];
                    setFormData({ ...formData, gradient: found.value, accentColor: found.accent });
                  }} className="w-full rounded-xl bg-black border border-white/15 px-3.5 py-2.5 text-white focus:border-indigo-500">
                  {gradientPresets.map((p) => <option key={p.label} value={p.value}>{p.label}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">Topics Covered (Comma separated) *</label>
              <input type="text" required value={topicsInput} onChange={(e) => setTopicsInput(e.target.value)} className="w-full rounded-xl bg-black border border-white/15 px-3.5 py-2.5 text-white focus:border-indigo-500" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">Duration</label>
                <input type="text" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="w-full rounded-xl bg-black border border-white/15 px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">Top Tag</label>
                <input type="text" value={formData.tag} onChange={(e) => setFormData({ ...formData, tag: e.target.value })} className="w-full rounded-xl bg-black border border-white/15 px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">Subtitle/Views</label>
                <input type="text" value={formData.views} onChange={(e) => setFormData({ ...formData, views: e.target.value })} className="w-full rounded-xl bg-black border border-white/15 px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">MCQ Badge</label>
                <input type="text" value={formData.mcqCount} onChange={(e) => setFormData({ ...formData, mcqCount: e.target.value })} className="w-full rounded-xl bg-black border border-white/15 px-3 py-2 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">Notes Button URL</label>
                <input type="text" value={formData.notesLink} onChange={(e) => setFormData({ ...formData, notesLink: e.target.value })} className="w-full rounded-xl bg-black border border-white/15 px-3.5 py-2.5 text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">MCQs Button URL</label>
                <input type="text" value={formData.practiceLink} onChange={(e) => setFormData({ ...formData, practiceLink: e.target.value })} className="w-full rounded-xl bg-black border border-white/15 px-3.5 py-2.5 text-white" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-5 border-t border-white/10">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl border-white/10 bg-zinc-900 text-white hover:bg-zinc-800">Cancel</Button>
              <Button type="submit" disabled={isSaving} className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-6">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Save Changes
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}