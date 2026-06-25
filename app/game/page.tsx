"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ParticleField from "@/components/ParticleField";
import AuthGuard from "@/components/AuthGuard";
import { gameLevels } from "@/lib/gameData";

const TOTAL_LEVELS = gameLevels.length;

function GameContent() {
  const router = useRouter();
  const [levelIndex, setLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [completed, setCompleted] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const level = gameLevels[levelIndex];

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (feedback) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;

    const dx = xPct - level.target.xPercent;
    const dy = yPct - level.target.yPercent;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= level.target.radiusPercent) {
      setFeedback("correct");
      setFeedbackMsg(level.successMessage);
      setScore((s) => s + 1);
      setTimeout(() => {
        setFeedback(null);
        if (levelIndex + 1 >= TOTAL_LEVELS) {
          setCompleted(true);
        } else {
          setLevelIndex((i) => i + 1);
        }
      }, 1800);
    } else {
      const wrongs = [
        "Not there! Keep looking! 🔍",
        "Oops! Try again! 😄",
        "So close… maybe? 😅",
        "Hmm, look harder! 👀",
        "Nope! Mommy is hiding! 🙈",
      ];
      setFeedback("wrong");
      setFeedbackMsg(wrongs[Math.floor(Math.random() * wrongs.length)]);
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  if (completed) {
    return (
      <div className="relative min-h-screen fairytale-bg flex items-center justify-center overflow-hidden">
        <ParticleField count={80} />
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 150 }}
          className="relative z-10 glass rounded-3xl p-10 text-center max-w-sm mx-4 shadow-2xl"
        >
          <motion.div
            className="text-7xl mb-4"
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            🎊
          </motion.div>
          <h2 className="font-display text-3xl mb-2" style={{ color: "#8B3A52" }}>
            You found Mommy!
          </h2>
          <p className="font-body text-lg mb-2" style={{ color: "#5C3D2E" }}>
            Score: {score}/{TOTAL_LEVELS} ✨
          </p>
          <p className="font-body text-sm italic mb-6" style={{ color: "#B76E79" }}>
            Now for your reward, Mommy… 💕
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/video")}
            className="px-8 py-4 rounded-full font-body font-semibold shadow-lg text-lg"
            style={{ background: "#B76E79", color: "#FFFDF9" }}
          >
            Claim Your Reward 🎁
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen fairytale-bg flex flex-col items-center justify-center overflow-hidden px-4 py-8">
      <ParticleField count={30} />

      <div className="relative z-10 w-full max-w-lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <p className="font-display text-2xl md:text-3xl mb-1" style={{ color: "#8B3A52" }}>
            Asan si Mommy? 👀
          </p>
          <p className="font-body text-sm italic" style={{ color: "#B76E79" }}>
            &ldquo;Before Daddy shows you the surprise… Let&apos;s play!&rdquo; — Sofiel 🌸
          </p>
        </motion.div>

        {/* Score & progress */}
        <div className="flex items-center justify-between mb-4 px-2">
          <p className="font-body text-sm" style={{ color: "#B76E79" }}>
            Level {levelIndex + 1} of {TOTAL_LEVELS}
          </p>
          <p className="font-body text-sm font-semibold" style={{ color: "#8B3A52" }}>
            ⭐ {score}/{TOTAL_LEVELS}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full mb-6 overflow-hidden" style={{ background: "#F7C5CC50" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "#B76E79" }}
            animate={{ width: `${((levelIndex) / TOTAL_LEVELS) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Game image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={levelIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
          >
            <div className="glass rounded-3xl p-4 shadow-xl mb-4">
              <p className="font-body text-center text-sm italic mb-3" style={{ color: "#B76E79" }}>
                💡 {level.hint}
              </p>

              {/* Clickable image area */}
              <div
                ref={imageRef}
                className="relative w-full rounded-2xl cursor-crosshair overflow-hidden select-none"
                style={{
                  height: "300px",
                  background: level.bgColor,
                }}
                onClick={handleClick}
              >
                {/* Placeholder scene */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-2">🔍</div>
                    <p className="font-body text-sm" style={{ color: "#B76E7980" }}>
                      {level.imageAlt}
                    </p>
                    <p className="font-body text-xs mt-1" style={{ color: "#B76E7960" }}>
                      [Image placeholder — click to find Mommy!]
                    </p>
                  </div>
                </div>

                {/* Feedback overlay */}
                <AnimatePresence>
                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 flex items-center justify-center rounded-2xl"
                      style={{
                        background: feedback === "correct"
                          ? "rgba(183, 110, 121, 0.85)"
                          : "rgba(92, 61, 46, 0.7)",
                      }}
                    >
                      <div className="text-center text-white p-6">
                        <div className="text-5xl mb-2">
                          {feedback === "correct" ? "🎉" : "😅"}
                        </div>
                        <p className="font-display text-xl">{feedbackMsg}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function GamePage() {
  return (
    <AuthGuard>
      <GameContent />
    </AuthGuard>
  );
}
