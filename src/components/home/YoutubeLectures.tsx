"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlayCircle, ExternalLink, Plus, Edit3, Trash2, Clock, Eye, Play, BookOpen, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import VideoPlayerModal from "../modals/VideoPlayerModal";
import EditLectureModal from "../modals/EditLectureModal";

export interface YoutubeLecture {
  id: string;
  youtubeId: string;
  title: string;
  paper: string;
  unit: string;
  duration: string;
  views: string;
  tag: string;
  gradient: string;
  accentColor: string;
  topicsCovered: string[];
  notesLink: string;
  practiceLink: string;
  mcqCount: string;
}

const defaultLectures: YoutubeLecture[] = [
  { id: "lec-1", youtubeId: "YOUR_VIDEO_ID_1", title: "Propositional Logic & Equivalences | Complete One-Shot", paper: "Paper 2 • Computer Science", unit: "Unit 1: Discrete Structures", duration: "52:18", views: "1.2k+ Learners", tag: "🔥 Most Watched", gradient: "from-indigo-600/40 via-purple-900/40 to-zinc-950", accentColor: "text-indigo-400", topicsCovered: ["Truth Tables & Tautology", "De Morgan's Laws"], notesLink: "/notes?paper=paper2&unit=unit1", practiceLink: "/practice?paper=paper2&unit=unit1", mcqCount: "120+ MCQs" }
];

function extractYouTubeId(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "YOUR_VIDEO_ID";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = trimmed.match(regExp);
  return (match && match[2].length === 11) ? match[2] : trimmed;
}

