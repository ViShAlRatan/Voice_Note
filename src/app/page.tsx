"use client";

import { useEffect, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import SplashScreen from "@/components/ui/SplashScreen";

// Import all modular components
import Navbar from "@/components/home/Navbar";
import HeroSection from "@/components/home/HeroSection";
import StudyWorkflow from "@/components/home/StudyWorkflow";
import YoutubeLectures from "@/components/home/YoutubeLectures";
import ActiveModules from "@/components/home/ActiveModules";
import EcosystemGrid from "@/components/home/EcosystemGrid";
import FAQSection from "@/components/home/FAQSection";
import Footer from "@/components/home/Footer";
import SearchModal from "@/components/modals/SearchModal";

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

export default function HomePage() {
  // 1. Global Auth States
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>("user");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 2. Global UI States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [navHidden, setNavHidden] = useState(false);

  // 3. Splash Screen States
  const [isMounted, setIsMounted] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [isSplashDone, setIsSplashDone] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  // Scroll detection to hide/show navbar
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setNavHidden(latest > previous && latest > 150);
  });

  // Init Auth & Splash
  useEffect(() => {
    setIsMounted(true);
    
    // Splash Logic
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    if (!hasSeenSplash) {
      setIsFirstVisit(true);
      setShowSplash(true);
      sessionStorage.setItem("hasSeenSplash", "true");
      setTimeout(() => { setShowSplash(false); setIsSplashDone(true); }, 3800);
    } else {
      setIsFirstVisit(false);
      setShowSplash(false);
      setIsSplashDone(true);
    }

    // Auth Logic
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
  }, []);

  if (!isMounted) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-[#050508] text-white selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-x-hidden font-sans">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:48px_48px] sm:bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* Splash Screen Orchestrator */}
      <SplashScreen isVisible={showSplash} />

      <div className={`w-full ${!isFirstVisit ? "opacity-100" : `transition-opacity duration-1000 ease-in-out ${isSplashDone ? "opacity-100" : "opacity-0 h-screen overflow-hidden pointer-events-none"}`}`}>
        
        {/* Global Modals */}
        <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} searchData={searchData} />

        {/* Global Navbar */}
        <Navbar user={user} role={role} profile={profile} loading={loading} navHidden={navHidden} onOpenSearch={() => setIsSearchOpen(true)} />

        {/* --- MODULAR PAGE CONTENT --- */}
        <main>
          <HeroSection user={user} role={role} />
          <StudyWorkflow />
          <YoutubeLectures isAdmin={role === "admin"} />
          <ActiveModules />
          <EcosystemGrid />
          <FAQSection />
        </main>

        <Footer />
      </div>
    </div>
  );
}