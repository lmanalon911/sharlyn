"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ParticleField from "@/components/ParticleField";
import AuthGuard from "@/components/AuthGuard";

function CharacterPlaceholder({ label, delay, side }: { label: string; delay: number; side: "left" | "right" }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -80 : 80, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay, duration: 0.9, ease: "easeOut" }}
      className="flex flex-col items-center gap-3"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: delay * 0.5 }}
        className="relative"
      >
        {/* Character silhouette placeholder */}
        <div
          className="w-36 h-52 md:w-44 md:h-64 rounded-3xl flex items-end justify-center overflow-hidden shadow-xl"
          style={{ background: "linear-gradient(135deg, #F7C5CC, #C9B8D8)" }}
        >
          <div className="text-center pb-4 px-2">
            <div className="text-5xl mb-1">{side === "left" ? "👨" : "👧"}</div>
          </div>
        </div>
        {/* Sparkle overlay */}
        <motion.div
          className="absolute -top-2 -right-2 text-xl"
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, delay: delay }}
        >
          ✨
        </motion.div>
      </motion.div>
      <p className="font-display text-xl" style={{ color: "#8B3A52" }}>{label}</p>
    </motion.div>
  );
}

function WelcomeContent() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen fairytale-bg flex flex-col items-center justify-center overflow-hidden">
      <ParticleField count={60} />

      {/* Glow blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-30 blur-3xl" style={{ background: "#F7C5CC" }} />
      <div className="absolute bottom-0 left-0 w-[250px] h-[250px] rounded-full opacity-20 blur-3xl" style={{ background: "#C9B8D8" }} />
      <div className="absolute bottom-0 right-0 w-[250px] h-[250px] rounded-full opacity-20 blur-3xl" style={{ background: "#FFBE88" }} />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center max-w-3xl">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="font-display text-5xl md:text-7xl mb-2"
            style={{ color: "#B76E79" }}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            Hi Mommy! 💕
          </motion.h1>
          <p className="font-body text-lg md:text-xl" style={{ color: "#8B3A5299" }}>
            We made something just for you…
          </p>
        </motion.div>

        {/* Characters */}
        <div className="flex items-end gap-8 md:gap-16 mt-4">
          <CharacterPlaceholder label="Daddy" delay={0.4} side="left" />

          {/* Center heart */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
            className="flex flex-col items-center gap-2 pb-8"
          >
            <motion.div
              className="text-5xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              ❤️
            </motion.div>
          </motion.div>

          <CharacterPlaceholder label="Sofiel" delay={0.6} side="right" />
        </div>

        {/* Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/intro")}
          className="mt-4 px-10 py-4 rounded-full font-body font-semibold text-lg tracking-wide shadow-xl transition-all"
          style={{ background: "#B76E79", color: "#FFFDF9" }}
        >
          Begin Our Story ✦
        </motion.button>

        {/* Decorative dots */}
        <motion.div
          className="flex gap-2 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ background: "#F7C5CC" }}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.3 }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <AuthGuard>
      <WelcomeContent />
    </AuthGuard>
  );
}
