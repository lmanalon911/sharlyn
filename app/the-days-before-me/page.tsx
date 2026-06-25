"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AuthGuard from "@/components/AuthGuard";
import { storybookSpreads } from "@/lib/content";

const TOTAL = storybookSpreads.length;

function halfBg(url: string, side: "left" | "right", mirrorCompensate = false): React.CSSProperties {
  const pos = mirrorCompensate
    ? (side === "left" ? "100% 50%" : "0% 50%")
    : (side === "left" ? "0% 50%"  : "100% 50%");
  return {
    backgroundImage: `url(${url})`,
    backgroundSize:  "200% 100%",
    backgroundPosition: pos,
    backgroundRepeat: "no-repeat",
  };
}

function Placeholder({ n }: { n: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #F7C5CC20, #C9B8D830)" }}>
      <div className="text-center select-none">
        <div className="text-5xl mb-3 opacity-30">🖼️</div>
        <p className="font-body text-xs italic opacity-30" style={{ color: "#B76E79" }}>
          Spread {n} · pages {n * 2 - 1} &amp; {n * 2}
        </p>
      </div>
    </div>
  );
}

// Gutter shadow — darkens the inner edges near the spine for a realistic page curve
function GutterShadow({ side }: { side: "left" | "right" }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-10"
      style={{
        background: side === "left"
          ? "linear-gradient(to right, rgba(0,0,0,0.04) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.13) 100%)"
          : "linear-gradient(to left,  rgba(0,0,0,0.04) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.13) 100%)",
      }}
    />
  );
}

