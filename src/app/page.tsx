"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, Sparkles, Download, BookOpen, ShieldCheck, Loader2, 
  Search, Home, HelpCircle, Map, Code, MessageCircle, Briefcase, 
  Menu, X, ChevronDown, Smartphone, Heart, ShieldAlert, GraduationCap, 
  Library, Trophy, FileText, ChevronRight
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SplashScreen from "@/components/ui/SplashScreen";

// --- FAQ DATA ---
const faqData = [
  {
    question: "What is Voice Note and how can it help me clear UGC NET/GATE?",
    answer: "Voice Note is a premium digital workspace dedicated to Computer Science engineering students. It provides high-yield digital notes, handwritten PDFs, and chapter-wise question banks specifically designed for UGC NET and GATE preparation."
  },
  {
    question: "Are the study materials and notes completely free?",
    answer: "Yes! All structured digital notes, handwritten PDF manuals, and question banks in the Knowledge Base are absolutely free for registered users."
  },
  {
    question: "How do I access the Flutter applications?",
    answer: "You can navigate to the Apps Hub section. Each application comes with release notes, screenshots, and direct production APK download links for testing."
  },
  {
    question: "Can I track my mock test performance?",
    answer: "Yes, registered users can access the 'My Performance' dashboard to track their mock test scores, view historical progress, and analyze their strengths and weaknesses."
  }
];

// --- MOCK SEARCH DATA ---
const searchData = [
  { title: "UGC NET Computer Science Notes", type: "Page", link: "/notes" },
  { title: "Paper 1 General Aptitude", type: "Note", link: "/notes?paper=paper1" },
  { title: "Question Bank & Mock Tests", type: "Page", link: "/practice" },
  { title: "Flutter Apps Hub", type: "Page", link: "/apps" },
  { title: "Engineering Tech Blog", type: "Page", link: "/blog" },
  { title: "User Registration", type: "Action", link: "/register" },
  { title: "Contact Vishal", type: "Page", link: "/contact" }
];

