"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";

const faqData = [
  { question: "How should I use Voice Note alongside your YouTube lectures?", answer: "Follow the 4-Step Loop: First, watch the concept video... Second, read the color-coded Digital Notes... Third, download the Handwritten PDF... finally, solve the Topic-wise MCQs!" },
  { question: "Are the study materials, digital notes, and 120+ question banks completely free?", answer: "Yes! Every single digital note, handwritten PDF manual, and GATE/UGC NET question bank uploaded here is 100% free for my community and registered students." },
  { question: "How do I access the Flutter applications you build?", answer: "You can navigate to the Apps Hub section from the top menu. Each application comes with release notes, UI screenshots, and direct production APK download links." },
  { question: "Can I track my mock test accuracy and performance?", answer: "Yes, once you log in, your 'My Dashboard' section tracks your attempted quizzes, accuracy percentage, and helps you identify weak units before the actual exam." }
];

export default function FAQSection() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-20 sm:pb-24 z-10 relative scroll-mt-20 pointer-events-auto">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5 }} className="text-center mb-10 sm:mb-12">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-zinc-900 flex items-center justify-center mx-auto mb-4 sm:mb-5 border border-white/10 text-indigo-400 shadow-xl">
          <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3 text-white">Student FAQs</h2>
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
              <button onClick={() => setOpenFaqIndex(isOpen ? null : index)} className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left font-bold text-sm sm:text-base md:text-lg focus:outline-none">
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
  );
}