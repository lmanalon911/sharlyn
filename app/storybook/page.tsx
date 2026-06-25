"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AuthGuard from "@/components/AuthGuard";
import { storybookSpreads } from "@/lib/content";

const TOTAL = storybookSpreads.length;

function PageContent({ text, caption, type }: { text?: string; caption?: string; type: "image" | "text" }) {
  if (type === "image") {
    return (
      <div
        className="h-full w-full rounded-2xl flex items-center justify-center p-4"
        style={{ background: "linear-gradient(135deg, #F7C5CC40, #C9B8D840)" }}
      >
        <div className="text-center">
          <div className="text-6xl mb-3">🖼️</div>
          <p className="font-body text-xs italic" style={{ color: "#B76E7999" }}>
            {caption}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="h-full w-full flex items-center justify-center p-6">
      <div className="text-center">
        {text?.split("\n").map((line, i) => (
          <p
            key={i}
            className={`font-body leading-relaxed mb-2 ${i === 0 && text.includes("Things I Know") ? "font-display text-xl font-bold mb-4" : "text-sm md:text-base"}`}
            style={{ color: "#5C3D2E", whiteSpace: "pre-line" }}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

function StorybookContent() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [flipping, setFlipping] = useState(false);

  const spread = storybookSpreads[current];
  const isLast = current === TOTAL - 1;

  const turn = (dir: number) => {
    if (flipping) return;
    const next = current + dir;
    if (next < 0 || next >= TOTAL) return;
    setFlipping(true);
    setDirection(dir);
    setTimeout(() => {
      setCurrent(next);
      setFlipping(false);
    }, 400);
  };

  const variants = {
    enter: (d: number) => ({ opacity: 0, rotateY: d > 0 ? 15 : -15, scale: 0.97 }),
    center: { opacity: 1, rotateY: 0, scale: 1 },
    exit: (d: number) => ({ opacity: 0, rotateY: d > 0 ? -15 : 15, scale: 0.97 }),
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #FDF6EC, #F5EDD8)" }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="font-display text-2xl md:text-3xl" style={{ color: "#8B3A52" }}>
          The Days Before Me
        </h1>
        <p className="font-body text-xs tracking-widest uppercase mt-1" style={{ color: "#B76E7980" }}>
          as told by Sofiel ✦
        </p>
      </motion.div>

      {/* Book */}
      <div className="w-full max-w-4xl relative perspective-1000">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full"
          >
            {/* Book container */}
            <div
              className="rounded-3xl shadow-2xl overflow-hidden flex relative"
              style={{ minHeight: "420px", background: "#FDF6EC" }}
            >
              {/* Book spine */}
              <div
                className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-6 z-10 shadow-xl"
                style={{
                  background: "linear-gradient(to right, #5C3D2E30, #B76E7960, #5C3D2E30)",
                }}
              />

              {/* Left page */}
              <div className="flex-1 paper-texture p-6 md:p-8 relative border-r-2" style={{ borderColor: "#B76E7920" }}>
                <div className="text-xs mb-3 font-body" style={{ color: "#B76E7950" }}>
                  {current * 2 + 1}
                </div>
                <div className="h-[320px] md:h-[360px]">
                  <PageContent
                    type={spread.leftPage.type}
                    text={spread.leftPage.text}
                    caption={spread.leftPage.caption}
                  />
                </div>
                {/* Decorative corner */}
                <div className="absolute bottom-4 left-4 text-xl" style={{ color: "#F7C5CC80" }}>✦</div>
              </div>

              {/* Right page */}
              <div className="flex-1 paper-texture p-6 md:p-8 relative">
                <div className="text-xs mb-3 text-right font-body" style={{ color: "#B76E7950" }}>
                  {current * 2 + 2}
                </div>
                <div className="h-[320px] md:h-[360px]">
                  <PageContent
                    type={spread.rightPage.type}
                    text={spread.rightPage.text}
                    caption={spread.rightPage.caption}
                  />
                </div>
                <div className="absolute bottom-4 right-4 text-xl" style={{ color: "#F7C5CC80" }}>✦</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-6 mt-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => turn(-1)}
          disabled={current === 0}
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg font-body font-bold text-lg disabled:opacity-30 transition-all"
          style={{ background: "#F7C5CC", color: "#8B3A52" }}
        >
          ←
        </motion.button>

        <div className="flex gap-1.5">
          {storybookSpreads.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{ background: i === current ? "#B76E79" : "#F7C5CC" }}
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            if (isLast) router.push("/surprise");
            else turn(1);
          }}
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg font-body font-bold text-lg transition-all"
          style={{ background: isLast ? "#B76E79" : "#F7C5CC", color: isLast ? "#FFFDF9" : "#8B3A52" }}
        >
          {isLast ? "✓" : "→"}
        </motion.button>
      </div>

      {isLast && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 font-body text-sm italic"
          style={{ color: "#B76E79" }}
        >
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
