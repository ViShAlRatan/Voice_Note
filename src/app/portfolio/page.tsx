'use client'

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion'; // <-- Framer Motion Added
import { Home, Code, MessageCircle, Briefcase, ArrowRight, Map, ShieldAlert, HelpCircle } from 'lucide-react'; // <-- All Footer Icons Added

gsap.registerPlugin(ScrollTrigger);

export default function Portfolio() {
  const container = useRef(null);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQualOpen, setIsQualOpen] = useState(false);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    // Hero Animation 
    tl.to('.hero-title-line', { y: 0, opacity: 1, duration: 1,
         ease: 'power3.out', stagger: 0.15 }, "+=0.2")
      .to('.hero-profile-card', { x: 0, y: 0, opacity: 1, scale: 1,
         duration: 1, ease: 'back.out(1.2)' }, "-=0.8")
      .to('.hero-desc', { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, "-=0.6")
      .to('.hero-stats', { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, "-=0.6");

    // Journey Timeline Animations
    const timelineItems = gsap.utils.toArray('.timeline-item') as HTMLElement[];
    timelineItems.forEach((item) => {
      gsap.fromTo(item.querySelector('.year-badge'), 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
             scrollTrigger: { trigger: item, start: "top 85%", toggleActions: "play none none reverse" }}
      );
      gsap.fromTo(item.querySelector('.timeline-content'),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', 
            delay: 0.1, scrollTrigger: { trigger: item, start: "top 80%",
                 toggleActions: "play none none reverse" }}
      );
    });

    // Vertical line animation
    gsap.fromTo('.progress-line', 
      { height: "0%" },
      { height: "100%", ease: 'none', scrollTrigger: { trigger: '.journey-section',
         start: "top 50%", end: "bottom 80%", scrub: true }}
    );

    // Qualifications Cards Animation
    const qualCards = gsap.utils.toArray('.qual-card') as HTMLElement[];
    qualCards.forEach((card, index) => {
      gsap.fromTo(card, 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, delay: index * 0.1, ease: 'power3.out', 
            scrollTrigger: { trigger: '#qualifications', start: "top 80%", 
                toggleActions: "play none none reverse" }}
      );
    });

    // Project Cards
    const projectCards = gsap.utils.toArray('.project-card') as HTMLElement[];
    projectCards.forEach((card) => {
      gsap.fromTo(card, 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', 
            scrollTrigger: { trigger: card, start: "top 85%",
                 toggleActions: "play none none reverse" }}
      );
    });

    // FAQs
    const faqs = gsap.utils.toArray('.faq-item') as HTMLElement[];
    faqs.forEach((faq) => {
      gsap.fromTo(faq, { y: 20, opacity: 0 }, { y: 0, opacity: 1, 
        duration: 0.5, ease: 'power2.out', scrollTrigger: { trigger: faq,
           start: "top 95%", toggleActions: "play none none reverse" }});
    });

  }, { scope: container });

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  // --- DATA ARRAYS ---
  const journeyData = [
    { year: "Start", title: "Discovering the Passion", 
      
      desc: "Realized how much I love teaching and explaining complex concepts in a simple way. Started sharing my knowledge with students." },
    { year: "Next", title: "Diving into Flutter", 
      desc: "Discovered Flutter and fell in love with mobile app development. Creating beautiful, cross-platform apps became my second obsession." },
    { year: "Grow", title: "Notes & Blogs", 
      desc: "Started compiling my study notes and writing blogs to help out the developer and student community. Everything accessible in one place." },
    { year: "Now", title: "Teacher & Creator", 
      desc: "Today, I balance my time between teaching students, building seamless Flutter apps, and providing free resources to help others grow." }
  ];

  const qualificationsData = [
    { id: "01", type: "Master's Degree", title: "MCA", inst: "Sardar Patel University Mandi (H.P)", year: "2025", score: "8.3 CGPA", color: "from-blue-500 to-blue-300", shadow: "shadow-blue-500/20" },
    { id: "02", type: "Bachelor's Degree", title: "BCA", inst: "College Name", year: "2023", score: "7.89 CGPA", color: "from-teal-500 to-teal-300", shadow: "shadow-teal-500/20" },
    { id: "03", type: "Higher Secondary", title: "12th Standard (Science/PCM)", inst: "Govt Sr. Sec School Bharari", year: "2018", score: "71.2%", color: "from-emerald-500 to-emerald-300", shadow: "shadow-emerald-500/20" },
    { id: "04", type: "High School", title: "10th Standard", inst: "Govt Sr. Sec School Dumehar", year: "2016", score: "78.7%", color: "from-gray-400 to-gray-200", shadow: "shadow-gray-500/20" }
  ];

  const faqData = [
    { q: "Are your study notes free to download?", a: "Most of my blogs and quick reference guides are completely free. However, comprehensive PDF bundles are available as premium downloads." },
    { q: "What specific subjects do your notes cover?", a: "I cover a wide range of topics, from deep dives into Database Theory, Computer Networks, and programming fundamentals." },
    { q: "How can I get 1-on-1 mentorship?", a: "You can send me an email to inquire about my availability for 1-on-1 mentorship sessions." }
  ];

  return (
    <div ref={container} className="relative min-h-screen text-white font-sans overflow-x-hidden
     bg-[#050505]">
      
      {/* Performance Optimized Background */}
      <div className="fixed inset-0 z-[-1] pointer-events-none 
      bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,
      rgba(37,99,235,0.15),rgba(255,255,255,0))]"></div>

      {/* --- Navbar --- */}
      <nav className="fixed w-full top-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b
       border-white/5 transition-all">
        <div className="flex justify-between items-center px-[5%] py-4 md:py-6 
        max-w-7xl mx-auto">
          <Link href="/" className="text-2xl font-bold tracking-tighter z-50 flex 
          items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400
             to-purple-600 flex items-center justify-center text-sm">
                <Home className='w-5 h-5'/></span>
            Home
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#journey" className="hover:text-white transition-colors">Journey</a>
            <a href="#qualifications" className="hover:text-white transition-colors">Qualifications</a>
            <a href="#work" className="hover:text-white transition-colors">Resources</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <a href="mailto:your-email@example.com" className="px-5 py-2.5 bg-white text-black
             hover:bg-gray-200 rounded-full transition-all font-semibold">Email Me</a>
          </div>

          <button className="md:hidden z-[60] relative w-10 h-10 flex flex-col justify-center
           items-center gap-1.5 focus:outline-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <div className={`w-6 h-[2px] bg-white transition-all duration-300 origin-center 
                ${isMenuOpen ? 'rotate-45 translate-y-[8px]' : ''}`}></div>
            <div className={`w-6 h-[2px] bg-white transition-all duration-300 
                ${isMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-6 h-[2px] bg-white transition-all duration-300 origin-center
                 ${isMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`}></div>
          </button>
        </div>

        <div className={`fixed inset-0 w-full h-screen bg-[#0a0a0a] z-[55] flex flex-col 
            items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
             ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="flex flex-col items-center gap-8 text-2xl font-light w-full px-6">
            <a href="#journey" onClick={() => setIsMenuOpen(false)} className="w-full text-center
             py-2 border-b border-white/5 hover:text-blue-400">My Journey</a>
            <a href="#qualifications" onClick={() => setIsMenuOpen(false)} className="w-full 
            text-center py-2 border-b border-white/5 hover:text-blue-400">Qualifications</a>
            <a href="#work" onClick={() => setIsMenuOpen(false)} className="w-full 
            text-center py-2 border-b border-white/5 hover:text-blue-400">Resources & Work</a>
            <a href="#faq" onClick={() => setIsMenuOpen(false)} className="w-full
             text-center py-2 border-b border-white/5 hover:text-blue-400">FAQs</a>
            <a href="mailto:your-vi12909023@gmail.com" onClick={() => setIsMenuOpen(false)}
             className="mt-4 px-10 py-4 bg-white text-black rounded-full text-xl 
             font-medium w-full max-w-xs text-center shadow-lg">Email Me</a>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="min-h-screen flex flex-col justify-center px-[5%] pb-10 pt-32 max-w-7xl 
      mx-auto relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-12 
        w-full">
          
          <div className="flex-1 w-full">
            <div className="overflow-hidden mb-2 md:mb-4">
              <h1 className="hero-title-line text-5xl sm:text-6xl md:text-[8rem] leading-[1.1] 
              font-light tracking-tight translate-y-[100px] opacity-0">Teacher &</h1>
            </div>
            <div className="overflow-hidden mb-6 md:mb-8">
              <h1 className="hero-title-line text-5xl sm:text-6xl md:text-[8rem] leading-[1.1] 
              font-light tracking-tight translate-y-[100px] opacity-0 text-transparent bg-clip-text
               bg-gradient-to-r from-white via-gray-200 to-gray-500">Flutter Dev.</h1>
            </div>
          </div>

          {/* Desktop Profile Card */}
          <div className="hero-profile-card translate-x-[100px] scale-95 opacity-0 hidden md:flex flex-col items-center bg-gradient-to-b from-white/[0.08] to-transparent border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl hover:border-white/20 hover:-translate-y-2 transition-all duration-500 shadow-[0_0_40px_rgba(37,99,235,0.1)] relative w-80 group">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50"></div>
            
            <div className="relative w-40 h-40 mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500
               to-purple-500 animate-spin-slow opacity-50 blur-md group-hover:opacity-100 
               transition-opacity duration-500"></div>
              <div className="relative w-full h-full rounded-full p-[3px] bg-gradient-to-tr
               from-blue-400 to-purple-500">
                <div className="w-full h-full bg-[#0a0a0a] rounded-full overflow-hidden border-4
                 border-[#0a0a0a]">
                  <img src="/dev.jpg" alt="Profile" className="w-full h-full object-cover 
                  transform group-hover:scale-110 transition-transform duration-700" />
                </div>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Vishal Sharma</h3>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full 
            border border-white/5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse 
              shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
              <p className="text-sm text-gray-300 font-medium">Let's Learn ❤️</p>
            </div>
          </div>
        </div>
        
        {/* Mobile Profile Card */}
        <div className="hero-profile-card opacity-0 md:hidden flex items-center 
        justify-between gap-4 bg-gradient-to-r from-white/[0.08] to-transparent border
         border-white/10 p-3 pr-6 rounded-2xl w-full max-w-sm mb-8 mt-2 backdrop-blur-md shadow-lg">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-xl p-[2px] bg-gradient-to-tr
            from-blue-400 to-purple-500">
              <img src="/dev.jpg" alt="Profile" className="w-full h-full rounded-lg
               bg-gray-800 object-cover" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">Vishal Sharma</h3>
              <p className="text-sm font-medium text-blue-400">Let's Learn ❤️</p>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse 
          shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
        </div>

        <p className="hero-desc text-gray-300 text-lg md:text-xl max-w-2xl leading-relaxed 
        translate-y-8 opacity-0">
          I love <span className="font-bold text-fuchsia-300 ">teaching</span> and building beautiful
          <span className="font-bold text-fuchsia-300 "> mobile applications. </span> 
           Explore my website to read my latest blogs, download premium study notes, 
          and check out the Flutter apps I've built.My philosophy is simple:
<span className="font-bold text-fuchsia-300 "> "Let's learn new things </span> and 
<span className="font-bold text-fuchsia-300 "> acquire knowledge </span>
acquire knowledge every single day."I believe that learning never stops.
        </p>
        
        <div className="hero-stats flex flex-wrap gap-4 md:gap-6 mt-10 md:mt-12 translate-y-8 opacity-0">
          <a href="#qualifications" className="px-8 py-4 bg-purple-500 text-shadow-white rounded-2xl 
          font-semibold transition-all hover:scale-105 shadow-lg text-center">
            View Qualifications
          </a>
          <a href="#work" className="px-8 py-4 bg-white/5 border border-white/10
           text-white rounded-2xl font-medium transition-all hover:bg-white/10 flex items-center 
           justify-center">
            Explore My Work
          </a>
        </div>
      </main>

      {/* --- JOURNEY SECTION --- */}
      <section id="journey" className="journey-section relative px-[5%] py-24 md:py-32 
      max-w-5xl mx-auto z-10 border-t border-white/5">
        <div className="mb-20">
          <h2 className="text-4xl md:text-6xl font-light tracking-tight">My Journey (&)<br/>What I Do</h2>
          <p className="text-gray-400 max-w-sm text-lg mt-4">A blend of teaching and coding.
             Here is how I evolved into a Teacher and a mobile app developer.</p>
        </div>

        <div className="relative pl-8 md:pl-0">
          <div className="absolute left-[31px] md:left-1/2 top-0 bottom-0 w-[1px]
           bg-white/10 md:-translate-x-1/2">
            <div className="progress-line w-full bg-gradient-to-b from-blue-500
             to-purple-500 h-0"></div>
          </div>
          <div className="flex flex-col gap-20 md:gap-24">
            {journeyData.map((item, index) => (
              <div key={index} className={`timeline-item flex flex-col md:flex-row 
              items-start relative w-full ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                <div className="year-badge absolute left-0 md:left-1/2 md:-translate-x-1/2
                 bg-[#111] text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-full border
                  border-white/10 text-xs md:text-sm font-semibold z-10 opacity-0 min-w-[65px] 
                  text-center shadow-lg">
                  {item.year}
                </div>
                <div className={`timeline-content w-full md:w-[45%] pl-[80px] md:pl-0 
                    opacity-0 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                  <h3 className="text-2xl md:text-3xl font-medium mb-4 mt-1 md:mt-0">{item.title}</h3>
                  <p className="text-gray-400 text-lg leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- QUALIFICATIONS SECTION --- */}
      <section id="qualifications" className="px-[5%] py-24 md:py-32 bg-[#050505] border-t border-white/5 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          <div className="mb-16 md:mb-20 text-center">
            <p className="text-blue-400 uppercase tracking-widest text-sm font-semibold mb-4">Academics</p>
            <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-6">My Qualifications</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl">A timeline of my academic background and achievements.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {qualificationsData.map((qual, index) => (
              <div key={index} className={`qual-card relative group p-8 rounded-3xl bg-white/[0.02] border
               border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 
               shadow-lg ${qual.shadow}`}>
                <div className="absolute right-6 bottom-2 text-[5rem] font-bold text-white/[0.03] 
                select-none pointer-events-none group-hover:text-white/[0.06] transition-colors">
                    {qual.id}</div>
                
                <div className="flex justify-between items-start mb-6">
                  <div className={`inline-block px-4 py-1.5 rounded-full bg-gradient-to-r ${qual.color}
                   bg-opacity-10 text-white text-xs font-bold uppercase tracking-wider`}>
                    {qual.type}
                  </div>
                  
                  <div className="flex items-center gap-2 bg-[#111] border border-white/10 px-3 py-1 
                  rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
                    <span className="text-yellow-400 font-bold text-sm">{qual.score}</span>
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl font-semibold text-white mb-2">{qual.title}</h3>
                
                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between 
                items-center relative z-10">
                  <p className="text-gray-400 font-medium text-sm md:text-base">{qual.inst}</p>
                  <p className="text-gray-500 font-bold">{qual.year}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* --- RESOURCES & PROJECTS SECTION --- */}
      <section id="work" className="work-section px-[5%] py-24 md:py-32 bg-[#0a0a0a] border-t border-white/5 z-10 relative">
        <div className="max-w-5xl mx-auto mb-16 md:mb-20 text-center md:text-left">
          <p className="text-blue-400 uppercase tracking-widest text-sm font-semibold mb-4">Resources & Work</p>
          <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-6">Study, Learn,<br />and Download</h2>
          <p className="text-gray-400 max-w-xl text-lg md:text-xl">From high-performance Website to easy-to-understand study notes and tutorials.</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <div className="project-card group relative opacity-0 translate-y-12">
            <div className="relative overflow-hidden rounded-2xl bg-gray-900 aspect-video mb-6 border border-white/10">
              <img src="https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=800&auto=format&fit=crop" 
              loading="lazy" alt="Notes" className="w-full h-full object-cover transition-transform duration-700 
              group-hover:scale-105 opacity-80 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent 
              to-transparent opacity-90"></div>
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-black/50 backdrop-blur-md text-white border4
                 border-white/10 text-xs px-3 py-1 rounded-full">PDFs</span>
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-medium mb-2">Premium Notes</h3>
            <p className="text-gray-400 text-lg">Download handwritten and digital notes crafted specifically for students to ace their exams.</p>
          </div>

          <div className="project-card group relative opacity-0 translate-y-12 md:mt-24">
            <div className="relative overflow-hidden rounded-2xl bg-gray-900 aspect-video mb-6 border border-white/10">
              <img src="https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=800&auto=format&fit=crop" loading="lazy" alt="App UI" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90"></div>
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-black/50 backdrop-blur-md text-white border border-white/10 text-xs px-3 py-1 rounded-full">Flutter / Dart</span>
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-medium mb-2">Learning App UI</h3>
            <p className="text-gray-400 text-lg">A cross-platform mobile application built with Flutter to help students learn on the go.</p>
          </div>
          
          <div className="project-card group relative opacity-0 translate-y-12">
            <div className="relative overflow-hidden rounded-2xl bg-gray-900 aspect-video mb-6 border border-white/10">
              <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop" loading="lazy" alt="Code" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90"></div>
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-black/50 backdrop-blur-md text-white border border-white/10 text-xs px-3 py-1 rounded-full">Blogs</span>
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-medium mb-2">Tech Tutorials</h3>
            <p className="text-gray-400 text-lg">In-depth articles simplifying complex computer science theories and programming concepts.</p>
          </div>

          <div className="project-card group relative opacity-0 translate-y-12 md:mt-24">
            <div className="relative overflow-hidden rounded-2xl bg-gray-900 aspect-video mb-6 border border-white/10">
              <img src="https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=800&auto=format&fit=crop" loading="lazy" alt="Mobile Dashboard" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90"></div>
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-black/50 backdrop-blur-md text-white border border-white/10 text-xs px-3 py-1 rounded-full">Open Source</span>
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-medium mb-2">Utility Toolkit</h3>
            <p className="text-gray-400 text-lg">A highly optimized utility app designed to solve daily productivity challenges for students.</p>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section id="faq" className="px-[5%] py-24 md:py-32 z-10 relative">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-12 text-center">Got Questions?</h2>
          <div className="flex flex-col gap-4">
            {faqData.map((faq, index) => (
              <details key={index} className="faq-item group bg-white/[0.02] border border-white/5 hover:border-white/20 p-6 md:p-8 rounded-2xl cursor-pointer opacity-0 transition-colors">
                <summary className="text-xl md:text-2xl font-medium list-none flex justify-between items-center outline-none">
                  {faq.q}
                  <span className="text-gray-500 group-open:rotate-45 transition-transform duration-300 text-2xl md:text-3xl ml-4">+</span>
                </summary>
                <div className="overflow-hidden">
                  <p className="text-gray-400 mt-6 leading-relaxed text-lg border-t border-white/10 pt-4">
                    {faq.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* --- NEW AWESOME FOOTER (Integrated) --- */}
      <footer className="border-t border-white/10 bg-[#050505] pt-16 pb-8 relative z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.4, delay: 0.1 }} className="space-y-4">
            <div className="flex items-center gap-2 font-bold tracking-wider text-lg">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-black flex items-center justify-center font-black"><Briefcase className=''/></div>
              <span className="font-bold text-blue-200 underline">My Portfolio</span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">Teaching and building high-performance digital experiences. Next.js, Flutter, and Supabase stack.</p>
            <div className="flex items-center gap-4 pt-2">
              <Link href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all"><Code className="w-4 h-4"/></Link>
              <Link href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-[#1DA1F2] hover:bg-white/10 transition-all"><MessageCircle className="w-4 h-4"/></Link>
              <Link href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-[#0A66C2] hover:bg-white/10 transition-all"><Briefcase className="w-4 h-4"/></Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.4, delay: 0.2 }} className="space-y-4">
            <h4 className="text-white font-semibold flex items-center gap-2"><ArrowRight className="w-4 h-4 text-indigo-400"/> Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li><Link href="/" className="hover:text-white transition-colors">Home Page</Link></li>
              <li><Link href="/apps" className="hover:text-white transition-colors">Mobile Applications</Link></li>
              <li><Link href="/notes" className="hover:text-white transition-colors">Study Resources</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.5, delay: 0.3 }} className="space-y-4">
            <h4 className="text-white font-semibold flex items-center gap-2"><Map className="w-4 h-4 text-emerald-400"/> Sitemap</h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li><Link href="#journey" className="hover:text-white transition-colors">Journey</Link></li>
              <li><Link href="#qualifications" className="hover:text-white transition-colors">Qualification</Link></li>
              <li><Link href="#work" className="hover:text-white transition-colors">Resources</Link></li>
              
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.3, delay: 0.2 }} className="space-y-4">
            <h4 className="text-white font-semibold flex items-center gap-2"><HelpCircle className="w-4 h-4 text-purple-400"/> Support</h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Me</Link></li>
              <li><Link href="#faq" className="hover:text-white transition-colors flex items-center gap-2">FAQ<MessageCircle className="w-3 h-3 text-red-400"/></Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 1, delay: 0.2 }} className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} <span className="font-bold text-blue-200 underline">My Portfolio</span> Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">Developed by <span className="font-bold text-blue-200 underline">VISHAL</span> With ❤️</p>
          <p className="flex items-center gap-1">Built with <span className="font-bold text-blue-200 underline">Next.js, Tailwind v4,</span> and <span className="font-bold text-blue-200 underline">Supabase.</span></p>
        </motion.div>
      </footer>

    </div>
  );
}