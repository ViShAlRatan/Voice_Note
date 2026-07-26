"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, Sparkles, Download, BookOpen, ShieldCheck, Loader2, 
  LayoutDashboard, ShieldAlert, Search, Moon, Sun, Home, 
  HelpCircle, Map, Code, MessageCircle, Briefcase, Menu, X, ChevronDown, Smartphone,
  Heart
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Bebas_Neue } from "next/font/google";
import Image from "next/image";
import SplashScreen from "@/components/ui/SplashScreen";



// --- FAQ DATA ---
const faqData = [
  {
    question: "What is Voice Note and what can I find here?",
    answer: "Voice Note is my personal engineering workspace where I regularly publish high-performance Flutter applications, deeply researched computer science & database study notes, and technical engineering blogs."
  },
  {
    question: "How do I download and test the Flutter applications?",
    answer: "You can navigate to the Apps section. Each application comes with release notes, technical specifications, screenshots, and direct production APK download links for testing."
  },
  {
    question: "Why do I need to confirm my email address during signup?",
    answer: "For security and to prevent spam bots, email confirmation is required. Once you register, a confirmation link is sent to your inbox. Click it to activate your account and gain full access."
  },
  {
    question: "What should I do if I forget my password?",
    answer: "Simply go to the Login page, click on the 'Forgot password?' link, enter your registered email address, and you'll receive a secure password reset link instantly."
  },
  {
    question: "Are the study notes and database manuals free to access?",
    answer: "Yes! All computer science manuals, relational algebra guides, and engineering notes uploaded in the Knowledge Base are completely free for registered users."
  }
];

