"use client";

import { motion, AnimatePresence } from "framer-motion";

// 🔥 FIX: Ab ye prop (isVisible) accept karega HomePage se
export default function SplashScreen({ isVisible }: { isVisible: boolean }) {
  const bgText = "VOICE NOTE";
  const letters = bgText.split("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash"
          exit={{ opacity: 0, y: -50, filter: "blur(10px)" }} 
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden pointer-events-auto"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-indigo-600/20 blur-[100px] md:blur-[120px] rounded-full pointer-events-none z-0" />

          <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 w-full overflow-hidden px-2">
            <motion.h1 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center justify-center text-[12vw] sm:text-[9vw] md:text-[7vw] lg:text-[6vw] font-black whitespace-nowrap opacity-20 selection:bg-none tracking-widest"
            >
              {letters.map((letter, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  className={letter === " " ? "w-[4vw] sm:w-[3vw] md:w-[2vw]" : ""}
                  style={{ WebkitTextStroke: '2px rgba(255,255,255,0.15)', color: 'transparent' }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.h1>
          </motion.div>

          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 100, delay: 1.6 }}
            className="relative z-10 w-20 h-20 md:w-32 md:h-32 rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl flex items-center justify-center shadow-indigo-500/20"
          >
            <img src="/logo.png" alt="Website Logo" className="w-full h-full object-cover" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0, duration: 0.5 }}
            className="mt-6 md:mt-8 flex flex-col items-center z-10"
          >
            <span className="text-white font-semibold tracking-[0.2em] md:tracking-[0.3em] uppercase text-[10px] md:text-xs mb-3 md:mb-4">
              Welcome Buddy 😍...
            </span>
            <div className="w-40 md:w-48 h-[2px] bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.0, ease: "easeInOut", delay: 2.2 }}
                className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_#6366f1]"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}