export default function HomePage() {
  const router = useRouter();

  // --- AUTH STATES ---
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>("user");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- UI STATES ---
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [navHidden, setNavHidden] = useState(false);

  // 🔥 MASTER SPLASH STATES (No Clash) 🔥
  const [isMounted, setIsMounted] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [isSplashDone, setIsSplashDone] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  // SEARCH STATES
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const words = ["UGC NET CS Notes.", "GATE Study Materials.", "Interactive Question Banks."];
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const typingSpeed = 80;

  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 500], [0, 250]); 
  const imageY = useTransform(scrollY, [0, 500], [0, -80]); 
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]); 

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setNavHidden(true);
    } else {
      setNavHidden(false);
    }
  });

  // CMD+K SHORTCUT
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSearchOpen(false);
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
      // First Time Visit
      setIsFirstVisit(true);
      setShowSplash(true);
      sessionStorage.setItem("hasSeenSplash", "true");

      const timer = setTimeout(() => {
        setShowSplash(false);
        setIsSplashDone(true);
      }, 3800); 
      return () => clearTimeout(timer);
    } else {
      // Returning Visit
      setIsFirstVisit(false);
      setShowSplash(false);
      setIsSplashDone(true);
    }
  }, []);

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient();
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
    fetchUser();

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
        setTimeout(() => setIsDeleting(true), 1500);
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

  useEffect(() => {
    async function trackVisitor() {
      const supabase = createClient();
      const hasVisited = localStorage.getItem('has_visited');
      if (!hasVisited) {
        await supabase.rpc('increment_visitor'); 
        localStorage.setItem('has_visited', 'true');
      }
    }
    trackVisitor();
  }, []);

  const filteredSearch = searchData.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

  // 🚀 JAB TAK PAGE READY NA HO, BLACK SCREEN DIKHAO (Flicker Preventer)
  if (!isMounted) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden font-sans">

      {/* 🚀 SPLASH SCREEN CONTROLLED BY HOME PAGE 🚀 */}
      <SplashScreen isVisible={showSplash} />
      
      {/* 🚀 MODERN TECH GRID BACKGROUND 🚀 */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* MOUSE GLOW (INDIGO) */}
      <div 
        className="pointer-events-none fixed inset-0 z-40 transition-opacity duration-300 hidden md:block mix-blend-screen"
        style={{ background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99,102,241,0.08), transparent 40%)` }}
      />

      {/* 🔥 MAIN CONTENT WRAPPER 🔥 */}
      <div 
        className={`w-full ${
          !isFirstVisit 
            ? "opacity-100" // Returning users: Instant Show
            : `transition-opacity duration-1000 ease-in-out ${isSplashDone ? "opacity-100" : "opacity-0 h-screen overflow-hidden pointer-events-none"}`
        }`}
      >
        {/* SEARCH COMMAND PALETTE MODAL */}
        <AnimatePresence>
          {isSearchOpen && (
            <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                className="absolute inset-0 bg-black/80 backdrop-blur-md" 
                onClick={() => setIsSearchOpen(false)} 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: -20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }} 
                className="relative w-full max-w-2xl bg-zinc-950/90 border border-indigo-500/30 rounded-3xl shadow-[0_0_80px_rgba(99,102,241,0.15)] overflow-hidden z-10 flex flex-col backdrop-blur-xl pointer-events-auto"
              >
                <div className="flex items-center px-4 border-b border-white/10 bg-white/5">
                  <Search className="w-5 h-5 text-indigo-400" />
                  <input 
                    type="text" autoFocus placeholder="Search UGC NET topics, notes, apps... (Press Esc to close)" 
                    className="w-full bg-transparent border-none px-4 py-5 focus:outline-none text-base text-white placeholder:text-zinc-500 font-medium" 
                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} 
                  />
                  <button onClick={() => setIsSearchOpen(false)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <X className="w-5 h-5 text-zinc-400 hover:text-white" />
                  </button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto p-3">
                  {filteredSearch.length === 0 ? (
                    <p className="text-center py-10 text-sm text-zinc-500 font-medium">No results found for "{searchQuery}"</p>
                  ) : (
                    filteredSearch.map((item, index) => (
                      <button 
                        key={index} onClick={() => { setIsSearchOpen(false); router.push(item.link); }}
                        className="w-full flex items-center justify-between text-left px-4 py-3 rounded-xl hover:bg-indigo-500/10 hover:shadow-inner transition-all text-zinc-300 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-zinc-900 border border-white/5 group-hover:border-indigo-500/30 group-hover:text-indigo-400 transition-colors">
                            {item.type === "Page" ? <BookOpen className="w-4 h-4"/> : item.type === "App" ? <Smartphone className="w-4 h-4"/> : <FileText className="w-4 h-4"/>}
                          </div>
                          <span className="font-semibold text-white group-hover:text-indigo-300 transition-colors">{item.title}</span>
                        </div>
                        <span className="text-xs px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-zinc-400 font-medium group-hover:border-indigo-500/30 group-hover:text-indigo-300">{item.type}</span>
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
          className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-2xl pointer-events-auto"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 font-bold tracking-wider text-xl">
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-zinc-900 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <Image src="/logo.png" alt="Logo" fill className="object-cover" />
              </div>
              <span className="font-black bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent underline">VOICE NOTE</span>
            </div>

            <nav className="hidden lg:flex items-center gap-1 bg-white/5 p-1.5 rounded-full border border-white/10 shadow-inner">
              <Link href="/" className="px-5 py-2 rounded-full text-sm font-bold text-white bg-white/10 shadow-sm flex items-center gap-2"><Home className="w-4 h-4"/> Home</Link>
              <Link href="/notes" className="px-5 py-2 rounded-full text-sm font-semibold text-zinc-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all flex items-center gap-2"><GraduationCap className="w-4 h-4"/> Notes</Link>
              <Link href="/apps" className="px-5 py-2 rounded-full text-sm font-semibold text-zinc-400 hover:text-white hover:bg-white/10 transition-all">Apps</Link>
              <Link href="/blog" className="px-5 py-2 rounded-full text-sm font-semibold text-zinc-400 hover:text-white hover:bg-white/10 transition-all">Blog</Link>
            </nav>

            <div className="flex items-center gap-3 md:gap-4">
              <div className="hidden sm:flex items-center gap-2 pr-2">
                <button 
                  onClick={() => setIsSearchOpen(true)} 
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-white/10 text-xs font-semibold text-zinc-400 hover:text-white hover:border-indigo-500/50 transition-all shadow-inner"
                >
                  <Search className="w-3.5 h-3.5" /> <span className="hidden md:inline">Search...</span> <kbd className="hidden md:inline font-sans px-1.5 py-0.5 bg-white/10 rounded text-[10px] ml-2">⌘K</kbd>
                </button>
              </div>

              {loading ? (
                <Loader2 className="w-5 h-5 text-zinc-500 animate-spin" />
              ) : user ? (
                <Link href={role === "admin" ? "/admin" : "/dashboard"} 
                className="group relative w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-indigo-500 to-purple-500 hover:scale-105 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] flex-shrink-0">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-black bg-zinc-900">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-indigo-600 flex items-center justify-center font-black text-sm text-white uppercase">
                        {profile?.full_name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                </Link>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/login"><Button variant="ghost" className="text-sm text-zinc-300 hover:text-white hover:bg-white/10 h-10 rounded-xl font-bold">Log In</Button></Link>
                  <Link href="/register"><Button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:scale-105 transition-transform text-sm font-bold rounded-xl px-6 h-10 shadow-lg shadow-indigo-500/25 border border-indigo-400/50">Start Free</Button></Link>
                </div>
              )}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-zinc-300 hover:text-white bg-zinc-900 border border-white/10">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* MOBILE MENU */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} 
              className="lg:hidden border-b border-white/10 bg-zinc-950/95 backdrop-blur-3xl px-6 pt-6 pb-10 space-y-4 shadow-2xl overflow-hidden">
                <nav className="flex flex-col space-y-2 text-base font-semibold text-zinc-300">
                  <Link href="/portfolio" className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 text-indigo-400 transition-all mb-2">
                    <Heart className="w-4 h-4 animate-pulse" /> View Portfolio
                  </Link>
                  <button onClick={() => { setIsSearchOpen(true); setMobileMenuOpen(false); }} className="flex items-center gap-3 text-white px-4 py-3 rounded-xl bg-zinc-900 border border-white/5"><Search className="w-4 h-4 text-indigo-400"/> Search Platform</button>
                  <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-white px-4 py-3 rounded-xl hover:bg-white/5"><Home className="w-4 h-4 text-indigo-400"/> Home</Link>
                  <Link href="/notes" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-indigo-300 flex items-center gap-3"><GraduationCap className="w-4 h-4"/> Premium Study Notes</Link>
                  <Link href="/apps" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-3"><Smartphone className="w-4 h-4"/> Flutter Apps</Link>
                  <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-3"><Sparkles className="w-4 h-4"/> Blog</Link>
                  <Link href="#faq" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-3"><HelpCircle className="w-4 h-4"/> FAQ</Link>
                </nav>
                <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
                  {!user && (
                    <>
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full border-white/10 bg-zinc-900 text-white h-12 rounded-xl font-bold">Log In</Button></Link>
                      <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white h-12 rounded-xl font-bold border border-indigo-400/50 shadow-lg shadow-indigo-500/20">Create Free Account</Button></Link>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>

        {/* --- PREMIUM HERO SECTION --- */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-6 pt-32 pb-20 z-10 pointer-events-auto">
          
          {/* Glow Effects (Indigo/Purple) */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[60vw] h-[40vh] bg-indigo-500/20 blur-[120px] rounded-[100%] pointer-events-none mix-blend-screen" />
          <div className="absolute bottom-0 left-0 w-[40vw] h-[30vh] bg-purple-500/10 blur-[100px] rounded-[100%] pointer-events-none mix-blend-screen" />
          
          <motion.div style={{ y: imageY }} className="relative z-10 flex flex-col items-center text-center w-full max-w-5xl">
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} 
              className="relative flex items-center justify-center mb-10"
            >
              {/* Rotating Glow Ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-400 to-blue-500 blur-md opacity-50 animate-pulse" />
              <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-black overflow-hidden bg-zinc-900 z-10">
                <img src="/dev.jpg" alt="Vishal Profile" className="object-cover w-full h-full scale-105" />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-3 bg-zinc-900 border border-indigo-500/40 text-indigo-400 text-[10px] md:text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-xl z-20 flex items-center gap-1.5 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
               VISHAL SHARMA
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="inline-flex items-center gap-2 rounded-full bg-white/5 px-5 py-2 text-sm text-zinc-300 border border-white/10 mb-8 backdrop-blur-md shadow-xl hover:bg-white/10 transition-colors cursor-default">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span>Structured Notes for <strong className="text-white">UGC NET & GATE</strong></span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] mb-6">
              Master CS Exams <br className="hidden md:block"/>
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-blue-400 bg-clip-text text-transparent">
                With Precision.
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="text-zinc-400 text-lg md:text-2xl max-w-3xl mb-12 font-medium leading-relaxed">
              Stop wandering. Start learning. Access a highly organized digital library of <span className="text-white">Topic-wise Notes, Handwritten PDFs,</span> and <span className="text-white">Mock Tests.</span>
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="flex flex-col sm:flex-row items-center gap-5 w-full justify-center">
              <Link href="/notes" className="w-full sm:w-auto group">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl h-14 px-10 font-black shadow-[0_0_40px_rgba(99,102,241,0.3)] transition-all group-hover:scale-105 group-hover:shadow-[0_0_60px_rgba(99,102,241,0.4)] text-lg border border-indigo-400/50">
                  Explore Knowledge Base <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href={user ? (role === "admin" ? "/admin" : "/dashboard") : "/register"} className="w-full sm:w-auto group">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-2xl border-white/10 bg-zinc-900/80 hover:bg-white/10 h-14 px-10 text-white backdrop-blur-xl font-bold text-lg transition-all group-hover:scale-105">
                  {user ? "Go to Dashboard" : "Join for Free"}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* --- FLOATING STATS BANNER --- */}
        <section className="relative z-30 -mt-10 px-4 sm:px-6 max-w-5xl mx-auto pointer-events-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 p-4 rounded-[2rem] bg-zinc-900/60 border border-white/10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="text-center p-4 rounded-2xl bg-white/5">
              <h4 className="text-3xl md:text-4xl font-black text-white">10+</h4>
              <p className="text-[10px] md:text-xs text-zinc-400 font-bold uppercase tracking-widest mt-2">CS Units</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-white/5">
              <h4 className="text-3xl md:text-4xl font-black text-indigo-400">PDFs</h4>
              <p className="text-[10px] md:text-xs text-zinc-400 font-bold uppercase tracking-widest mt-2">Handwritten</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-white/5">
              <h4 className="text-3xl md:text-4xl font-black text-purple-400">MCQs</h4>
              <p className="text-[10px] md:text-xs text-zinc-400 font-bold uppercase tracking-widest mt-2">Questions</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-indigo-500/20">
              <h4 className="text-3xl md:text-4xl font-black text-white">100%</h4>
              <p className="text-[10px] md:text-xs text-indigo-400 font-bold uppercase tracking-widest mt-2">Free Access</p>
            </div>
          </motion.div>
        </section>

        {/* --- MODERN BENTO GRID --- */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24 z-10 relative pointer-events-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black mb-6">Built for Excellence.</h2>
            <p className="text-zinc-400 text-lg">Stop relying on scattered PDFs. I have unified the entire Computer Science syllabus into a single, high-performance platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            
            {/* Main Digital Notes Card */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="md:col-span-2 rounded-[2rem] border border-white/5 bg-zinc-900/30 p-8 md:p-10 hover:bg-zinc-900/60 transition-all group overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full group-hover:bg-indigo-500/20 transition-colors" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center text-indigo-400 mb-8 group-hover:border-indigo-500/50 group-hover:scale-110 transition-all shadow-lg">
                    <Library className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-black mb-4 text-white">The Digital Library</h3>
                  <p className="text-zinc-400 leading-relaxed max-w-lg text-lg">Read GeeksforGeeks style structured notes. Every unit is broken down into easily digestible chapters, theorems, and visual formulas for Paper 1 and CS Paper 2.</p>
                </div>
                <Link href="/notes?view=digital" className="mt-10 inline-flex items-center gap-2 text-indigo-400 font-black tracking-wide hover:text-indigo-300 bg-white/5 w-max px-6 py-3 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-colors">
                  Explore Digital Notes <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Question Bank Card */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-[2rem] border border-white/5 bg-zinc-900/30 p-8 md:p-10 hover:bg-zinc-900/60 transition-all group overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full group-hover:bg-blue-500/20 transition-colors" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center text-blue-400 mb-8 group-hover:border-blue-500/50 group-hover:scale-110 transition-all shadow-lg">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black mb-4 text-white">Live Mock Tests</h3>
                  <p className="text-zinc-400 text-base leading-relaxed">Practice chapter-wise MCQs. Identify weak spots with detailed explanations.</p>
                </div>
                <Link href="/practice" className="mt-8 inline-flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300">
                  Start Practicing <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Handwritten PDFs Card */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-[2rem] border border-white/5 bg-zinc-900/30 p-8 md:p-10 hover:bg-zinc-900/60 transition-all group overflow-hidden relative"
            >
               <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full group-hover:bg-purple-500/20 transition-colors" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center text-purple-400 mb-8 group-hover:border-purple-500/50 group-hover:scale-110 transition-all shadow-lg">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black mb-4 text-white">Handwritten PDFs</h3>
                  <p className="text-zinc-400 text-base leading-relaxed">Download my personal, high-quality scanned notebooks for quick revision.</p>
                </div>
                <Link href="/notes?view=handwritten" className="mt-8 inline-flex items-center gap-2 text-purple-400 font-bold hover:text-purple-300">
                  Download Books <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Apps Hub Card (Spans 2 cols) */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
              className="md:col-span-2 rounded-[2rem] border border-white/5 bg-zinc-900/30 p-8 md:p-10 hover:bg-zinc-900/60 transition-all group overflow-hidden relative flex flex-col sm:flex-row gap-8 items-center"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="px-3 py-1 rounded-md bg-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest border border-indigo-500/30">Developer Hub</div>
                </div>
                <h3 className="text-3xl font-black mb-4 text-white">Flutter Architecture.</h3>
                <p className="text-zinc-400 leading-relaxed text-lg mb-8">Beyond exam prep, I engineer scalable cross-platform apps. Explore my real-world projects, check the UI flows, and download production APKs directly.</p>
                <Link href="/apps" className="inline-flex items-center gap-2 bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-zinc-200 transition-colors">
                  Explore App Portfolio <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="relative z-10 w-full sm:w-1/3 flex justify-center">
                 <div className="w-40 h-40 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-indigo-400 shadow-[0_0_40px_rgba(99,102,241,0.2)] group-hover:scale-105 transition-transform duration-500">
                    <Smartphone className="w-16 h-16" />
                 </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* --- INTEGRATED FAQ SECTION --- */}
        <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-24 z-10 relative scroll-mt-20 pointer-events-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5 }} className="text-center mb-12">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center mx-auto mb-6 border border-white/10 text-indigo-400 shadow-xl">
              <HelpCircle className="w-7 h-7" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Got Questions?</h2>
            <p className="text-zinc-400 text-lg max-w-lg mx-auto">Everything you need to know about the study materials and platform access.</p>
          </motion.div>

          <div className="space-y-4">
            {faqData.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`rounded-[1.5rem] border transition-all duration-300 overflow-hidden ${isOpen ? "border-indigo-500/40 bg-zinc-900/80 shadow-[0_10px_30px_rgba(99,102,241,0.1)]" : "border-white/5 bg-zinc-900/30 hover:bg-zinc-900/60 hover:border-white/10"}`}
                >
                  <button onClick={() => toggleFaq(index)} className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-base md:text-lg focus:outline-none">
                    <span className={`${isOpen ? "text-indigo-400" : "text-white"} transition-colors pr-4`}>{faq.question}</span>
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-zinc-400 transition-transform duration-300 ${isOpen ? "rotate-180 bg-indigo-500/20 text-indigo-400 border-indigo-500/30" : ""}`}>
                        <ChevronDown className="w-5 h-5" /></div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
                        <div className="px-6 pb-6 text-zinc-400 text-sm md:text-base leading-relaxed">{faq.answer}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* --- FOOTER (Original Version Restored) --- */}
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
                <Map className="w-4 h-4 text-emerald-400"/> Sitemap</h4>
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

// Ensure you replace this entire code!