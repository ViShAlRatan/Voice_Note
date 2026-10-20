"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, Sparkles, BookOpen, Loader2, 
  Search, Home, HelpCircle, Map, Code, MessageCircle, Briefcase, 
  Menu, X, ChevronDown, Smartphone, Heart, ShieldAlert, GraduationCap, 
  Library, Trophy, FileText, PlayCircle, CheckCircle2, 
  Flame, Lightbulb, RefreshCw, Play, ExternalLink, Clock, Eye,
  Edit3, Trash2, Plus, Save, Award, Cpu, BadgeCheck
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SplashScreen from "@/components/ui/SplashScreen";

// --- TYPE FOR YOUTUBE LECTURE ---
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

// --- DEFAULT YOUTUBE LECTURES DATA ---
const defaultYoutubeLectures: YoutubeLecture[] = [
  {
    id: "lec-1",
    youtubeId: "YOUR_VIDEO_ID_1",
    title: "Propositional Logic & Equivalences | Complete One-Shot with GATE PYQs",
    paper: "Paper 2 • Computer Science",
    unit: "Unit 1: Discrete Structures",
    duration: "52:18",
    views: "1.2k+ Learners",
    tag: "🔥 Most Watched",
    gradient: "from-indigo-600/40 via-purple-900/40 to-zinc-950",
    accentColor: "text-indigo-400",
    topicsCovered: ["Truth Tables & Tautology", "De Morgan's & Absorption Laws", "Implication Tricks"],
    notesLink: "/notes?paper=paper2&unit=unit1",
    practiceLink: "/practice?paper=paper2&unit=unit1",
    mcqCount: "120+ MCQs"
  },
  {
    id: "lec-2",
    youtubeId: "YOUR_VIDEO_ID_2",
    title: "Levels of Teaching (Memory, Understanding & Reflective) | Herbart, Morrison, Hunt",
    paper: "Paper 1 • Teaching Aptitude",
    unit: "Unit 1: Teaching Aptitude",
    duration: "44:10",
    views: "950+ Learners",
    tag: "✨ Exam Favorite",
    gradient: "from-purple-600/40 via-pink-900/40 to-zinc-950",
    accentColor: "text-purple-400",
    topicsCovered: ["Autonomous Level", "Herbart & Morrison 5 Steps", "Assertion-Reason Keywords"],
    notesLink: "/notes?paper=paper1&unit=unit1",
    practiceLink: "/practice?paper=paper1&unit=unit1",
    mcqCount: "75+ MCQs"
  },
  {
    id: "lec-3",
    youtubeId: "YOUR_VIDEO_ID_3",
    title: "Predicates, Nested Quantifiers & Rules of Inference | Zero to Advanced",
    paper: "Paper 2 • Computer Science",
    unit: "Unit 1: Discrete Structures",
    duration: "1:04:25",
    views: "1.5k+ Learners",
    tag: "🎯 High Weightage",
    gradient: "from-emerald-600/40 via-teal-900/40 to-zinc-950",
    accentColor: "text-emerald-400",
    topicsCovered: ["∀ vs ∃ Distribution", "Modus Ponens & Tollens", "Resolution Principle"],
    notesLink: "/notes?paper=paper2&unit=unit1",
    practiceLink: "/practice?paper=paper2&unit=unit1",
    mcqCount: "120+ MCQs"
  }
];

// Helper to extract 11-char YouTube ID from any URL or ID string
function extractYouTubeId(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "YOUR_VIDEO_ID";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = trimmed.match(regExp);
  if (match && match[2].length === 11) {
    return match[2];
  }
  return trimmed;
}

// --- QUICK FLASHCARDS FOR RETURNING STUDENTS ---
const dailyConcepts = [
  {
    tag: "GATE / NET Logic Trick",
    title: "Contrapositive Equivalence",
    formula: "p → q  ≡  ¬q → ¬p",
    desc: "An implication is ALWAYS logically equivalent to its contrapositive, never its converse!"
  },
  {
    tag: "Paper 1: Teaching Aptitude",
    title: "Levels of Teaching Proponents",
    formula: "Memory: Herbart | Understanding: Morrison | Reflective: Hunt",
    desc: "Remember the hierarchy: MLT (Thoughtless) ➔ ULT (Thoughtful) ➔ RLT (Problem-Centric)."
  },
  {
    tag: "First-Order Logic Rule",
    title: "Quantifier Distribution",
    formula: "∀x (P(x) ∧ Q(x)) ≡ ∀x P(x) ∧ ∀x Q(x)",
    desc: "Universal Quantifier (∀) distributes over AND (∧), while Existential (∃) distributes over OR (∨)."
  }
];

// --- ACTIVE STUDY MODULES ---
const studyModules = {
  paper2: [
    {
      unit: "Unit 1 • Discrete Structures",
      title: "Propositional & Predicate Logic",
      topics: ["Logical Equivalences", "Normal Forms (CNF/DNF)", "Nested Quantifiers", "Rules of Inference"],
      mcqs: "120+ GATE/NET Questions",
      readTime: "25 mins",
      notesLink: "/notes?paper=paper2&unit=unit1",
      practiceLink: "/practice?paper=paper2&unit=unit1",
      badge: "🔥 Newly Updated"
    },
    {
      unit: "Unit 4 • Database Systems",
      title: "Relational Algebra & Tuple Calculus",
      topics: ["Select, Project, Join", "Division Operator", "SQL Equivalences", "Normalization (1NF-BCNF)"],
      mcqs: "80+ PYQs Included",
      readTime: "20 mins",
      notesLink: "/notes?paper=paper2&unit=unit4",
      practiceLink: "/practice?paper=paper2&unit=unit4",
      badge: "High Weightage"
    },
    {
      unit: "Unit 5 • Operating Systems",
      title: "Process Synchronization & CPU Scheduling",
      topics: ["Semaphores & Mutex", "Deadlock Avoidance", "Banker's Algorithm", "Page Replacement"],
      mcqs: "90+ Numericals",
      readTime: "30 mins",
      notesLink: "/notes?paper=paper2&unit=unit5",
      practiceLink: "/practice?paper=paper2&unit=unit5",
      badge: "Core CS"
    }
  ],
  paper1: [
    {
      unit: "Unit 1 • Teaching Aptitude",
      title: "Teaching: Concept, Objectives & Taxonomies",
      topics: ["Bipolar vs Tri-polar", "Bloom's & Revised Taxonomy", "Gagne's 9 Events", "Maxims of Teaching"],
      mcqs: "100+ Statement MCQs",
      readTime: "18 mins",
      notesLink: "/notes?paper=paper1&unit=unit1",
      practiceLink: "/practice?paper=paper1&unit=unit1",
      badge: "🔥 Live on Site"
    },
    {
      unit: "Unit 1 • Teaching Aptitude",
      title: "Levels of Teaching (MLT, ULT, RLT)",
      topics: ["Autonomous Level", "Herbart's 5 Steps", "Morrison's Mastery Cycle", "Hunt's Problem Solving"],
      mcqs: "75+ Assertion-Reason Qs",
      readTime: "15 mins",
      notesLink: "/notes?paper=paper1&unit=unit1",
      practiceLink: "/practice?paper=paper1&unit=unit1",
      badge: "Must Read"
    },
    {
      unit: "Unit 2 • Research Aptitude",
      title: "Research Types, Steps & Positivism",
      topics: ["Positivism vs Post-Positivism", "Experimental vs Ex-Post Facto", "Sampling Methods", "Thesis Format"],
      mcqs: "85+ PYQs",
      readTime: "22 mins",
      notesLink: "/notes?paper=paper1&unit=unit2",
      practiceLink: "/practice?paper=paper1&unit=unit2",
      badge: "Scoring Unit"
    }
  ]
};

