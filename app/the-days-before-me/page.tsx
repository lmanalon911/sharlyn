"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AuthGuard from "@/components/AuthGuard";
import ParticleField from "@/components/ParticleField";
import { storybookSpreads } from "@/lib/content";

const TOTAL = storybookSpreads.length;

function halfBg(url: string, side: "left" | "right", mirrorCompensate = false): React.CSSProperties {
  const pos = mirrorCompensate
    ? (side === "left" ? "100% 50%" : "0% 50%")
    : (side === "left" ? "0% 50%"   : "100% 50%");
  return {
    backgroundImage: `url(${url})`,
    backgroundSize:  "200% 100%",
    backgroundPosition: pos,
    backgroundRepeat: "no-repeat",
  };
}

function Placeholder({ n }: { n: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center select-none" style={{ background: "linear-gradient(135deg, #F7C5CC18, #C9B8D828)" }}>
      <div className="text-center">
        <div className="text-5xl mb-3 opacity-25">🖼️</div>
        <p className="font-body text-xs italic opacity-25" style={{ color: "#B76E79" }}>
          Spread {n} · pages {n * 2 - 1} &amp; {n * 2}
        </p>
      </div>
    </div>
  );
}

function GutterShadow({ side }: { side: "left" | "right" }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-10" style={{
      background: side === "left"
        ? "linear-gradient(to right, rgba(0,0,0,0.03) 0%, transparent 30%, transparent 72%, rgba(0,0,0,0.15) 100%)"
        : "linear-gradient(to left,  rgba(0,0,0,0.03) 0%, transparent 30%, transparent 72%, rgba(0,0,0,0.15) 100%)",
    }} />
  );
}

const COVER = "linear-gradient(to bottom, #5c3318 0%, #3b2010 40%, #2a1508 100%)";
const PAGE_EDGES = "repeating-linear-gradient(to bottom, #f0e4ca 0px, #f0e4ca 2px, #d4c09a 2px, #d4c09a 3.5px)";

