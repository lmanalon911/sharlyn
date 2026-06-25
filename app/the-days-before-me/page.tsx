"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AuthGuard from "@/components/AuthGuard";
import { storybookSpreads } from "@/lib/content";

const TOTAL = storybookSpreads.length;

// background-size: 200% makes the image span both pages.
// "left"  half → background-position 0% 50%
// "right" half → background-position 100% 50%
// mirrorCompensate: back face has rotateY(180deg) so left↔right are flipped in DOM;
//   pass true so we invert the position, keeping visuals correct.
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

// Placeholder shown when no spreadImage is provided yet
function Placeholder({ n }: { n: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #F7C5CC30, #C9B8D840)" }}>
      <div className="text-center select-none">
        <div className="text-5xl mb-3 opacity-40">🖼️</div>
        <p className="font-body text-xs italic opacity-40" style={{ color: "#B76E79" }}>
          Spread {n} · pages {n * 2 - 1} &amp; {n * 2}
        </p>
      </div>
    </div>
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

  // Back layer halves:
  // Forward flip  → left stays as cur, right reveals nxt
  // Backward flip → left reveals nxt, right stays as cur
  const backLeftSpread  = flipping && flipDir === -1 ? nxt : cur;
  const backRightSpread = flipping && flipDir ===  1 ? nxt : cur;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #FDF6EC, #F5EDD8)" }}
    >
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
        <h1 className="font-display text-2xl md:text-3xl" style={{ color: "#8B3A52" }}>The Days Before Me</h1>
        <p className="font-body text-xs tracking-widest uppercase mt-1" style={{ color: "#B76E7980" }}>as told by Sofiel ✦</p>
      </motion.div>

      {/* Book */}
      <div className="w-full max-w-4xl perspective-2000">
        <div className="relative w-full rounded-3xl shadow-2xl flex overflow-hidden" style={{ minHeight: "420px" }}>

          {/* ── Back layer: left half ── */}
          <div
            className="flex-1 relative"
            style={backLeftSpread.spreadImage ? halfBg(backLeftSpread.spreadImage, "left") : { background: "#FDF6EC" }}
          >
            {!backLeftSpread.spreadImage && <Placeholder n={flipping && flipDir === -1 ? next + 1 : current + 1} />}
          </div>

          {/* ── Back layer: right half ── */}
          <div
            className="flex-1 relative"
            style={backRightSpread.spreadImage ? halfBg(backRightSpread.spreadImage, "right") : { background: "#FDF6EC" }}
          >
            {!backRightSpread.spreadImage && !backLeftSpread.spreadImage && null}
          </div>

          {/* Spine crease */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-5 z-20 pointer-events-none"
            style={{ background: "linear-gradient(to right, rgba(92,61,46,0.18), rgba(183,110,121,0.35), rgba(92,61,46,0.18))" }}
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
                  ...(cur.spreadImage
                    ? halfBg(cur.spreadImage, flipDir === 1 ? "right" : "left")
                    : { background: "#FDF6EC" }),
                }}
              >
                {!cur.spreadImage && <Placeholder n={current + 1} />}
              </div>

              {/* Shadow sweep for curl feel */}
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
                  ...(nxt.spreadImage
                    ? halfBg(nxt.spreadImage, flipDir === 1 ? "left" : "right", true)
                    : { background: "#FDF6EC" }),
                }}
              >
                {!nxt.spreadImage && <Placeholder n={next + 1} />}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-6 mt-8">
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