function StorybookContent() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState<1 | -1>(1);
  const [next, setNext] = useState(0);

  const isLast = current === TOTAL - 1;

  const turn = (dir: 1 | -1) => {
    if (flipping) return;
    const n = current + dir;
    if (n < 0 || n >= TOTAL) return;
    setFlipDir(dir);
    setNext(n);
    setFlipping(true);
    setTimeout(() => {
      setCurrent(n);
      setFlipping(false);
    }, 700);
  };

  const cur = storybookSpreads[current];
  const nxt = storybookSpreads[next] ?? cur;

  const backLeftSpread  = flipping && flipDir === -1 ? nxt : cur;
  const backRightSpread = flipping && flipDir ===  1 ? nxt : cur;

  const coverColor = "#3b2010";
  const pageEdgeColor = "#f0e4ca";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #FDF6EC, #F0E4D0)" }}
    >
      {/* Ambient light on background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(247,197,204,0.18) 0%, transparent 70%)"
      }} />

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 relative z-10">
        <h1 className="font-display text-2xl md:text-3xl" style={{ color: "#8B3A52" }}>The Days Before Me</h1>
        <p className="font-body text-xs tracking-widest uppercase mt-1" style={{ color: "#B76E7980" }}>as told by Sofiel ✦</p>
      </motion.div>

      {/* Book wrapper */}
      <div className="w-full max-w-5xl relative z-10 perspective-2000 px-6">

        {/* Floor shadow */}
        <div style={{
          position: "absolute",
          bottom: "-18px", left: "8%", right: "8%", height: "30px",
          background: "radial-gradient(ellipse, rgba(0,0,0,0.35) 0%, transparent 70%)",
          filter: "blur(8px)",
          zIndex: 0,
        }} />

        {/* Outer book shell */}
        <div className="relative" style={{ zIndex: 1 }}>

          {/* Left hard cover */}
          <div className="absolute left-0 top-0 bottom-0 z-30" style={{ width: 18 }}>
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0, width: "100%",
              borderRadius: "5px 0 0 5px",
              background: `linear-gradient(to right, ${coverColor} 0%, #5c3420 60%, #3b2010 100%)`,
              boxShadow: "inset -2px 0 4px rgba(0,0,0,0.3)",
            }} />
            {/* Page edge strip */}
            <div style={{
              position: "absolute", right: -6, top: 3, bottom: 3, width: 6,
              background: `repeating-linear-gradient(to bottom, ${pageEdgeColor} 0px, ${pageEdgeColor} 2px, #d9c9a8 2px, #d9c9a8 3px)`,
            }} />
          </div>

          {/* Right hard cover */}
          <div className="absolute right-0 top-0 bottom-0 z-30" style={{ width: 18 }}>
            <div style={{
              position: "absolute", right: 0, top: 0, bottom: 0, width: "100%",
              borderRadius: "0 5px 5px 0",
              background: `linear-gradient(to left, ${coverColor} 0%, #5c3420 60%, #3b2010 100%)`,
              boxShadow: "inset 2px 0 4px rgba(0,0,0,0.3)",
            }} />
            {/* Page edge strip */}
            <div style={{
              position: "absolute", left: -6, top: 3, bottom: 3, width: 6,
              background: `repeating-linear-gradient(to bottom, ${pageEdgeColor} 0px, ${pageEdgeColor} 2px, #d9c9a8 2px, #d9c9a8 3px)`,
            }} />
          </div>

          {/* Pages area */}
          <div
            className="relative flex"
            style={{
              marginLeft: 12,
              marginRight: 12,
              minHeight: 540,
              boxShadow: "0 20px 60px rgba(0,0,0,0.45), 0 6px 16px rgba(0,0,0,0.3)",
            }}
          >
            {/* ── Back layer: left page ── */}
            <div
              className="flex-1 relative overflow-hidden"
              style={{
                background: "#f5edd8",
                ...(backLeftSpread.spreadImage ? halfBg(backLeftSpread.spreadImage, "left") : {}),
              }}
            >
              {!backLeftSpread.spreadImage && <Placeholder n={flipping && flipDir === -1 ? next + 1 : current + 1} />}
              <GutterShadow side="left" />
            </div>

            {/* ── Back layer: right page ── */}
            <div
              className="flex-1 relative overflow-hidden"
              style={{
                background: "#f5edd8",
                ...(backRightSpread.spreadImage ? halfBg(backRightSpread.spreadImage, "right") : {}),
              }}
            >
              {!backRightSpread.spreadImage && <Placeholder n={flipping && flipDir === 1 ? next + 1 : current + 1} />}
              <GutterShadow side="right" />
            </div>

            {/* Spine */}
            <div
              className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 z-20 pointer-events-none"
              style={{
                width: 22,
                background: "linear-gradient(to right, rgba(0,0,0,0.25) 0%, rgba(183,110,121,0.2) 40%, rgba(255,255,255,0.15) 50%, rgba(183,110,121,0.2) 60%, rgba(0,0,0,0.25) 100%)",
              }}
            />

            {/* ── Flipping page ── */}
            {flipping && (
              <div
                className="absolute top-0 bottom-0 z-30 overflow-hidden"
                style={{
                  left:            flipDir === 1 ? "50%" : "0",
                  right:           flipDir === 1 ? "0"   : "50%",
                  transformOrigin: flipDir === 1 ? "left center" : "right center",
                  transformStyle:  "preserve-3d",
                  animation:       `pageFlip${flipDir === 1 ? "Forward" : "Backward"} 0.7s cubic-bezier(0.645,0.045,0.355,1.000) forwards`,
                }}
              >
                {/* Front face */}
                <div
                  className="absolute inset-0"
                  style={{
                    backfaceVisibility: "hidden",
                    background: "#f5edd8",
                    ...(cur.spreadImage ? halfBg(cur.spreadImage, flipDir === 1 ? "right" : "left") : {}),
                  }}
                >
                  {!cur.spreadImage && <Placeholder n={current + 1} />}
                  <GutterShadow side={flipDir === 1 ? "right" : "left"} />
                </div>

                {/* Curl shadow sweep */}
                <div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    backfaceVisibility: "hidden",
                    animation: `pageFlipShadow${flipDir === 1 ? "Forward" : "Backward"} 0.7s cubic-bezier(0.645,0.045,0.355,1.000) forwards`,
                  }}
                />

                {/* Back face */}
                <div
                  className="absolute inset-0"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    background: "#f5edd8",
                    ...(nxt.spreadImage ? halfBg(nxt.spreadImage, flipDir === 1 ? "left" : "right", true) : {}),
                  }}
                >
                  {!nxt.spreadImage && <Placeholder n={next + 1} />}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-6 mt-10 relative z-10">
        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => turn(-1)}
          disabled={current === 0 || flipping}
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg font-body font-bold text-lg disabled:opacity-30 transition-all"
          style={{ background: "#F7C5CC", color: "#8B3A52" }}
        >
          ←
        </motion.button>

        <div className="flex gap-1.5">
          {storybookSpreads.map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full transition-all duration-300" style={{ background: i === current ? "#B76E79" : "#F7C5CC" }} />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => { if (isLast) router.push("/surprise"); else turn(1); }}
          disabled={flipping}
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg font-body font-bold text-lg disabled:opacity-30 transition-all"
          style={{ background: isLast ? "#B76E79" : "#F7C5CC", color: isLast ? "#FFFDF9" : "#8B3A52" }}
        >
          {isLast ? "✓" : "→"}
        </motion.button>
      </div>

      {isLast && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 font-body text-sm italic" style={{ color: "#B76E79" }}>
          The end… or is it? 🌸
        </motion.p>
      )}
    </div>
  );
}

export default function StorybookPage() {
  return (
    <AuthGuard>
      <StorybookContent />
    </AuthGuard>
  );
}