// --- FAQ DATA ---
const faqData = [
  {
    question: "How should I use Voice Note alongside your YouTube lectures?",
    answer: "Follow the 4-Step Loop: First, watch the concept video in our distraction-free player or on YouTube. Second, read the color-coded Digital Notes for exact definitions and formulas. Third, download the Handwritten PDF for quick revision, and finally, solve the Topic-wise MCQs in the Question Bank!"
  },
  {
    question: "Are the study materials, digital notes, and 120+ question banks completely free?",
    answer: "Yes! Every single digital note, handwritten PDF manual, and GATE/UGC NET question bank uploaded here is 100% free for my community and registered students."
  },
  {
    question: "How do I access the Flutter applications you build?",
    answer: "You can navigate to the Apps Hub section from the top menu. Each application comes with release notes, UI screenshots, and direct production APK download links."
  },
  {
    question: "Can I track my mock test accuracy and performance?",
    answer: "Yes, once you log in, your 'My Dashboard' section tracks your attempted quizzes, accuracy percentage, and helps you identify weak units before the actual exam."
  }
];

// --- ENHANCED SEARCH DATA ---
const searchData = [
  { title: "Video Lecture: Propositional Logic One-Shot", type: "Video", link: "#lectures" },
  { title: "Video Lecture: Levels of Teaching (MLT, ULT, RLT)", type: "Video", link: "#lectures" },
  { title: "Propositional & Predicate Logic (Notes + 120 MCQs)", type: "Topic", link: "/notes" },
  { title: "Levels of Teaching: Memory, Understanding, Reflective", type: "Topic", link: "/notes" },
  { title: "Teaching: Concept, Objectives & Bloom's Taxonomy", type: "Topic", link: "/notes" },
  { title: "Propositional Equivalences & Normal Forms", type: "Topic", link: "/notes" },
  { title: "Question Bank & Live Mock Tests", type: "Practice", link: "/practice" },
  { title: "Handwritten PDFs Store", type: "PDF", link: "/notes?view=handwritten" },
  { title: "Flutter Apps Hub (TrueBond & More)", type: "App", link: "/apps" },
  { title: "Contact Vishal Sharma", type: "Page", link: "/contact" }
];

const gradientPresets = [
  { label: "Indigo / Purple", value: "from-indigo-600/40 via-purple-900/40 to-zinc-950", accent: "text-indigo-400" },
  { label: "Purple / Pink", value: "from-purple-600/40 via-pink-900/40 to-zinc-950", accent: "text-purple-400" },
  { label: "Emerald / Teal", value: "from-emerald-600/40 via-teal-900/40 to-zinc-950", accent: "text-emerald-400" },
  { label: "Blue / Cyan", value: "from-blue-600/40 via-cyan-900/40 to-zinc-950", accent: "text-cyan-400" }
];