function StorybookContent() {
  const router = useRouter();
  // Preload all spread images on mount so flips never wait for network
  useEffect(() => {
    storybookSpreads.forEach((s) => {
      if (s.spreadImage) {
        const img = new Image();
        img.src = s.spreadImage;
      }
    });
  }, []);

  const [current, setCurrent] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState<1 | -1>(1);
  const [next, setNext] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const isLast = current === TOTAL - 1;

  const turn = (dir: 1 | -1) => {
    if (flipping) return;
    const n = current + dir;
    if (n < 0 || n >= TOTAL) return;
    setFlipDir(dir);
    setNext(n);
    setFlipping(true);
    setTimeout(() => { setCurrent(n); setFlipping(false); }, 700);
  };

  const cur = storybookSpreads[current];
  const nxt = storybookSpreads[next] ?? cur;

  const backLeftSpread  = flipping && flipDir === -1 ? nxt : cur;
  const backRightSpread = flipping && flipDir ===  1 ? nxt : cur;
  const backLeftN  = (flipping && flipDir === -1 ? next  : current) + 1;
  const backRightN = (flipping && flipDir ===  1 ? next  : current) + 1;

  return (
    <div className="relative min-h-screen fairytale-bg flex flex-col items-center justify-center px-4 py-10 overflow-hidden">
      <ParticleField count={40} />
      <motion.div className="absolute inset-0 z-50 pointer-events-none"
        initial={{ opacity: 0 }} animate={{ opacity: leaving ? 1 : 0 }} transition={{ duration: 0.7 }}
        style={{ background: "#FFFDF9" }} />

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 relative z-10">
        <h1 className="font-display text-2xl md:text-4xl" style={{ color: "#8B3A52" }}>The Days Before Me</h1>
        <p className="font-body text-xs tracking-widest uppercase mt-1" style={{ color: "#B76E7980" }}>as told by Sofiel ✦</p>
      </motion.div>

      {/* Book */}
      <div className="relative z-10 w-full" style={{ maxWidth: 1000 }}>

        {/* Floor shadow */}
        <div style={{
          position: "absolute", bottom: -20, left: "5%", right: "5%", height: 32,
          background: "radial-gradient(ellipse, rgba(0,0,0,0.45) 0%, transparent 70%)",
          filter: "blur(10px)", zIndex: 0,
        }} />

        {/* Book body — flex row: left-binding | pages | right-binding */}
        <div className="flex items-stretch relative" style={{
          zIndex: 1,
          filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.45)) drop-shadow(0 8px 16px rgba(0,0,0,0.3))",
        }}>

          {/* ── Left binding ── */}
          <div className="flex-none flex items-stretch" style={{ width: 26 }}>
            {/* Page-edge texture */}
            <div style={{ width: 12, background: PAGE_EDGES, alignSelf: "stretch" }} />
            {/* Hard cover */}
            <div style={{ width: 14, background: COVER, borderRadius: "6px 0 0 6px", boxShadow: "inset -3px 0 6px rgba(0,0,0,0.4), 2px 0 4px rgba(0,0,0,0.2)" }} />
          </div>

          {/* ── Pages area ── */}
          <div className="perspective-2000 flex-1" style={{ minHeight: 560 }}>
            <div className="relative w-full h-full flex" style={{ minHeight: 560 }}>

              {/* Left page */}
              <div className="flex-1 relative overflow-hidden" style={{
                background: "#f5edd8",
                ...(backLeftSpread.spreadImage ? halfBg(backLeftSpread.spreadImage, "left") : {}),
              }}>
                {!backLeftSpread.spreadImage && <Placeholder n={backLeftN} />}
                <GutterShadow side="left" />
              </div>

              {/* Right page */}
              <div className="flex-1 relative overflow-hidden" style={{
                background: "#f5edd8",
                ...(backRightSpread.spreadImage ? halfBg(backRightSpread.spreadImage, "right") : {}),
              }}>
                {!backRightSpread.spreadImage && <Placeholder n={backRightN} />}
                <GutterShadow side="right" />
              </div>

              {/* Spine */}
              <div className="absolute top-0 bottom-0 z-20 pointer-events-none" style={{
                left: "50%", transform: "translateX(-50%)", width: 20,
                background: "linear-gradient(to right, rgba(0,0,0,0.28) 0%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0.18) 55%, rgba(0,0,0,0.28) 100%)",
              }} />

              {/* Flipping page */}
              {flipping && (
                <div className="absolute top-0 bottom-0 z-30 overflow-hidden" style={{
                  left:            flipDir === 1 ? "50%" : "0",
                  right:           flipDir === 1 ? "0"   : "50%",
                  transformOrigin: flipDir === 1 ? "left center" : "right center",
                  transformStyle:  "preserve-3d",
                  animation:       `pageFlip${flipDir === 1 ? "Forward" : "Backward"} 0.7s cubic-bezier(0.645,0.045,0.355,1.000) forwards`,
                }}>
                  {/* Front face */}
                  <div className="absolute inset-0" style={{
                    backfaceVisibility: "hidden",
                    background: "#f5edd8",
                    ...(cur.spreadImage ? halfBg(cur.spreadImage, flipDir === 1 ? "right" : "left") : {}),
                  }}>
                    {!cur.spreadImage && <Placeholder n={current + 1} />}
                    <GutterShadow side={flipDir === 1 ? "right" : "left"} />
                  </div>

                  {/* Curl shadow sweep */}
                  <div className="absolute inset-0 pointer-events-none z-10" style={{
                    backfaceVisibility: "hidden",
                    animation: `pageFlipShadow${flipDir === 1 ? "Forward" : "Backward"} 0.7s cubic-bezier(0.645,0.045,0.355,1.000) forwards`,
                  }} />

                  {/* Back face */}
                  <div className="absolute inset-0" style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    background: "#f5edd8",
                    ...(nxt.spreadImage ? halfBg(nxt.spreadImage, flipDir === 1 ? "left" : "right", true) : {}),
                  }}>
                    {!nxt.spreadImage && <Placeholder n={next + 1} />}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Right binding ── */}
          <div className="flex-none flex items-stretch" style={{ width: 26 }}>
            {/* Hard cover */}
            <div style={{ width: 14, background: COVER, borderRadius: "0 6px 6px 0", boxShadow: "inset 3px 0 6px rgba(0,0,0,0.4), -2px 0 4px rgba(0,0,0,0.2)" }} />
            {/* Page-edge texture */}
            <div style={{ width: 12, background: PAGE_EDGES, alignSelf: "stretch" }} />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-6 mt-10 relative z-10">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => turn(-1)} disabled={current === 0 || flipping}
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg font-body font-bold text-lg disabled:opacity-30 transition-all"
          style={{ background: "#F7C5CC", color: "#8B3A52" }}>←</motion.button>

        <div className="flex gap-1.5">
          {storybookSpreads.map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full transition-all duration-300"
              style={{ background: i === current ? "#B76E79" : "#F7C5CC" }} />
          ))}
        </div>

        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => { if (isLast) { setLeaving(true); setTimeout(() => router.push("/message"), 700); } else turn(1); }}
          disabled={flipping}
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg font-body font-bold text-lg disabled:opacity-30 transition-all"
          style={{ background: isLast ? "#B76E79" : "#F7C5CC", color: isLast ? "#FFFDF9" : "#8B3A52" }}>
          {isLast ? "✓" : "→"}
        </motion.button>
      </div>

      {isLast && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 font-body text-sm italic" style={{ color: "#B76E79" }}>
          The end… or is it? 🌸
        </motion.p>
      )}

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { setLeaving(true); setTimeout(() => router.push("/message"), 700); }}
        className="absolute top-4 right-4 px-4 py-1.5 rounded-full font-body text-sm shadow-md"
        style={{ background: "rgba(253,246,236,0.85)", color: "#B76E79", border: "1px solid #F7C5CC" }}
      >
        Skip
      </motion.button>
    </div>
  );
}

export default function StorybookPage() {
  return <AuthGuard><StorybookContent /></AuthGuard>;
}
