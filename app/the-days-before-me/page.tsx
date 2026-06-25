"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AuthGuard from "@/components/AuthGuard";
import { storybookSpreads } from "@/lib/content";

const TOTAL = storybookSpreads.length;

type PageData = { type: "image" | "text"; text?: string; caption?: string };

function PageContent({ page, pageNum, corner }: { page: PageData; pageNum: number; corner: "tl" | "tr" }) {
  return (
    <div className="h-full w-full flex flex-col">
      <div className={`text-xs mb-3 font-body ${corner === "tr" ? "text-right" : ""}`} style={{ color: "#B76E7950" }}>
        {pageNum}
      </div>
      <div className="flex-1">
        {page.type === "image" ? (
          <div className="h-full w-full rounded-2xl flex items-center justify-center p-4" style={{ background: "linear-gradient(135deg, #F7C5CC40, #C9B8D840)" }}>
            <div className="text-center">
              <div className="text-6xl mb-3">🖼️</div>
              <p className="font-body text-xs italic" style={{ color: "#B76E7999" }}>{page.caption}</p>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-2">
            <div className="text-center">
              {page.text?.split("\n").map((line, i) => (
                <p key={i} className="font-body text-sm md:text-base leading-relaxed mb-2" style={{ color: "#5C3D2E", whiteSpace: "pre-line" }}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className={`text-xl mt-2 ${corner === "tr" ? "text-right" : ""}`} style={{ color: "#F7C5CC80" }}>✦</div>
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

  // Back layer: what gets revealed under the flipping page
  // Forward: left stays as cur.left, right reveals nxt.right
  // Backward: left reveals nxt.left, right stays as cur.right
  const backLeft  = flipping && flipDir === -1 ? nxt.leftPage  : cur.leftPage;
  const backRight = flipping && flipDir ===  1 ? nxt.rightPage : cur.rightPage;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #FDF6EC, #F5EDD8)" }}>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
        <h1 className="font-display text-2xl md:text-3xl" style={{ color: "#8B3A52" }}>The Days Before Me</h1>
        <p className="font-body text-xs tracking-widest uppercase mt-1" style={{ color: "#B76E7980" }}>as told by Sofiel ✦</p>
      </motion.div>

      {/* Book */}
      <div className="w-full max-w-4xl perspective-2000">
        <div className="relative w-full rounded-3xl shadow-2xl flex" style={{ minHeight: "420px", background: "#FDF6EC" }}>

          {/* Spine */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-6 z-20 pointer-events-none" style={{ background: "linear-gradient(to right, #5C3D2E30, #B76E7960, #5C3D2E30)" }} />

          {/* Back layer — always visible, revealed as the page lifts */}
          <div className="flex-1 paper-texture p-6 md:p-8 rounded-l-3xl border-r-2" style={{ borderColor: "#B76E7920" }}>
            <PageContent page={backLeft} pageNum={(flipping && flipDir === -1 ? next : current) * 2 + 1} corner="tl" />
          </div>
          <div className="flex-1 paper-texture p-6 md:p-8 rounded-r-3xl">
            <PageContent page={backRight} pageNum={(flipping && flipDir === 1 ? next : current) * 2 + 2} corner="tr" />
          </div>

          {/* Flipping page */}
          {flipping && (
            <div
              className="absolute top-0 bottom-0 z-30"
              style={{
                left:            flipDir === 1 ? "50%" : "0",
                right:           flipDir === 1 ? "0"   : "50%",
                transformOrigin: flipDir === 1 ? "left center" : "right center",
                transformStyle:  "preserve-3d",
                animation:       `pageFlip${flipDir === 1 ? "Forward" : "Backward"} 0.7s cubic-bezier(0.645,0.045,0.355,1.000) forwards`,
                borderRadius:    flipDir === 1 ? "0 1.5rem 1.5rem 0" : "1.5rem 0 0 1.5rem",
              }}
            >
              {/* Front face — the page that lifts */}
              <div className="absolute inset-0 paper-texture p-6 md:p-8" style={{ backfaceVisibility: "hidden", borderRadius: "inherit" }}>
                <PageContent
                  page={flipDir === 1 ? cur.rightPage : cur.leftPage}
                  pageNum={flipDir === 1 ? current * 2 + 2 : current * 2 + 1}
                  corner={flipDir === 1 ? "tr" : "tl"}
                />
              </div>
              {/* Back face — revealed as it curls over */}
              <div className="absolute inset-0 paper-texture p-6 md:p-8" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: "inherit" }}>
                <PageContent
                  page={flipDir === 1 ? nxt.leftPage : nxt.rightPage}
                  pageNum={flipDir === 1 ? next * 2 + 1 : next * 2 + 2}
                  corner={flipDir === 1 ? "tl" : "tr"}
                />
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