export default function HomePage() {
  const router = useRouter();

  // --- AUTH STATES ---
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>("user");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = Boolean(user && role === "admin");

  // --- UI STATES ---
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [navHidden, setNavHidden] = useState(false);
  const [activePaperTab, setActivePaperTab] = useState<"paper2" | "paper1">("paper2");
  const [conceptIndex, setConceptIndex] = useState(0);

  // 🎬 YOUTUBE LECTURES & ADMIN EDITOR STATES
  const [lectures, setLectures] = useState<YoutubeLecture[]>(defaultYoutubeLectures);
  const [activeVideo, setActiveVideo] = useState<YoutubeLecture | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSavingLecture, setIsSavingLecture] = useState(false);
  const [editingLecture, setEditingLecture] = useState<YoutubeLecture | null>(null);
  const [topicsInput, setTopicsInput] = useState("");

  // 🔥 MASTER SPLASH STATES 🔥
  const [isMounted, setIsMounted] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [isSplashDone, setIsSplashDone] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  // SEARCH STATES
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const words = [
    "YouTube Lecture Notes.", 
    "UGC NET Paper 1 & 2.", 
    "GATE CS Question Banks.", 
    "Production Flutter Apps."
  ];
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const typingSpeed = 75;

  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 500], [0, -35]); 

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setNavHidden(true);
    } else {
      setNavHidden(false);
    }
  });

  // CMD+K & ESCAPE SHORTCUT
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setActiveVideo(null);
        setIsEditModalOpen(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 🔥 MASTER SPLASH LOGIC 🔥
  useEffect(() => {
    setIsMounted(true);
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    
    if (!hasSeenSplash) {
      setIsFirstVisit(true);
      setShowSplash(true);
      sessionStorage.setItem("hasSeenSplash", "true");

      const timer = setTimeout(() => {
        setShowSplash(false);
        setIsSplashDone(true);
      }, 3800); 
      return () => clearTimeout(timer);
    } else {
      setIsFirstVisit(false);
      setShowSplash(false);
      setIsSplashDone(true);
    }
  }, []);

  // FETCH USER + LOAD SAVED LECTURES (Supabase + LocalStorage Fallback)
  useEffect(() => {
    async function initData() {
      const supabase = createClient();

      // 1. Load saved lectures from localStorage first for instant render
      const savedLocal = localStorage.getItem("vn_youtube_lectures");
      if (savedLocal) {
        try {
          const parsed = JSON.parse(savedLocal);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setLectures(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      }

      // 2. Try loading from Supabase table `youtube_lectures` if it exists
      try {
        const { data: dbLectures, error } = await supabase
          .from("youtube_lectures")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && dbLectures && dbLectures.length > 0) {
          setLectures(dbLectures);
          localStorage.setItem("vn_youtube_lectures", JSON.stringify(dbLectures));
        }
      } catch {
        // Table not created yet, fallback silently to localStorage/default
      }

      // 3. Fetch Auth User & Role
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (profileData) {
          setRole(profileData.role);
          setProfile(profileData);
        }
      }
      setLoading(false);
    }
    initData();

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % words.length;
      const fullText = words[i];
      setText(isDeleting 
        ? fullText.substring(0, text.length - 1) 
        : fullText.substring(0, text.length + 1)
      );
      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 1600);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };
    const timer = setTimeout(handleTyping, isDeleting ? typingSpeed / 2 : typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum]);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const nextConcept = () => {
    setConceptIndex((prev) => (prev + 1) % dailyConcepts.length);
  };

  useEffect(() => {
    async function trackVisitor() {
      const supabase = createClient();
      const hasVisited = localStorage.getItem("has_visited");
      if (!hasVisited) {
        await supabase.rpc("increment_visitor"); 
        localStorage.setItem("has_visited", "true");
      }
    }
    trackVisitor();
  }, []);

  // --- ADMIN LECTURE HANDLERS ---
  const openEditLectureModal = (lecture?: YoutubeLecture) => {
    if (!isAdmin) return;
    if (lecture) {
      setEditingLecture({ ...lecture });
      setTopicsInput(lecture.topicsCovered.join(", "));
    } else {
      const newLec: YoutubeLecture = {
        id: `lec-${Date.now()}`,
        youtubeId: "",
        title: "",
        paper: "Paper 2 • Computer Science",
        unit: "Unit 1: Discrete Structures",
        duration: "45:00",
        views: "New Lecture",
        tag: "🔥 Newly Added",
        gradient: gradientPresets[0].value,
        accentColor: gradientPresets[0].accent,
        topicsCovered: ["Core Concept", "Important Theorems", "GATE & NET PYQs"],
        notesLink: "/notes?paper=paper2&unit=unit1",
        practiceLink: "/practice?paper=paper2&unit=unit1",
        mcqCount: "100+ MCQs"
      };
      setEditingLecture(newLec);
      setTopicsInput(newLec.topicsCovered.join(", "));
    }
    setIsEditModalOpen(true);
  };

  const handleSaveLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !editingLecture) return;

    setIsSavingLecture(true);
    const cleanedYoutubeId = extractYouTubeId(editingLecture.youtubeId);
    const cleanedTopics = topicsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const updatedItem: YoutubeLecture = {
      ...editingLecture,
      youtubeId: cleanedYoutubeId,
      topicsCovered: cleanedTopics.length > 0 ? cleanedTopics : ["Complete Lecture"]
    };

    const exists = lectures.some((l) => l.id === updatedItem.id);
    const updatedList = exists
      ? lectures.map((l) => (l.id === updatedItem.id ? updatedItem : l))
      : [updatedItem, ...lectures];

    // Save locally immediately
    setLectures(updatedList);
    localStorage.setItem("vn_youtube_lectures", JSON.stringify(updatedList));

    // Also try upserting to Supabase if table exists
    try {
      const supabase = createClient();
      await supabase.from("youtube_lectures").upsert(updatedItem, { onConflict: "id" });
    } catch {
      // Ignore if table not set up yet
    }

    setIsSavingLecture(false);
    setIsEditModalOpen(false);
    setEditingLecture(null);
    toast.success(exists ? "Lecture updated successfully! ✅" : "New lecture added! 🎬");
  };

  const handleDeleteLecture = async (id: string) => {
    if (!isAdmin) return;
    if (!window.confirm("Are you sure you want to delete this video lecture card?")) return;

    const updatedList = lectures.filter((l) => l.id !== id);
    setLectures(updatedList);
    localStorage.setItem("vn_youtube_lectures", JSON.stringify(updatedList));

    try {
      const supabase = createClient();
      await supabase.from("youtube_lectures").delete().eq("id", id);
    } catch {
      // Ignore if table not set up
    }
    toast.success("Lecture removed.");
  };

  const filteredSearch = searchData.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

  if (!isMounted) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-[#050508] text-white selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-x-hidden font-sans">

      {/* 🚀 SPLASH SCREEN CONTROLLED BY HOME PAGE 🚀 */}
      <SplashScreen isVisible={showSplash} />
      
      {/* 🚀 MODERN TECH GRID BACKGROUND 🚀 */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:48px_48px] sm:bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* MOUSE GLOW */}
      <div 
        className="pointer-events-none fixed inset-0 z-40 transition-opacity duration-300 hidden md:block mix-blend-screen"
        style={{ background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99,102,241,0.09), transparent 40%)` }}
      />

      {/* 🔥 MAIN CONTENT WRAPPER 🔥 */}
      <div 
        className={`w-full ${
          !isFirstVisit 
            ? "opacity-100" 
            : `transition-opacity duration-1000 ease-in-out ${isSplashDone ? "opacity-100" : "opacity-0 h-screen overflow-hidden pointer-events-none"}`
        }`}
      >
        {/* 🛠️ ADMIN-ONLY LECTURE EDITOR MODAL 🛠️ */}
        <AnimatePresence>
          {isAdmin && isEditModalOpen && editingLecture && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                className="absolute inset-0 bg-black/85 backdrop-blur-xl pointer-events-auto" 
                onClick={() => setIsEditModalOpen(false)} 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-950 border border-indigo-500/40 rounded-3xl shadow-[0_0_90px_rgba(99,102,241,0.25)] z-10 pointer-events-auto p-5 sm:p-8"
              >
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-indigo-400">Admin Control</span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">Customize Video Lecture Card</h3>
                  </div>
                  <button 
                    onClick={() => setIsEditModalOpen(false)} 
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveLecture} className="space-y-4 text-sm">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">Lecture Title *</label>
                    <input
                      type="text"
                      required
                      value={editingLecture.title}
                      onChange={(e) => setEditingLecture({ ...editingLecture, title: e.target.value })}
                      placeholder="e.g. Propositional Logic & Equivalences | One-Shot"
                      className="w-full rounded-xl bg-black border border-white/15 px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1.5">YouTube Video Link or ID *</label>
                      <input
                        type="text"
                        required
                        value={editingLecture.youtubeId}
                        onChange={(e) => setEditingLecture({ ...editingLecture, youtubeId: e.target.value })}
                        placeholder="Paste full YT URL or 11-char ID"
                        className="w-full rounded-xl bg-black border border-white/15 px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1.5">Select Paper *</label>
                      <select
                        value={editingLecture.paper}
                        onChange={(e) => {
                          const val = e.target.value;
                          const isP1 = val.includes("Paper 1");
                          setEditingLecture({
                            ...editingLecture,
                            paper: val,
                            notesLink: isP1 ? "/notes?paper=paper1&unit=unit1" : "/notes?paper=paper2&unit=unit1",
                            practiceLink: isP1 ? "/practice?paper=paper1&unit=unit1" : "/practice?paper=paper2&unit=unit1"
                          });
                        }}
                        className="w-full rounded-xl bg-black border border-white/15 px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Paper 2 • Computer Science">Paper 2 • Computer Science</option>
                        <option value="Paper 1 • Teaching Aptitude">Paper 1 • Teaching Aptitude</option>
                        <option value="GATE CSE • Special Class">GATE CSE • Special Class</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1.5">Unit Number & Name *</label>
                      <input
                        type="text"
                        required
                        value={editingLecture.unit}
                        onChange={(e) => setEditingLecture({ ...editingLecture, unit: e.target.value })}
                        placeholder="e.g. Unit 1: Discrete Structures"
                        className="w-full rounded-xl bg-black border border-white/15 px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1.5">Card Color Theme</label>
                      <select
                        value={editingLecture.gradient}
                        onChange={(e) => {
                          const found = gradientPresets.find((p) => p.value === e.target.value) || gradientPresets[0];
                          setEditingLecture({ ...editingLecture, gradient: found.value, accentColor: found.accent });
                        }}
                        className="w-full rounded-xl bg-black border border-white/15 px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                      >
                        {gradientPresets.map((p) => (
                          <option key={p.label} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">Topics Covered (Comma separated) *</label>
                    <input
                      type="text"
                      required
                      value={topicsInput}
                      onChange={(e) => setTopicsInput(e.target.value)}
                      placeholder="Truth Tables, De Morgan's Law, Implication Tricks"
                      className="w-full rounded-xl bg-black border border-white/15 px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1.5">Duration</label>
                      <input
                        type="text"
                        value={editingLecture.duration}
                        onChange={(e) => setEditingLecture({ ...editingLecture, duration: e.target.value })}
                        placeholder="52:18"
                        className="w-full rounded-xl bg-black border border-white/15 px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1.5">Top Tag</label>
                      <input
                        type="text"
                        value={editingLecture.tag}
                        onChange={(e) => setEditingLecture({ ...editingLecture, tag: e.target.value })}
                        placeholder="🔥 Most Watched"
                        className="w-full rounded-xl bg-black border border-white/15 px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1.5">Subtitle/Views</label>
                      <input
                        type="text"
                        value={editingLecture.views}
                        onChange={(e) => setEditingLecture({ ...editingLecture, views: e.target.value })}
                        placeholder="1.2k+ Learners"
                        className="w-full rounded-xl bg-black border border-white/15 px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1.5">MCQ Badge</label>
                      <input
                        type="text"
                        value={editingLecture.mcqCount}
                        onChange={(e) => setEditingLecture({ ...editingLecture, mcqCount: e.target.value })}
                        placeholder="120+ MCQs"
                        className="w-full rounded-xl bg-black border border-white/15 px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1.5">Notes Button URL</label>
                      <input
                        type="text"
                        value={editingLecture.notesLink}
                        onChange={(e) => setEditingLecture({ ...editingLecture, notesLink: e.target.value })}
                        placeholder="/notes?paper=paper2&unit=unit1"
                        className="w-full rounded-xl bg-black border border-white/15 px-3.5 py-2.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1.5">MCQs Button URL</label>
                      <input
                        type="text"
                        value={editingLecture.practiceLink}
                        onChange={(e) => setEditingLecture({ ...editingLecture, practiceLink: e.target.value })}
                        placeholder="/practice?paper=paper2&unit=unit1"
                        className="w-full rounded-xl bg-black border border-white/15 px-3.5 py-2.5 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-5 border-t border-white/10">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsEditModalOpen(false)}
                      className="rounded-xl border-white/10 bg-zinc-900 text-white hover:bg-zinc-800"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSavingLecture}
                      className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-6"
                    >
                      {isSavingLecture ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                      Save Changes
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 🎬 IN-APP STUDY CINEMA MODAL (DISTRACTION-FREE YOUTUBE PLAYER) 🎬 */}
        <AnimatePresence>
          {activeVideo && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                className="absolute inset-0 bg-black/85 backdrop-blur-xl pointer-events-auto" 
                onClick={() => setActiveVideo(null)} 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.92, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.92, y: 20 }} 
                className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-zinc-950 border border-indigo-500/30 rounded-2xl sm:rounded-3xl shadow-[0_0_100px_rgba(99,102,241,0.25)] z-10 pointer-events-auto"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/10 bg-zinc-900/60">
                  <div className="flex items-center gap-2.5 pr-3 min-w-0">
                    <span className="px-2.5 py-1 rounded-md bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] font-bold flex items-center gap-1.5 shrink-0">
                      <Play className="w-3 h-3 fill-red-400" /> Classroom
                    </span>
                    <h3 className="text-xs sm:text-base font-bold text-white truncate">{activeVideo.title}</h3>
                  </div>
                  <button 
                    onClick={() => setActiveVideo(null)} 
                    className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Video Embed Container */}
                <div className="relative aspect-video w-full bg-black">
                  {activeVideo.youtubeId.startsWith("YOUR_VIDEO_ID") ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 text-center bg-gradient-to-b from-zinc-900 to-black">
                      <PlayCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mb-3 sm:mb-4 animate-pulse" />
                      <h4 className="text-base sm:text-xl font-bold text-white mb-2">Video Stream Ready</h4>
                      <p className="text-zinc-400 text-xs sm:text-sm max-w-md mb-4">
                        {isAdmin 
                          ? "Click the 'Edit' button on this card to paste your YouTube Video Link or ID!" 
                          : "This lecture video will be live shortly. Meanwhile, you can access the notes and MCQs below!"}
                      </p>
                      {isAdmin && (
                        <Button 
                          onClick={() => {
                            const vid = activeVideo;
                            setActiveVideo(null);
                            openEditLectureModal(vid);
                          }}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
                        >
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

                {/* Modal Footer: Companion Actions */}
                <div className="p-4 sm:p-6 bg-zinc-900/90 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] sm:text-xs text-indigo-400 font-bold uppercase tracking-wider">{activeVideo.unit}</span>
                    <p className="text-xs text-zinc-400 mt-0.5">Done watching? Lock in the concept with notes & practice questions:</p>
                  </div>
                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <Link href={activeVideo.notesLink} className="flex-1 sm:flex-initial">
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-10 px-4 sm:px-5 text-xs font-bold">
                        <BookOpen className="w-4 h-4 mr-1.5 shrink-0" /> Read Notes
                      </Button>
                    </Link>
                    <Link href={activeVideo.practiceLink} className="flex-1 sm:flex-initial">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-10 px-4 sm:px-5 text-xs font-bold">
                        <Trophy className="w-4 h-4 mr-1.5 shrink-0" /> Solve {activeVideo.mcqCount}
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* SEARCH COMMAND PALETTE MODAL */}
        <AnimatePresence>
          {isSearchOpen && (
            <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[14vh] px-3 sm:px-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                className="absolute inset-0 bg-black/80 backdrop-blur-md" 
                onClick={() => setIsSearchOpen(false)} 
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
                  <button onClick={() => setIsSearchOpen(false)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <X className="w-5 h-5 text-zinc-400 hover:text-white" />
                  </button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto p-2 sm:p-3">
                  {filteredSearch.length === 0 ? (
                    <p className="text-center py-10 text-sm text-zinc-500 font-medium">No lecture notes or topics found for "{searchQuery}"</p>
                  ) : (
                    filteredSearch.map((item, index) => (
                      <button 
                        key={index} onClick={() => { setIsSearchOpen(false); router.push(item.link); }}
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

        {/* --- SMART ANIMATED NAVBAR --- */}
        <motion.header 
          variants={{ visible: { y: 0, opacity: 1 }, hidden: { y: "-100%", opacity: 0 } }}
          animate={navHidden ? "hidden" : "visible"}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-2xl pointer-events-auto"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 font-bold tracking-wider text-lg sm:text-xl group">
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl overflow-hidden bg-zinc-900 border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.25)] group-hover:scale-105 transition-transform shrink-0">
                <Image src="/logo.png" alt="Logo" fill className="object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-black bg-gradient-to-r from-white via-indigo-100 to-zinc-400 bg-clip-text text-transparent leading-none text-base sm:text-xl">VOICE NOTE</span>
                <span className="text-[9px] sm:text-[10px] text-indigo-400 font-bold tracking-widest uppercase mt-0.5">CS Study Hub</span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1 bg-white/[0.04] p-1.5 rounded-full border border-white/10">
              <Link href="/" className="px-4 py-2 rounded-full text-sm font-bold text-white bg-indigo-600/20 border border-indigo-500/30 shadow-sm flex items-center gap-2"><Home className="w-4 h-4 text-indigo-400"/> Home</Link>
              <Link href="#lectures" className="px-4 py-2 rounded-full text-sm font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5"><PlayCircle className="w-4 h-4 text-red-400"/> Lectures</Link>
              <Link href="/notes" className="px-4 py-2 rounded-full text-sm font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-emerald-400"/> Notes</Link>
              <Link href="/practice" className="px-4 py-2 rounded-full text-sm font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5"><Trophy className="w-4 h-4 text-amber-400"/> MCQs</Link>
              <Link href="/apps" className="px-4 py-2 rounded-full text-sm font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition-all">Apps</Link>
              <Link href="/blog" className="px-4 py-2 rounded-full text-sm font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition-all">Blog</Link>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={() => setIsSearchOpen(true)} 
                className="flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-zinc-900/90 border border-white/10 text-xs font-semibold text-zinc-400 hover:text-white hover:border-indigo-500/50 transition-all"
                aria-label="Search Topics"
              >
                <Search className="w-4 h-4 text-indigo-400" /> 
                <span className="hidden md:inline">Search...</span> 
                <kbd className="hidden md:inline font-sans px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-zinc-300">⌘K</kbd>
              </button>

              <Link href="/portfolio" className="hidden xl:flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 text-xs font-bold transition-all">
                <Heart className="w-3.5 h-3.5 text-pink-400 animate-pulse" /> Portfolio
              </Link>

              {loading ? (
                <Loader2 className="w-5 h-5 text-zinc-500 animate-spin" />
              ) : user ? (
                <Link href={role === "admin" ? "/admin" : "/dashboard"} 
                className="group relative w-9 h-9 sm:w-10 sm:h-10 rounded-full p-0.5 bg-gradient-to-tr from-indigo-500 to-purple-500 hover:scale-105 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] flex-shrink-0">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-black bg-zinc-900">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-indigo-600 flex items-center justify-center font-black text-xs sm:text-sm text-white uppercase">
                        {profile?.full_name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                </Link>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/login"><Button variant="ghost" className="text-sm text-zinc-300 hover:text-white hover:bg-white/10 h-10 rounded-xl font-bold">Log In</Button></Link>
                  <Link href="/register"><Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-105 transition-transform text-sm font-bold rounded-xl px-5 h-10 shadow-lg shadow-indigo-500/25 border border-indigo-400/40">Free Access</Button></Link>
                </div>
              )}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-zinc-300 hover:text-white bg-zinc-900 border border-white/10">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* MOBILE MENU */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} 
              className="lg:hidden border-b border-white/10 bg-zinc-950/98 backdrop-blur-3xl px-5 pt-4 pb-8 space-y-4 shadow-2xl overflow-hidden">
                <nav className="flex flex-col space-y-1.5 text-sm sm:text-base font-semibold text-zinc-300">
                  <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-white px-4 py-2.5 rounded-xl bg-white/5"><Home className="w-4 h-4 text-indigo-400"/> Home</Link>
                  <Link href="#lectures" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-red-400 flex items-center gap-3"><PlayCircle className="w-4 h-4"/> Latest YT Lectures</Link>
                  <Link href="/notes" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-emerald-400 flex items-center gap-3"><BookOpen className="w-4 h-4"/> YouTube Lecture Notes</Link>
                  <Link href="/practice" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-amber-400 flex items-center gap-3"><Trophy className="w-4 h-4"/> Practice Question Bank</Link>
                  <Link href="/apps" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-3"><Smartphone className="w-4 h-4 text-purple-400"/> Flutter Apps Hub</Link>
                  <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-3"><Sparkles className="w-4 h-4 text-blue-400"/> Tech Blog</Link>
                  <Link href="/portfolio" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 text-indigo-300 mt-2">
                    <Heart className="w-4 h-4 text-pink-400 animate-pulse" /> View Vishal's Portfolio
                  </Link>
                </nav>
                {!user && (
                  <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-3">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full border-white/10 bg-zinc-900 text-white h-11 rounded-xl font-bold">Log In</Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white h-11 rounded-xl font-bold">Join Free</Button>
                    </Link>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>

        {/* --- EDUCATOR + COMPANION HERO SECTION (ULTRA RESPONSIVE) --- */}
        <section className="relative pt-24 pb-12 sm:pt-32 md:pt-36 md:pb-20 px-4 sm:px-6 lg:px-8 z-10 pointer-events-auto overflow-hidden">
          
          {/* Ambient Glows */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[85vw] sm:w-[70vw] h-[40vh] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-36 right-5 w-[40vw] h-[30vh] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column: Value Proposition & CTAs */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
              
              {/* YouTube Companion Pill */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full bg-zinc-900/90 px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-sm text-zinc-200 border border-white/10 mb-5 sm:mb-6 shadow-xl backdrop-blur-md"
              >
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold text-[11px] border border-red-500/30">
                  <PlayCircle className="w-3.5 h-3.5" /> YT Companion
                </span>
                <span className="font-medium text-zinc-300">Watch on YouTube • <strong className="text-white">Revise & Practice Here</strong></span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} 
                className="text-3xl sm:text-5xl md:text-6xl xl:text-7xl font-black tracking-tight leading-[1.1] mb-4 sm:mb-5"
              >
                Don't Just Watch. <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
                  Master Every Concept.
                </span>
              </motion.h1>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base sm:text-xl md:text-2xl font-bold text-zinc-300 mb-4 min-h-[2rem] sm:min-h-[2.25rem]"
              >
                Your hub for <span className="text-indigo-400 underline decoration-indigo-500/40 underline-offset-4">{text}</span>
                <span className="animate-pulse text-white">|</span>
              </motion.div>

              <motion.p 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }} 
                className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl mb-7 sm:mb-8 leading-relaxed"
              >
                Jo topics hum YouTube class mein samajhte hain, unke <strong className="text-white">Color-Coded Digital Notes</strong>, <strong className="text-amber-300">Handwritten PDFs</strong>, aur <strong className="text-emerald-400">GATE / UGC NET Level MCQs</strong> aapko seedha yahan milenge.
              </motion.p>

              {/* Primary CTAs */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} 
                className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 w-full sm:w-auto"
              >
                <Link href="/notes" className="w-full sm:w-auto group">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl h-12 sm:h-14 px-6 sm:px-8 font-black shadow-[0_0_35px_rgba(99,102,241,0.35)] transition-all group-hover:scale-105 text-sm sm:text-base border border-indigo-400/40">
                    <BookOpen className="mr-2 w-4 h-4 sm:w-5 sm:h-5" /> Open Class Notes <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="#lectures" className="w-full sm:w-auto group">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-2xl border-red-500/30 bg-red-500/10 hover:bg-red-500/20 h-12 sm:h-14 px-6 sm:px-8 text-red-300 backdrop-blur-xl font-bold text-sm sm:text-base transition-all group-hover:scale-105">
                    <PlayCircle className="mr-2 w-4 h-4 sm:w-5 sm:h-5 text-red-400" /> Watch Latest Lectures
                  </Button>
                </Link>
              </motion.div>

              {/* Quick Trust Chips */}
              <div className="mt-7 sm:mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-5 text-[11px] sm:text-xs font-semibold text-zinc-400">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> 100% Free Forever</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" /> Paper 1 & Paper 2 CS</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" /> Direct PYQ Explanations</span>
              </div>
            </div>

            {/* Right Column: 🌟 REDESIGNED PREMIUM EDUCATOR & ENGINEER CARD 🌟 */}
            <motion.div style={{ y: imageY }} className="lg:col-span-5 flex flex-col items-center w-full">
              
              <div className="relative w-full max-w-md lg:max-w-none rounded-[2rem] p-[1px] bg-gradient-to-b from-indigo-500/50 via-purple-500/20 to-white/10 shadow-[0_25px_70px_rgba(99,102,241,0.2)]">
                <div className="relative rounded-[calc(2rem-1px)] bg-zinc-950/90 backdrop-blur-2xl overflow-hidden">
                  
                  {/* Top Decorative Cyber-Educator Cover Banner */}
                  <div className="relative h-24 sm:h-28 bg-gradient-to-r from-indigo-900/80 via-purple-900/70 to-blue-900/80 overflow-hidden border-b border-white/10">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:20px_20px]" />
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-[10px] sm:text-[11px] font-bold text-emerald-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Mentor Online
                    </div>
                    <div className="absolute bottom-2 right-3 sm:right-4 hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-indigo-200/80">
                      <Cpu className="w-3.5 h-3.5 text-indigo-300" /> CS • AI • FLUTTER
                    </div>
                  </div>

                  {/* Avatar + Identity Section */}
                  <div className="px-5 sm:px-7 pb-6 sm:pb-7">
                    <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12 sm:-mt-14 mb-5 text-center sm:text-left">
                      <div className="relative shrink-0">
                        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 blur-md opacity-80 animate-pulse" />
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-4 border-zinc-950 overflow-hidden bg-zinc-900 shadow-2xl">
                          <img src="/dev.jpg" alt="Vishal Sharma" className="object-cover w-full h-full scale-105" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-indigo-600 border-2 border-zinc-950 flex items-center justify-center text-white shadow-lg" title="Verified Educator">
                          <BadgeCheck className="w-4 h-4 fill-indigo-400 text-zinc-950" />
                        </div>
                      </div>

                      <div className="flex-1 pt-1">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-1">
                          <Award className="w-3 h-3 text-amber-400" /> Educator & Engineer
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center sm:justify-start gap-1.5">
                          Vishal Sharma
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-400 font-medium mt-0.5">
                          Simplifying UGC NET & GATE CS • Full-Stack & Flutter Dev
                        </p>
                      </div>
                    </div>

                    {/* Specialization Pills */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2 mb-5">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-bold text-indigo-300">
                        🎓 UGC NET Paper 1 & 2
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-300">
                        🧠 Discrete Logic & DBMS
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[11px] font-bold text-purple-300">
                        📱 Flutter & Next.js
                      </span>
                    </div>

                    {/* 3-Column Mini Stats Bar */}
                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 mb-5 text-center">
                      <div className="p-1.5">
                        <div className="text-base sm:text-lg font-black text-white">120+</div>
                        <div className="text-[10px] text-zinc-400 font-bold uppercase">Logic MCQs</div>
                      </div>
                      <div className="p-1.5 border-x border-white/10">
                        <div className="text-base sm:text-lg font-black text-indigo-400">10 Units</div>
                        <div className="text-[10px] text-zinc-400 font-bold uppercase">Structured</div>
                      </div>
                      <div className="p-1.5">
                        <div className="text-base sm:text-lg font-black text-emerald-400">Free</div>
                        <div className="text-[10px] text-zinc-400 font-bold uppercase">PDFs & Notes</div>
                      </div>
                    </div>

                    {/* Interactive Daily Concept Booster inside Educator Card */}
                    <div className="rounded-2xl bg-gradient-to-br from-indigo-950/50 via-zinc-900/90 to-black border border-indigo-500/30 p-4 sm:p-5 relative shadow-inner">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-400">
                          <Lightbulb className="w-3.5 h-3.5 shrink-0" /> {dailyConcepts[conceptIndex].tag}
                        </span>
                        <button 
                          onClick={nextConcept}
                          className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-indigo-300 hover:text-white bg-indigo-500/20 hover:bg-indigo-500/30 px-2.5 py-1 rounded-lg border border-indigo-500/30 transition-all shrink-0"
                          title="Next Revision Concept"
                        >
                          <RefreshCw className="w-3 h-3" /> Next Tip
                        </button>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white mb-2">{dailyConcepts[conceptIndex].title}</h4>
                      <div className="p-2.5 rounded-xl bg-black/80 border border-indigo-500/25 font-mono text-[11px] sm:text-xs text-emerald-300 text-center font-bold mb-2.5 overflow-x-auto">
                        {dailyConcepts[conceptIndex].formula}
                      </div>
                      <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed">
                        {dailyConcepts[conceptIndex].desc}
                      </p>
                    </div>

                    {/* Bottom Quick Links inside Educator Card */}
                    <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
                      <Link href="/portfolio" className="text-zinc-300 hover:text-indigo-400 flex items-center gap-1.5 transition-colors">
                        <Heart className="w-3.5 h-3.5 text-pink-400" /> About Vishal
                      </Link>
                      <Link href={user ? (role === "admin" ? "/admin" : "/dashboard") : "/register"} className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                        {user ? (role === "admin" ? "Open Admin Panel ➔" : "Go to Dashboard ➔") : "Create Student ID ➔"}
                      </Link>
                    </div>
                  </div>

                </div>
              </div>

            </motion.div>

          </div>
        </section>

        {/* --- 4-STEP YOUTUBE TO WEBSITE LEARNING LOOP --- */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 z-20 relative pointer-events-auto">
          <div className="rounded-3xl bg-zinc-900/40 border border-white/10 p-5 sm:p-8 backdrop-blur-xl">
            <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-indigo-400">The Smart Study Workflow</span>
              <h2 className="text-xl sm:text-3xl font-black mt-1">How to Use This Platform With My Videos</h2>
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
                <p className="text-xs text-zinc-400 leading-relaxed">Test your concept clarity with GATE & UGC NET level questions and explanations.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- 🎬 LATEST YOUTUBE LECTURES SECTION (ADMIN EDITABLE, HIDDEN FROM NORMAL USERS) 🎬 --- */}
        <section id="lectures" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 z-10 relative scroll-mt-20 pointer-events-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-red-400 mb-3">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" /> Fresh From YouTube
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white">Latest Video Lectures</h2>
              <p className="text-zinc-400 text-xs sm:text-base mt-1">
                Watch distraction-free right here, then jump straight into that lecture's notes and MCQs.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* 🔒 ONLY VISIBLE TO ADMIN 🔒 */}
              {isAdmin && (
                <Button
                  onClick={() => openEditLectureModal()}
                  className="rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm h-11 px-4 shadow-lg shadow-indigo-500/25"
                >
                  <Plus className="w-4 h-4 mr-1.5" /> Add Video Lecture
                </Button>
              )}

              <Link 
                href="https://www.youtube.com" 
                target="_blank"
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-red-600/15 hover:bg-red-600/25 text-red-300 border border-red-500/30 text-xs sm:text-sm font-bold transition-all"
              >
                <PlayCircle className="w-4 h-4 text-red-400 shrink-0" /> YouTube Channel <ExternalLink className="w-3.5 h-3.5 ml-0.5 shrink-0" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {lectures.map((video, idx) => {
              const hasRealId = Boolean(video.youtubeId && !video.youtubeId.startsWith("YOUR_VIDEO_ID"));
              return (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="rounded-3xl border border-white/10 bg-zinc-900/40 hover:bg-zinc-900/75 hover:border-indigo-500/40 overflow-hidden flex flex-col justify-between transition-all group shadow-xl relative"
                >
                  {/* 🔒 ADMIN FLOATING EDIT / DELETE CONTROLS (INVISIBLE TO REGULAR USERS) 🔒 */}
                  {isAdmin && (
                    <div className="absolute top-14 right-3 z-30 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditLectureModal(video);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-600/95 hover:bg-indigo-500 text-white text-[11px] font-bold shadow-lg border border-white/20 backdrop-blur-md transition-transform hover:scale-105"
                        title="Edit Lecture Details"
                      >
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteLecture(video.id);
                        }}
                        className="p-1.5 rounded-xl bg-red-600/90 hover:bg-red-500 text-white shadow-lg border border-white/20 backdrop-blur-md transition-transform hover:scale-105"
                        title="Delete Lecture Card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div>
                    {/* Video Thumbnail / Interactive Preview */}
                    <div 
                      onClick={() => setActiveVideo(video)}
                      className={`relative aspect-video w-full bg-gradient-to-br ${video.gradient} cursor-pointer overflow-hidden border-b border-white/10`}
                    >
                      {hasRealId && (
                        <img 
                          src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`} 
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                        />
                      )}

                      {/* Top Badges on Thumbnail */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                        <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-[10px] sm:text-[11px] font-bold text-white truncate">
                          {video.tag}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-[10px] sm:text-[11px] font-mono font-bold text-zinc-200 flex items-center gap-1 shrink-0">
                          <Clock className="w-3 h-3 text-indigo-400" /> {video.duration}
                        </span>
                      </div>

                      {/* Center Play Button Overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.6)] group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white ml-0.5" />
                        </div>
                        <span className="mt-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white/90 bg-black/60 px-3 py-0.5 rounded-full border border-white/10">
                          Click to Watch Here
                        </span>
                      </div>

                      {/* Bottom Unit Strip */}
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between gap-2 text-[10px] sm:text-[11px] text-zinc-300 font-semibold z-10">
                        <span className="bg-black/75 px-2.5 py-0.5 rounded-md backdrop-blur-md truncate">{video.unit}</span>
                        <span className="bg-black/75 px-2.5 py-0.5 rounded-md backdrop-blur-md flex items-center gap-1 shrink-0">
                          <Eye className="w-3 h-3 text-emerald-400" /> {video.views}
                        </span>
                      </div>
                    </div>

                    {/* Lecture Info Body */}
                    <div className="p-5 sm:p-6">
                      <span className={`text-xs font-bold ${video.accentColor}`}>
                        {video.paper}
                      </span>
                      <h3 
                        onClick={() => setActiveVideo(video)}
                        className="text-base sm:text-lg font-black text-white mt-1.5 mb-3.5 line-clamp-2 cursor-pointer group-hover:text-indigo-300 transition-colors"
                      >
                        {video.title}
                      </h3>

                      {/* Key Topics Covered in Video */}
                      <div className="flex flex-wrap gap-1.5 mb-1">
                        {video.topicsCovered.map((topic, i) => (
                          <span 
                            key={i} 
                            className="text-[10px] sm:text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/5 text-zinc-300 font-medium"
                          >
                            • {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 3-in-1 Action Footer: Watch + Notes + MCQs */}
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3 border-t border-white/5 grid grid-cols-3 gap-2">
                    <Button 
                      onClick={() => setActiveVideo(video)}
                      className="bg-red-500/15 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 rounded-xl h-9 sm:h-10 px-2 text-[11px] sm:text-xs font-bold transition-all"
                    >
                      <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 fill-current shrink-0" /> Watch
                    </Button>
                    <Link href={video.notesLink}>
                      <Button className="w-full bg-indigo-500/15 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-xl h-9 sm:h-10 px-2 text-[11px] sm:text-xs font-bold transition-all">
                        <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 shrink-0" /> Notes
                      </Button>
                    </Link>
                    <Link href={video.practiceLink}>
                      <Button className="w-full bg-emerald-500/15 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-xl h-9 sm:h-10 px-2 text-[11px] sm:text-xs font-bold transition-all">
                        <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 shrink-0" /> MCQs
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* --- 🔥 INTERACTIVE SYLLABUS & RECENTLY TAUGHT HUB 🔥 --- */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 z-10 relative pointer-events-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-5">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">
                <Flame className="w-4 h-4" /> Direct Classroom Access
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white">Active Study Modules</h2>
              <p className="text-zinc-400 text-xs sm:text-base mt-1">Browse unit-wise notes and question banks by paper.</p>
            </div>

            {/* Paper 1 vs Paper 2 Switcher */}
            <div className="flex bg-zinc-900 p-1.5 rounded-2xl border border-white/10 w-full md:w-auto">
              <button
                onClick={() => setActivePaperTab("paper2")}
                className={`flex-1 md:flex-none px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activePaperTab === "paper2" 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25" 
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                💻 Paper 2 (CS)
              </button>
              <button
                onClick={() => setActivePaperTab("paper1")}
                className={`flex-1 md:flex-none px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activePaperTab === "paper1" 
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25" 
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                🎓 Paper 1 (General)
              </button>
            </div>
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {studyModules[activePaperTab].map((mod, idx) => (
              <motion.div
                key={mod.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className="rounded-3xl border border-white/10 bg-zinc-900/40 hover:bg-zinc-900/70 hover:border-indigo-500/40 p-5 sm:p-7 flex flex-col justify-between transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-bold text-indigo-400 truncate">{mod.unit}</span>
                    <span className="text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 shrink-0">
                      {mod.badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-white mb-4 group-hover:text-indigo-300 transition-colors">
                    {mod.title}
                  </h3>

                  <div className="space-y-2 mb-6">
                    {mod.topics.map((t, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
                    <span className="text-emerald-400 font-bold">🎯 {mod.mcqs}</span>
                    <span>⏱️ {mod.readTime} read</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <Link href={mod.notesLink}>
                      <Button className="w-full bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-xl h-10 text-xs font-bold transition-all">
                        Read Notes
                      </Button>
                    </Link>
                    <Link href={mod.practiceLink}>
                      <Button className="w-full bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-xl h-10 text-xs font-bold transition-all">
                        Solve MCQs
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- MODERN BENTO GRID (COMPLETE ECOSYSTEM) --- */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 z-10 relative pointer-events-auto">
          <div className="text-center mb-12 sm:mb-14 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400">All-In-One Ecosystem</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mt-2 mb-3 sm:mb-4">Everything You Need to Crack It.</h2>
            <p className="text-zinc-400 text-sm sm:text-lg">No more hunting for scattered telegram PDFs. Everything is organized unit-wise.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Main Digital Notes Card */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="md:col-span-2 rounded-[2rem] border border-white/10 bg-zinc-900/30 p-6 sm:p-8 md:p-10 hover:bg-zinc-900/60 hover:border-indigo-500/30 transition-all group overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full group-hover:bg-indigo-500/20 transition-colors" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5 sm:mb-6 group-hover:scale-110 transition-all">
                    <Library className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className="text-xl sm:text-3xl font-black mb-3 text-white">Structured Digital Notes</h3>
                  <p className="text-zinc-400 leading-relaxed max-w-xl text-sm sm:text-lg">
                    Multi-page, color-coded notes with highlighted GATE pro-tips, truth tables, and comparison charts for quick visual retention.
                  </p>
                </div>
                <Link href="/notes?view=digital" className="mt-7 sm:mt-8 inline-flex items-center gap-2 text-indigo-400 font-black tracking-wide hover:text-indigo-300 bg-white/5 w-max px-5 sm:px-6 py-3 rounded-xl border border-white/10 hover:border-indigo-500/40 transition-colors text-xs sm:text-sm">
                  Open Digital Library <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Question Bank Card */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-[2rem] border border-white/10 bg-zinc-900/30 p-6 sm:p-8 md:p-10 hover:bg-zinc-900/60 hover:border-emerald-500/30 transition-all group overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full group-hover:bg-emerald-500/20 transition-colors" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 sm:mb-6 group-hover:scale-110 transition-all">
                    <Trophy className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black mb-3 text-white">Topic-Wise PYQs</h3>
                  <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                    Practice Easy, Moderate, and Hard GATE & NET questions with step-by-step logical explanations.
                  </p>
                </div>
                <Link href="/practice" className="mt-7 sm:mt-8 inline-flex items-center gap-2 text-emerald-400 font-bold hover:text-emerald-300 text-sm">
                  Start Practicing <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Handwritten PDFs Card */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-[2rem] border border-white/10 bg-zinc-900/30 p-6 sm:p-8 md:p-10 hover:bg-zinc-900/60 hover:border-amber-500/30 transition-all group overflow-hidden relative"
            >
               <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full group-hover:bg-amber-500/20 transition-colors" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5 sm:mb-6 group-hover:scale-110 transition-all">
                    <FileText className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black mb-3 text-white">Handwritten PDFs</h3>
                  <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                    Prefer reading from notebooks? Download my clean, scanned handwritten notes directly via Drive.
                  </p>
                </div>
                <Link href="/notes?view=handwritten" className="mt-7 sm:mt-8 inline-flex items-center gap-2 text-amber-400 font-bold hover:text-amber-300 text-sm">
                  Download PDFs <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Apps Hub Card (Spans 2 cols) */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
              className="md:col-span-2 rounded-[2rem] border border-white/10 bg-zinc-900/30 p-6 sm:p-8 md:p-10 hover:bg-zinc-900/60 hover:border-purple-500/30 transition-all group overflow-hidden relative flex flex-col sm:flex-row gap-6 sm:gap-8 items-center"
            >
              <div className="relative z-10 flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
                  <div className="px-3 py-1 rounded-md bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-widest border border-purple-500/30">Developer Workspace</div>
                </div>
                <h3 className="text-xl sm:text-3xl font-black mb-3 text-white">Flutter Applications Hub</h3>
                <p className="text-zinc-400 leading-relaxed text-sm sm:text-lg mb-6">
                  Along with teaching CS, I build production-ready mobile applications. Test my apps, check release notes, and download APKs directly.
                </p>
                <Link href="/apps" className="inline-flex items-center gap-2 bg-white text-black font-bold px-5 sm:px-6 py-3 rounded-xl hover:bg-zinc-200 transition-colors text-xs sm:text-sm">
                  Explore Apps Hub <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </div>
              <div className="relative z-10 w-full sm:w-1/3 flex justify-center">
                 <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-zinc-800/80 border border-white/10 flex items-center justify-center text-purple-400 shadow-[0_0_40px_rgba(168,85,247,0.2)] group-hover:scale-105 transition-transform duration-500">
                    <Smartphone className="w-12 h-12 sm:w-14 sm:h-14" />
                 </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* --- INTEGRATED FAQ SECTION --- */}
        <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-20 sm:pb-24 z-10 relative scroll-mt-20 pointer-events-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5 }} className="text-center mb-10 sm:mb-12">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-zinc-900 flex items-center justify-center mx-auto mb-4 sm:mb-5 border border-white/10 text-indigo-400 shadow-xl">
              <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3">Student FAQs</h2>
            <p className="text-zinc-400 text-sm sm:text-lg max-w-lg mx-auto">Common questions about notes, mock tests, and platform usage.</p>
          </motion.div>

          <div className="space-y-3.5 sm:space-y-4">
            {faqData.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true, amount: 0.2 }} 
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`rounded-2xl sm:rounded-[1.5rem] border transition-all duration-300 overflow-hidden ${isOpen ? "border-indigo-500/40 bg-zinc-900/80 shadow-[0_10px_30px_rgba(99,102,241,0.1)]" : "border-white/5 bg-zinc-900/30 hover:bg-zinc-900/60 hover:border-white/10"}`}
                >
                  <button onClick={() => toggleFaq(index)} className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left font-bold text-sm sm:text-base md:text-lg focus:outline-none">
                    <span className={`${isOpen ? "text-indigo-400" : "text-white"} transition-colors pr-4`}>{faq.question}</span>
                    <div className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-zinc-400 transition-transform duration-300 ${isOpen ? "rotate-180 bg-indigo-500/20 text-indigo-400 border-indigo-500/30" : ""}`}>
                        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
                        <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-zinc-400 text-xs sm:text-base leading-relaxed">{faq.answer}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* --- FOOTER (Original Version Preserved) --- */}
        <footer className="border-t border-white/10 bg-zinc-950/80 pt-16 pb-8 relative z-40 pointer-events-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.4, delay: 0.1 }} 
             className="space-y-4">
              <div className="flex items-center gap-2 font-bold tracking-wider text-lg">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-zinc-900 border border-white/10 shadow-lg">
                  <Image 
                    src="/logo.png" 
                    alt="Logo" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <span className="font-bold text-pink-50 underline">VOICE NOTE</span>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">Designing and building high-performance 
                digital experiences. Next.js, Flutter, and Supabase stack.</p>
              <div className="flex items-center gap-4 pt-2">
                <Link href="#" className="w-9 h-9 rounded-full bg-white/5 border
                 border-white/10 flex items-center justify-center text-zinc-400
                  hover:text-white hover:bg-white/10 transition-all"><Code className="w-4 h-4"/></Link>
                <Link href="#" className="w-9 h-9 rounded-full bg-white/5 border
                 border-white/10 flex items-center justify-center text-zinc-400 
                 hover:text-[#1DA1F2] hover:bg-white/10 transition-all"><MessageCircle className="w-4 h-4"/></Link>
                <Link href="#" className="w-9 h-9 rounded-full bg-white/5 border
                 border-white/10 flex items-center justify-center text-zinc-400 hover:text-[#0A66C2]
                  hover:bg-white/10 transition-all"><Briefcase className="w-4 h-4"/></Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.4, delay: 0.2 }} 
             className="space-y-4">
              <h4 className="text-white font-semibold flex items-center gap-2"><ArrowRight className="w-4 h-4
               text-indigo-400"/> Quick Links</h4>
              <ul className="space-y-2.5 text-sm text-zinc-400">
                <li><Link href="/" className="hover:text-white transition-colors">Home Page</Link></li>
                <li><Link href="/apps" className="hover:text-white transition-colors">Mobile Applications</Link></li>
                <li><Link href="/notes" className="hover:text-white transition-colors">Study Resources</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.5, delay: 0.3 }} 
            className="space-y-4">
              <h4 className="text-white font-semibold flex items-center gap-2">

<Map className="w-4 h-4 text-emerald-400"/>
Sitemap</h4>
              <ul className="space-y-2.5 text-sm text-zinc-400">
                <li><Link href="/register" className="hover:text-white transition-colors">Create Account</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">User Sign In</Link></li>
                <li><Link href="/forgot-password" className="hover:text-white transition-colors">Reset Password</Link></li>
                <li><Link href="/admin-login" className="hover:text-white transition-colors flex items-center gap-2">Admin Gateway <ShieldAlert className="w-3 h-3 text-red-400"/></Link></li>
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.3, delay: 0.2 }} 
            className="space-y-4">
              <h4 className="text-white font-semibold flex items-center gap-2"><HelpCircle className="w-4 h-4 text-purple-400"/> Support</h4>
              <ul className="space-y-2.5 text-sm text-zinc-400">
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Me</Link></li>
                <li><Link href="#faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </motion.div>
          </div>
          
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} 
          viewport={{ once: true, amount: 0.1 }} transition={{ duration: 1, delay: 0.2 }}
           className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-white/10 flex 
           flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <p>© {new Date().getFullYear()} <span className="font-bold
             text-blue-200 underline">Voice Note</span> Platform. All rights reserved.</p>
            <p className="flex items-center gap-1">Developed by <span className="font-bold
             text-blue-200 underline">VISHAL</span> With AI ❤️</p>
            <p className="flex items-center gap-1">Built with <span className="font-bold
             text-blue-200 underline">Next.js 15, Tailwind v4,</span> and <span className="font-bold
              text-blue-200 underline">Supabase.</span></p>
          </motion.div>
        </footer>
      </div>
    </div>
  );
}