export default function YoutubeLectures({ isAdmin }: { isAdmin: boolean }) {
  const [lectures, setLectures] = useState<YoutubeLecture[]>(defaultLectures);
  const [activeVideo, setActiveVideo] = useState<YoutubeLecture | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState<YoutubeLecture | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadLectures() {
      const savedLocal = localStorage.getItem("vn_youtube_lectures");
      if (savedLocal) setLectures(JSON.parse(savedLocal));

      const supabase = createClient();
      const { data, error } = await supabase.from("youtube_lectures").select("*").order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        setLectures(data);
        localStorage.setItem("vn_youtube_lectures", JSON.stringify(data));
      }
    }
    loadLectures();
  }, []);

  const openEditor = (lecture?: YoutubeLecture) => {
    if (lecture) {
      setEditingLecture(lecture);
    } else {
      setEditingLecture({ ...defaultLectures[0], id: `lec-${Date.now()}`, youtubeId: "", title: "", tag: "🔥 Newly Added", views: "New Lecture" });
    }
    setIsEditModalOpen(true);
  };

  const handleSave = async (updatedLecture: YoutubeLecture, topicsInput: string) => {
    setIsSaving(true);
    const cleanedId = extractYouTubeId(updatedLecture.youtubeId);
    const topics = topicsInput.split(",").map(t => t.trim()).filter(Boolean);
    const finalData = { ...updatedLecture, youtubeId: cleanedId, topicsCovered: topics.length ? topics : ["Complete Lecture"] };

    const exists = lectures.some(l => l.id === finalData.id);
    const newList = exists ? lectures.map(l => l.id === finalData.id ? finalData : l) : [finalData, ...lectures];
    setLectures(newList);
    localStorage.setItem("vn_youtube_lectures", JSON.stringify(newList));

    const supabase = createClient();
    await supabase.from("youtube_lectures").upsert(finalData, { onConflict: "id" });

    setIsSaving(false);
    setIsEditModalOpen(false);
    setEditingLecture(null);
    toast.success("Lecture saved successfully!");
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this video lecture?")) return;
    const newList = lectures.filter(l => l.id !== id);
    setLectures(newList);
    localStorage.setItem("vn_youtube_lectures", JSON.stringify(newList));
    const supabase = createClient();
    await supabase.from("youtube_lectures").delete().eq("id", id);
    toast.success("Lecture deleted.");
  };

  return (
    <>
      <VideoPlayerModal activeVideo={activeVideo} isAdmin={isAdmin} onClose={() => setActiveVideo(null)} onEditRequest={(v) => { setActiveVideo(null); openEditor(v); }} />
      <EditLectureModal isOpen={isEditModalOpen} lecture={editingLecture} onClose={() => setIsEditModalOpen(false)} onSave={handleSave} isSaving={isSaving} />

      <section id="lectures" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 z-10 relative scroll-mt-20 pointer-events-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-red-400 mb-3">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" /> Fresh From YouTube
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">Latest Video Lectures</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {isAdmin && (
              <Button onClick={() => openEditor()} className="rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm h-11 px-4 shadow-lg shadow-indigo-500/25">
                <Plus className="w-4 h-4 mr-1.5" /> Add Video
              </Button>
            )}
            <Link href="https://www.youtube.com" target="_blank" className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-red-600/15 hover:bg-red-600/25 text-red-300 border border-red-500/30 text-xs sm:text-sm font-bold transition-all">
              <PlayCircle className="w-4 h-4 text-red-400 shrink-0" /> YouTube Channel <ExternalLink className="w-3.5 h-3.5 ml-0.5 shrink-0" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {lectures.map((video, idx) => {
            const hasRealId = Boolean(video.youtubeId && !video.youtubeId.startsWith("YOUR_VIDEO_ID"));
            return (
              <motion.div key={video.id} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.08 }} className="rounded-3xl border border-white/10 bg-zinc-900/40 hover:bg-zinc-900/75 overflow-hidden flex flex-col justify-between transition-all group shadow-xl relative">
                {isAdmin && (
                  <div className="absolute top-14 right-3 z-30 flex items-center gap-1.5">
                    <button onClick={(e) => { e.stopPropagation(); openEditor(video); }} className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-600/95 hover:bg-indigo-500 text-white text-[11px] font-bold shadow-lg border border-white/20 backdrop-blur-md transition-transform hover:scale-105"><Edit3 className="w-3 h-3" /> Edit</button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(video.id); }} className="p-1.5 rounded-xl bg-red-600/90 hover:bg-red-500 text-white shadow-lg border border-white/20 backdrop-blur-md transition-transform hover:scale-105"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                )}
                <div>
                  <div onClick={() => setActiveVideo(video)} className={`relative aspect-video w-full bg-gradient-to-br ${video.gradient} cursor-pointer overflow-hidden border-b border-white/10`}>
                    {hasRealId && <img src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85" />}
                    <div className="absolute top-3 left-3 right-3 flex justify-between gap-2 z-10">
                      <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-[10px] sm:text-[11px] font-bold text-white truncate">{video.tag}</span>
                      <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-[10px] sm:text-[11px] font-mono font-bold text-zinc-200 flex items-center gap-1"><Clock className="w-3 h-3 text-indigo-400" /> {video.duration}</span>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.6)] group-hover:scale-110 transition-transform"><Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white ml-0.5" /></div>
                      <span className="mt-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white/90 bg-black/60 px-3 py-0.5 rounded-full border border-white/10">Watch Here</span>
                    </div>
                  </div>
                  <div className="p-5 sm:p-6">
                    <span className={`text-xs font-bold ${video.accentColor}`}>{video.paper}</span>
                    <h3 onClick={() => setActiveVideo(video)} className="text-base sm:text-lg font-black text-white mt-1.5 mb-3.5 line-clamp-2 cursor-pointer group-hover:text-indigo-300 transition-colors">{video.title}</h3>
                    <div className="flex flex-wrap gap-1.5 mb-1">
                      {video.topicsCovered.map((topic, i) => <span key={i} className="text-[10px] sm:text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/5 text-zinc-300 font-medium">• {topic}</span>)}
                    </div>
                  </div>
                </div>
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3 border-t border-white/5 grid grid-cols-3 gap-2">
                  <Button onClick={() => setActiveVideo(video)} className="bg-red-500/15 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 rounded-xl h-9 sm:h-10 px-2 text-[11px] sm:text-xs font-bold transition-all"><Play className="w-3 h-3 mr-1 fill-current shrink-0" /> Watch</Button>
                  <Link href={video.notesLink}><Button className="w-full bg-indigo-500/15 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-xl h-9 sm:h-10 px-2 text-[11px] sm:text-xs font-bold transition-all"><BookOpen className="w-3 h-3 mr-1 shrink-0" /> Notes</Button></Link>
                  <Link href={video.practiceLink}><Button className="w-full bg-emerald-500/15 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-xl h-9 sm:h-10 px-2 text-[11px] sm:text-xs font-bold transition-all"><Trophy className="w-3 h-3 mr-1 shrink-0" /> MCQs</Button></Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </>
  );
}