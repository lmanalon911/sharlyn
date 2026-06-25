"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ParticleField from "@/components/ParticleField";
import AuthGuard from "@/components/AuthGuard";
import { introSlides } from "@/lib/content";

const decorativeElements = ["✦", "❀", "◇", "✿", "◈"];

function SlideImage({ slideId }: { slideId: number }) {
  const gradients = [
    "linear-gradient(135deg, #F7C5CC, #C9B8D8)",
    "linear-gradient(135deg, #FFBE88, #F7C5CC)",
    "linear-gradient(135deg, #C9B8D8, #B76E79)",
    "linear-gradient(135deg, #F5EDD8, #FFBE88)",
    "linear-gradient(135deg, #F7C5CC, #8B3A52)",
  ];
  const emojis = ["💕", "🌸", "✨", "🏡", "👧"];

  return (
    <div
      className="w-full h-64 md:h-72 rounded-3xl flex items-center justify-center shadow-xl"
      style={{ background: gradients[(slideId - 1) % gradients.length] }}
    >
      <div className="text-center">
        <div className="text-7xl mb-2">{emojis[(slideId - 1) % emojis.length]}</div>
        <p className="font-body text-sm text-white/70 italic">[Photo placeholder {slideId}]</p>
      </div>
    </div>
  );
}

function IntroContent() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const slide = introSlides[current];
  const isLast = current === introSlides.length - 1;

  const next = () => {
    if (isLast) {
      router.push("/invitation");
      return;
    }
    setDirection(1);
    setCurrent((c) => c + 1);
  };

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -60 }),
  };

  return (
    <div className="relative min-h-screen fairytale-bg flex items-center justify-center overflow-hidden">
      <ParticleField count={40} />

      <div className="absolute inset-0 pointer-events-none">
        {decorativeElements.map((el, i) => (
          <motion.div
            key={i}
            className="absolute font-display text-2xl"
            style={{
              color: "#F7C5CC",
              left: `${10 + i * 20}%`,
              top: `${15 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -15, 0],
              rotate: [0, 10, -10, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              repeat: Infinity,
              duration: 4 + i,
              delay: i * 0.7,
            }}
          >
            {el}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-lg px-6">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {introSlides.map((_, i) => (
            <motion.div
              key={i}
              className="h-2 rounded-full transition-all duration-500"
              style={{
                background: i === current ? "#B76E79" : "#F7C5CC",
                width: i === current ? "24px" : "8px",
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="glass rounded-3xl p-8 shadow-2xl text-center"
          >
            <SlideImage slideId={slide.id} />

            <motion.div className="mt-6 space-y-3">
              <h2
                className="font-display text-3xl md:text-4xl"
                style={{ color: "#8B3A52" }}
              >
                {slide.heading}
              </h2>
              <p className="font-body text-lg leading-relaxed" style={{ color: "#5C3D2E" }}>
                {slide.body}
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={next}
            className="px-10 py-4 rounded-full font-body font-semibold text-lg tracking-wide shadow-xl transition-all"
            style={{ background: "#B76E79", color: "#FFFDF9" }}
          >
            {isLast ? "Meet Sofiel ✦" : "Next →"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default function IntroPage() {
  return (
    <AuthGuard>
      <IntroContent />
    </AuthGuard>
  );
}