// --- MOCK SEARCH DATA ---
const searchData = [
  { title: "Flutter Apps Hub", type: "Page", link: "/apps" },
  { title: "Semester Notes & Manuals", type: "Page", link: "/notes" },
  { title: "Engineering Tech Blog", type: "Page", link: "/blog" },
  { title: "User Registration", type: "Action", link: "/register" },
  { title: "Contact Me", type: "Page", link: "/contact" },
  { title: "Relational Algebra Notes", type: "Note", link: "/notes" },
  { title: "TrueBond Chat App", type: "App", link: "/apps" }
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

  //  SEARCH STATES
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const words = ["Flutter Applications.", "Modern UIs."];
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const typingSpeed = 100;

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

  //  CMD+K SHORTCUT
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

  // --- LET'S LEARN TOGETHER CLICK HANDLER ---
  const handleLetsLearnClick = () => {
    if (user) {
      toast.success("Welcome back! Taking you to your dashboard...", {
        icon: <Sparkles className="w-4 h-4 text-purple-400" />,
      });
      router.push(role === "admin" ? "/admin" : "/dashboard");
    } else {
      router.push("/register");
    }
  };

  const filteredSearch = searchData.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-black text-white
     selection:bg-indigo-500/30 selection:text-white relative overflow-hidden">

      <SplashScreen />
      
      {/* MOUSE GLOW */}
      <div 
        className="pointer-events-none fixed inset-0 z-40 transition-opacity
         duration-300 hidden md:block"
        style={{ background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, 
        rgba(99,102,241,0.06), transparent 30%)` }}
      />

      {/*  SEARCH COMMAND PALETTE MODAL */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setIsSearchOpen(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }} 
              className="relative w-full max-w-2xl bg-zinc-950 border
               border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col"
            >
              <div className="flex items-center px-4 border-b border-white/10">
                <Search className="w-5 h-5 text-indigo-400" />
                <input 
                  type="text" autoFocus placeholder="Search apps, notes, 
                  blogs... (Press Esc to close)" 
                  className="w-full bg-transparent border-none px-4 py-5
                   focus:outline-none text-base text-white placeholder:text-zinc-600" 
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} 
                />
                <button onClick={() => setIsSearchOpen(false)} className="p-1 rounded-md
                 hover:bg-zinc-800/50 transition-colors">
                  <X className="w-5 h-5 text-zinc-400 hover:text-white" />
                </button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {filteredSearch.length === 0 ? (
                  <p className="text-center py-10 text-sm
                   text-zinc-500">No results found for "{searchQuery}"</p>
                ) : (
                  filteredSearch.map((item, index) => (
                    <button 
                      key={index} onClick={() => { setIsSearchOpen(false); router.push(item.link); }}
                      className="w-full flex items-center justify-between text-left px-4 py-3 rounded-xl
                       hover:bg-white/5 transition-all text-zinc-300"
                    >
                      <div className="flex items-center gap-3">
                        {item.type === "Page" ? <BookOpen className="w-4 h-4
                         text-emerald-400"/> : item.type === "App" ? <Smartphone className="w-4 h-4
                          text-blue-500"/> : <Search className="w-4 h-4 text-zinc-400"/>}
                        <span className="font-medium text-white">{item.title}</span>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-900 border
                       border-white/10 text-zinc-400">{item.type}</span>
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
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/10
         bg-black/50 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold tracking-wider text-lg">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-zinc-900 border border-white/10 shadow-lg">
  <Image 
    src="/logo.png" 
    alt="Logo" 
    fill 
    className="object-cover"
  />
</div>
            <span className="font-bold underline text-pink-50">VOICE NOTE</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400 font-medium">
            <Link href="/" className="text-white flex items-center gap-1.5"><Home className="w-4 h-4"/> Home</Link>
            <Link href="/apps" className="hover:text-white transition-colors">Apps</Link>
            <Link href="/notes" className="hover:text-white transition-colors">Notes</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact Me</Link>
           
            {/* NAVBAR PORTFOLIO BOX BUTTON */}
            <Link href="/portfolio" className="flex items-center gap-1.5 px-4 py-1.5 
            rounded-2xl border border-purple-500/30 bg-purple-500/20 text-white
             hover:bg-purple-500/30 hover:border-purple-500/60 hover:scale-105
              transition-all shadow-[0_0_15px_rgba(245,158,11,0.1)] font-semibold">
              <Heart className="w-5 h-5 animate-pulse text-pink-400" />
              View Portfolio
            </Link>
          </nav>

          <div className="flex items-center gap-3 md:gap-5">
            <div className="hidden sm:flex items-center gap-2 border-r border-white/10 pr-3">
              {/*  FUNCTIONAL SEARCH BUTTON */}
              <button 
                onClick={() => setIsSearchOpen(true)} 
                className="w-8 h-8 rounded-full flex items-center justify-center
                 text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {loading ? (
              <Loader2 className="w-5 h-5 text-zinc-500 animate-spin" />
            ) : user ? (
              <Link href={role === "admin" ? "/admin" : "/dashboard"} 
              className="group relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border
               border-white/20 overflow-hidden hover:border-indigo-500 transition-all shadow-lg flex-shrink-0">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-indigo-600 flex items-center justify-center 
                  font-bold text-sm text-white uppercase">
                    {profile?.full_name?.charAt(0) || "U"}
                  </div>
                )}
              </Link>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login"><Button variant="ghost" className="text-sm text-zinc-300
                 hover:text-white hover:bg-white/10 h-9 rounded-xl">Log In</Button></Link>
                <Link href="/register"><Button className="bg-white text-black
                 hover:bg-zinc-200 text-sm font-medium rounded-xl px-5 h-9">Register</Button></Link>
              </div>
            )}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden w-9 h-9 rounded-full 
            flex items-center justify-center text-zinc-300 hover:text-white bg-zinc-900 border border-white/10">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -10 }} className="md:hidden border-b border-white/10
           bg-zinc-950/95 backdrop-blur-2xl px-6 pt-6 pb-10 space-y-4 shadow-2xl">
            <nav className="flex flex-col space-y-3 text-base font-medium text-zinc-300">

                 {/* NAVBAR PORTFOLIO BOX BUTTON */}
            <Link href="/portfolio" className="flex items-center gap-1.5 px-4 py-1.5 
            rounded-2xl border border-purple-500/30 bg-purple-500/20 text-white
             hover:bg-purple-500/30 hover:border-purple-500/60 hover:scale-105
              transition-all shadow-[0_0_15px_rgba(245,158,11,0.1)] font-semibold">
              <Heart className="w-5 h-5 animate-pulse text-pink-400" />
             View Portfolio
            </Link>


              {/* Added Search  to Mobile Menu too */}
              <button onClick={() => { setIsSearchOpen(true); setMobileMenuOpen(false); }} 
              className="flex items-center gap-2 text-white py-1.5"><Search className="w-4 h-4
               text-indigo-400"/> Search</button>
                     
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-white py-1.5"><Home className="w-4 h-4 text-indigo-400"/> Home</Link>
              <Link href="/apps" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1.5 transition-colors">Flutter Apps</Link>
              <Link href="/notes" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1.5 transition-colors">Study Notes</Link>
              <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1.5 transition-colors">Tech Blog</Link>
              <Link href="#faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1.5 transition-colors">FAQ</Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1.5 transition-colors">Contact Me</Link>
             
            </nav>
            <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
              {!user && (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-white/10 bg-zinc-900
                   text-white h-10 rounded-xl font-medium">Log In</Button></Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-white text-black hover:bg-zinc-200 h-10 
                  rounded-xl font-medium">Register</Button></Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* --- HERO SECTION (Parallax Fade) --- */}
      <section className="relative h-screen min-h-[700px] flex flex-col items-center 
      justify-center overflow-hidden px-6 pt-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px]
         bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-[140px] 
         pointer-events-none" />
        
        {/* GIANT BACKGROUND TEXT */}
        <motion.div style={{ y: textY, opacity: heroOpacity }} className="absolute inset-0 
        flex items-center justify-center z-0 pointer-events-none overflow-hidden">
          <h1 className="text-[25vw] md:text-[20vw] font-black text-transparent 
          whitespace-nowrap opacity-20 selection:bg-none" style={{ WebkitTextStroke: '3px rgba(255,255,255,0.3)' }}>
            VISHAL
          </h1>
        </motion.div>

        {/* FOREGROUND CONTENT */}
        <motion.div style={{ y: imageY }}
         className="relative z-10 flex flex-col items-center text-center mt-10 w-full max-w-4xl">
          <motion.div initial={{ opacity: 0, scale: 0.5, y: 50 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }}
           transition={{ duration: 0.5, ease: "easeOut" }} className="relative w-40 h-40 md:w-50 md:h-50 rounded-full border-4
            border-blue-300/30 overflow-hidden mb-6 shadow-[0_0_80px_rgba(99,102,241,0.5)]
             bg-zinc-900">
            <img src="/dev.jpg" alt="Profile" className="object-cover w-full h-full scale-105" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4, delay: 0.2 }} className="flex items-center gap-2 rounded-full
           bg-zinc-900/80 px-4 py-1.5 text-xs md:text-sm text-zinc-400 border
            border-zinc-800 mb-6 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
            <span>Let's Learn Together !</span>
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4, delay: 0.3 }} className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            Hi, I'm <span className="text-white">Vishal.</span> <br className="hidden md:block"/>
            <span className="text-zinc-500 text-3xl sm:text-4xl md:text-5xl font-semibold block mt-2">I build <span className="text-indigo-400">{text}</span><span className="animate-pulse text-white">|</span></span>
          </motion.h2>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4, delay: 0.3 }} 
          className="text-zinc-400 text-base md:text-xl max-w-2xl mb-8 font-normal leading-relaxed px-2">
            A passionate Learner turning ideas into high-performance digital products. Explore my apps, notes, and technical deep-dives.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4, delay: 0.3 }} className="flex flex-col sm:flex-row items-center
            gap-4 w-full justify-center max-w-md px-4">
            {loading ? (
              <div className="w-full sm:w-auto h-12 w-32 bg-white/5 animate-pulse rounded-xl"></div>
            ) : user ? (
              <Link href={role === "admin" ? "/admin" : "/dashboard"} className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700
                 text-white rounded-xl h-12 pr-6 pl-2 font-medium shadow-lg shadow-indigo-500/20 
                 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-indigo-400/30
                   bg-indigo-800 shrink-0">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs uppercase font-bold text-white">
                        {profile?.full_name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  {role === "admin" ? "Admin Panel" : "My Dashboard"}
                </Button>
              </Link>
            ) : (
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-white text-black
                 hover:bg-zinc-200 rounded-xl h-12 px-8 font-medium">Explore Platform <ArrowRight className="ml-2 h-4 w-4" />
                 </Button></Link>
            )}
            <Link href="/apps" className="w-full sm:w-auto"><Button size="lg" variant="outline" 
            className="w-full sm:w-auto rounded-xl border-white/10 bg-zinc-950/50
             hover:bg-white/10 h-12 px-8 text-white backdrop-blur-md">Download Apps</Button></Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div style={{ opacity: heroOpacity }} initial={{ opacity: 0 }}
         animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }} 
         className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <span className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest 
          font-mono font-medium">Scroll to explore</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity,
              duration: 1.5, ease: "easeInOut" }} className="w-5 h-9 sm:w-6 sm:h-10 border-2 border-zinc-700 rounded-full flex justify-center p-1"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /></motion.div>
        </motion.div>
      </section>

      {/* --- PLATFORM INTRO TEXT (VIP BOX) --- */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 pb-8 z-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}  
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="rounded-3xl border border-indigo-500/20
           bg-zinc-950/60 backdrop-blur-2xl p-6 md:p-14 shadow-2xl shadow-indigo-500/10 relative
           overflow-hidden text-center"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent
           via-blue-500 to-transparent opacity-70" />
          <h2 className="text-2xl md:text-5xl font-bold bg-gradient-to-r
           from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent mb-6 leading-tight">
            Built with Passion. <br className="hidden md:block" /> Shared with Purpose.
          </h2>
          <div className="space-y-4 text-zinc-400 text-sm md:text-base
           leading-relaxed max-w-3xl mx-auto relative z-10">
            <p>Welcome to my digital workspace! Yeh platform sirf ek website nahi hai, yeh 
              <strong className="text-amber-400 font-medium underline">ek emotion hai.</strong> 
              Main yahan apne banaye hue high-performance <strong>Flutter Apps</strong>, deeply researched 
              <strong>Advance Study Notes</strong>, aur detailed <strong>Tech Blogs</strong> 
              regularly upload karta hu.</p>
            <p>Maine yeh sab bahut dil se bnaya hai. Mera simple sa hai: 
              <strong className="text-amber-500 font-medium underline font-bold">Sath main Phodenge.</strong> 
              Aaiye is journey mein mere sath judiye, sath milkar nayi technologies explore karte hain, Kuch New sikhte hai, aur milkar nayi journey ki shuruat krte hai !</p>
          </div>
          
          <div className="mt-6 flex justify-center relative z-10">
            <Button 
              onClick={handleLetsLearnClick}
              className="bg-blue-500 hover:bg-indigo-700 text-white rounded-xl h-11 px-8 font-medium shadow-lg shadow-indigo-500/30 transition-transform hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              Let's Learn Together <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
          
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px]
           bg-indigo-500/10 blur-[80px] pointer-events-none" />
        </motion.div>
      </section>

      {/* --- FEATURE CARDS --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 z-10 relative grid
       grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-3xl border border-white/10 bg-zinc-950/30 p-6 
          md:p-8 backdrop-blur-xl hover:bg-zinc-900/50 hover:border-indigo-500/30 
          transition-all duration-300 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border
           border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 
           group-hover:scale-110 transition-transform"><Download className="w-6 h-6" /></div>
          <h3 className="text-xl font-semibold mb-3">Flutter Apps Hub</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">Download production-ready APKs, check release notes, view screenshots, and test advanced cross-platform applications directly.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.3, delay: 0.2 }}
          className="rounded-3xl border border-white/10 bg-zinc-950/30 p-6 md:p-8 
          backdrop-blur-xl hover:bg-zinc-900/50 hover:border-emerald-500/30 
          transition-all duration-300 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border
           border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 
           group-hover:scale-110 transition-transform"><BookOpen className="w-6 h-6" /></div>
          <h3 className="text-xl font-semibold mb-3">Knowledge Base</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">Access curated computer science notes,
             database theory manuals, and high-performance engineering documentation for free.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.3, delay: 0.3 }}
          className="rounded-3xl border border-white/10 bg-zinc-950/30 p-6 md:p-8
           backdrop-blur-xl hover:bg-zinc-900/50 hover:border-purple-500/30 transition-all 
           duration-300 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20
           flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 
           transition-transform"><ShieldCheck className="w-6 h-6" /></div>
          <h3 className="text-xl font-semibold mb-3">Secure & Scalable</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">Powered by Next.js 15 App Router, Row Level Security, 
            and PostgreSQL for lightning-fast speeds and enterprise-grade security.</p>
        </motion.div>
      </section>

      {/* --- INTEGRATED FAQ SECTION --- */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-20 z-10 
      relative scroll-mt-20">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.4 }} className="text-center mb-10">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center
           mx-auto mb-4 border border-indigo-500/20 text-indigo-400 shadow-lg 
           shadow-indigo-500/10"><HelpCircle className="w-6 h-6" /></div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r
           from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">Frequently Asked Questions</h2>
          <p className="text-zinc-400 text-sm md:text-base max-w-lg mx-auto">Everything you need to know about the platform, 
            apps, notes, and security features.</p>
        </motion.div>

        <div className="space-y-3">
          {faqData.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <motion.div key={index} initial={{ opacity: 0, x: -20 }} 
              whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} 
              transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`rounded-2xl border transition-all duration-300 
                  overflow-hidden ${isOpen ? "border-indigo-500/40 bg-zinc-950/80 shadow-xl shadow-indigo-500/5" : 
                    "border-white/10 bg-zinc-950/40 hover:bg-zinc-950/60 hover:border-white/20"}`}
              >
                <button onClick={() => toggleFaq(index)} className="w-full px-5 py-4 flex items-center 
                justify-between text-left font-medium text-sm md:text-base focus:outline-none">
                  <span className={`${isOpen ? "text-indigo-300" : "text-white"} 
                  transition-colors pr-4`}>{faq.question}</span>
                  <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center
                     bg-white/5 border border-white/10 text-zinc-400 transition-transform duration-300 
                     ${isOpen ? "rotate-180 bg-indigo-500/20 text-indigo-400 border-indigo-500/30" : ""}`}>
                      <ChevronDown className="w-4 h-4" /></div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                     exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
                      <div className="px-5 pb-5 text-zinc-400 text-xs md:text-sm leading-relaxed border-t
                       border-white/5 pt-3">{faq.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/10 bg-zinc-950/80 pt-16 pb-8 relative z-40">
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
           text-blue-200 underline">VISHAL</span> With ❤️</p>
          <p className="flex items-center gap-1">Built with <span className="font-bold
           text-blue-200 underline">Next.js 15, Tailwind v4,</span> and <span className="font-bold
            text-blue-200 underline">Supabase.</span></p>
        </motion.div>
      </footer>

    </div>
  );
}