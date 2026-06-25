"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ParticleField from "@/components/ParticleField";
import AuthGuard from "@/components/AuthGuard";

const CUTOUT_URL = "https://ayvgxtdwylgpsjkpiulc.supabase.co/storage/v1/object/public/Media/ChatGPT%20Image%20Jun%2024,%202026,%2009_33_52%20PM.png";

const dialogues = {
  left: "We should have been travelling right now or having a fancy celebration. I promise we'll do that very soon! For now, here's a little gift. 💕",
  right: "We love you, Mommy. 🥰",
};

function SpeechBubble({ text, side }: { text: string; side: "left" | "right" }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: side === "left" ? 10 : -10, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.25 }}
        className="absolute z-20 w-44 rounded-2xl px-4 py-3 shadow-lg text-sm font-body leading-snug"
        style={{
          background: "rgba(255,255,255,0.92)",
          color: "#5C3D2E",
          border: "1.5px solid #F7C5CC",
          top: "20%",
          left: side === "left" ? "calc(100% + 14px)" : "auto",
          right: side === "right" ? "calc(100% + 14px)" : "auto",
        }}
      >
        {text}
        {/* Tail pointing toward the character */}
        <span
          style={{
            position: "absolute",
            top: 16,
            left: side === "left" ? -9 : "auto",
            right: side === "right" ? -9 : "auto",
            width: 0,
            height: 0,
            borderTop: "9px solid transparent",
            borderBottom: "9px solid transparent",
            borderRight: side === "left" ? "9px solid rgba(255,255,255,0.92)" : "none",
            borderLeft: side === "right" ? "9px solid rgba(255,255,255,0.92)" : "none",
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}

function Character({ label, delay, side }: { label: string; delay: number; side: "left" | "right" }) {
  const [hovered, setHovered] = useState(false);

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
        className="relative cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {hovered && <SpeechBubble text={dialogues[side]} side={side} />}

        <div
          className="w-40 h-56 md:w-52 md:h-72 overflow-hidden relative"
          style={{ background: "transparent" }}
        >
          <img
            src={CUTOUT_URL}
            alt={label}
            style={{
              position: "absolute",
              top: 0,
              height: "100%",
              width: "auto",
              maxWidth: "none",
              left: side === "left" ? "0%" : "auto",
              right: side === "right" ? "0%" : "auto",
              objectFit: "cover",
              objectPosition: side === "left" ? "left center" : "right center",
            }}
          />
        </div>
        <motion.div
          className="absolute -top-2 -right-2 text-xl"
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, delay }}
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

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-30 blur-3xl" style={{ background: "#F7C5CC" }} />
      <div className="absolute bottom-0 left-0 w-[250px] h-[250px] rounded-full opacity-20 blur-3xl" style={{ background: "#C9B8D8" }} />
      <div className="absolute bottom-0 right-0 w-[250px] h-[250px] rounded-full opacity-20 blur-3xl" style={{ background: "#FFBE88" }} />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center max-w-3xl">
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
            Hi Mommy!
          </motion.h1>
          <p className="font-body text-lg md:text-xl" style={{ color: "#8B3A5299" }}>
            We made something just for you…
          </p>
        </motion.div>

        <div className="flex items-end gap-4 md:gap-12 mt-4">
          <Character label="Daddy" delay={0.4} side="left" />

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
            className="flex flex-col items-center gap-2 pb-12"
          >
            <motion.div
              className="text-5xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              ❤️
            </motion.div>
          </motion.div>

          <Character label="Sofiel" delay={0.6} side="right" />
        </div>

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
          Continue ✦
        </motion.button>

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
