"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AuthGuard from "@/components/AuthGuard";
import ParticleField from "@/components/ParticleField";
import { storybookSpreads } from "@/lib/content";

const TOTAL = storybookSpreads.length;

const BG_MUSIC_URL =
  "https://ayvgxtdwylgpsjkpiulc.supabase.co/storage/v1/object/public/Media/videoplayback.weba";

const NARRATION_BASE = "https://ayvgxtdwylgpsjkpiulc.supabase.co/storage/v1/object/public/Media";
const NARRATION_URLS: string[] = Array.from({ length: 15 }, (_, i) => `${NARRATION_BASE}/${i + 1}.mp3`);

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

function VolumeIcon({ muted }: { muted: boolean }) {
  return muted ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 5L6 9H2v6h4l5 4V5z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function StorybookContent() {
  const router = useRouter();
  const [started, setStarted] = useState(false);

  // Page state
  const [current, setCurrent] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState<1 | -1>(1);
  const [next, setNext] = useState(0);
  const [leaving, setLeaving] = useState(false);

  // Audio state
  const [bgOn, setBgOn] = useState(true);
  const [bgVol, setBgVol] = useState(0.4);
  const [narrationOn, setNarrationOn] = useState(true);
  const [narrationVol, setNarrationVol] = useState(2.0); // >1 uses GainNode boost
  const [showPlayBtn, setShowPlayBtn] = useState(true); // page 1 manual trigger

  const bgRef = useRef<HTMLAudioElement | null>(null);
  const narRef = useRef<HTMLAudioElement | null>(null);
  const narCtxRef = useRef<AudioContext | null>(null);
  const narGainRef = useRef<GainNode | null>(null);
  const currentRef = useRef(0);
  const narrationOnRef = useRef(true);

  // Init background music — only plays after user interaction (started)
  useEffect(() => {
    const audio = new Audio(BG_MUSIC_URL);
    audio.loop = true;
    audio.volume = bgVol;
    bgRef.current = audio;
    return () => { audio.pause(); audio.src = ""; };
  }, []);

  useEffect(() => {
    if (!started || !bgRef.current) return;
    if (bgOn) bgRef.current.play().catch(() => {});
  }, [started]);

  // BG music on/off
  useEffect(() => {
    if (!bgRef.current) return;
    if (bgOn) bgRef.current.play().catch(() => {});
    else bgRef.current.pause();
  }, [bgOn]);

  // BG volume
  useEffect(() => {
    if (bgRef.current) bgRef.current.volume = bgVol;
  }, [bgVol]);

  // Narration gain
  useEffect(() => {
    if (narGainRef.current) narGainRef.current.gain.value = narrationVol;
  }, [narrationVol]);

  const turnRef = useRef<(dir: 1 | -1) => void>(() => {});

  const playNarration = useCallback((index: number) => {
    const url = NARRATION_URLS[index];
    if (!url) return;
    if (narRef.current) { narRef.current.pause(); narRef.current.src = ""; }
    if (narCtxRef.current) { narCtxRef.current.close(); }

    const audio = new Audio(url);
    audio.crossOrigin = "anonymous";
    narRef.current = audio;

    // Boost volume beyond 1.0 using GainNode
    const ctx = new AudioContext();
    const gain = ctx.createGain();
    gain.gain.value = narrationVol;
    audio.addEventListener("canplay", () => {
      try {
        const src = ctx.createMediaElementSource(audio);
        src.connect(gain);
        gain.connect(ctx.destination);
      } catch {}
    }, { once: true });
    narCtxRef.current = ctx;
    narGainRef.current = gain;

    // Auto-flip to next page when narration ends
    audio.onended = () => {
      if (narrationOnRef.current && currentRef.current < TOTAL - 1) {
        turnRef.current(1);
      }
    };

    audio.play().catch(() => {});
  }, [narrationVol]);

  const stopNarration = useCallback(() => {
    if (narRef.current) { narRef.current.pause(); narRef.current.src = ""; narRef.current = null; }
    if (narCtxRef.current) { narCtxRef.current.close(); narCtxRef.current = null; }
  }, []);

  // Narration on/off toggle
  useEffect(() => {
    if (narrationOn) {
      // On page 1, only play if user already clicked the play button
      if (current === 0 && showPlayBtn) return;
      playNarration(current);
    } else {
      stopNarration();
    }
  }, [narrationOn]);

  // Preload images
  useEffect(() => {
    storybookSpreads.forEach((s) => {
      if (s.spreadImage) { const img = new Image(); img.src = s.spreadImage; }
    });
  }, []);

  const isLast = current === TOTAL - 1;

  // Keep refs in sync for use inside audio callbacks
  useEffect(() => { currentRef.current = current; }, [current]);
  useEffect(() => { narrationOnRef.current = narrationOn; }, [narrationOn]);

  const turn = (dir: 1 | -1) => {
    if (flipping) return;
    const n = current + dir;
    if (n < 0 || n >= TOTAL) return;
    setFlipDir(dir);
    setNext(n);
    setFlipping(true);
    setTimeout(() => {
      setCurrent(n);
      currentRef.current = n;
      setFlipping(false);
      setShowPlayBtn(false);
      if (narrationOnRef.current) playNarration(n);
    }, 700);
  };

  // Keep turnRef current so playNarration's onended always calls the latest turn
  useEffect(() => { turnRef.current = turn; });

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

        <div className="flex items-stretch relative" style={{
          zIndex: 1,
          filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.45)) drop-shadow(0 8px 16px rgba(0,0,0,0.3))",
        }}>
          {/* Left binding */}
          <div className="flex-none flex items-stretch" style={{ width: 26 }}>
            <div style={{ width: 12, background: PAGE_EDGES, alignSelf: "stretch" }} />
            <div style={{ width: 14, background: COVER, borderRadius: "6px 0 0 6px", boxShadow: "inset -3px 0 6px rgba(0,0,0,0.4), 2px 0 4px rgba(0,0,0,0.2)" }} />
          </div>

          {/* Pages area */}
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

                {/* Page 1 narration play button */}
                {current === 0 && showPlayBtn && !flipping && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    onClick={() => { setShowPlayBtn(false); if (narrationOn) playNarration(0); }}
                    className="absolute bottom-4 right-4 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body text-xs font-semibold shadow-lg"
                    style={{ background: "rgba(183,110,121,0.9)", color: "#FFFDF9" }}
                  >
                    ▶ Play Narration
                  </motion.button>
                )}
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
                  <div className="absolute inset-0" style={{
                    backfaceVisibility: "hidden",
                    background: "#f5edd8",
                    ...(cur.spreadImage ? halfBg(cur.spreadImage, flipDir === 1 ? "right" : "left") : {}),
                  }}>
                    {!cur.spreadImage && <Placeholder n={current + 1} />}
                    <GutterShadow side={flipDir === 1 ? "right" : "left"} />
                  </div>
                  <div className="absolute inset-0 pointer-events-none z-10" style={{
                    backfaceVisibility: "hidden",
                    animation: `pageFlipShadow${flipDir === 1 ? "Forward" : "Backward"} 0.7s cubic-bezier(0.645,0.045,0.355,1.000) forwards`,
                  }} />
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

          {/* Right binding */}
          <div className="flex-none flex items-stretch" style={{ width: 26 }}>
            <div style={{ width: 14, background: COVER, borderRadius: "0 6px 6px 0", boxShadow: "inset 3px 0 6px rgba(0,0,0,0.4), -2px 0 4px rgba(0,0,0,0.2)" }} />
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

      {/* Skip button */}
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

      {/* Tap to begin overlay */}
      {!started && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(253,246,236,0.92)" }}
        >
          <div className="flex flex-col items-center gap-6 text-center px-8">
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-3xl md:text-4xl"
              style={{ color: "#8B3A52" }}
            >
              The Days Before Me
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="font-body text-base"
              style={{ color: "#5C3D2E99" }}
            >
              as told by Sofiel
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStarted(true)}
              className="px-10 py-4 rounded-full font-body font-semibold text-lg shadow-xl"
              style={{ background: "#B76E79", color: "#FFFDF9" }}
            >
              Open the Book
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Audio Controls Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 left-4 z-40 rounded-2xl px-4 py-3 shadow-xl flex flex-col gap-3"
        style={{ background: "rgba(253,246,236,0.95)", border: "1px solid #F7C5CC", minWidth: 200 }}
      >
        {/* Background Music row */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setBgOn(v => !v)}
            className="flex-none w-7 h-7 rounded-full flex items-center justify-center transition-all"
            style={{ background: bgOn ? "#B76E79" : "#F7C5CC", color: bgOn ? "#FFFDF9" : "#8B3A52" }}
          >
            <VolumeIcon muted={!bgOn} />
          </button>
          <span className="font-body text-xs" style={{ color: "#5C3D2E", minWidth: 56 }}>BG Music</span>
          <input
            type="range" min={0} max={1} step={0.01} value={bgVol}
            onChange={e => setBgVol(Number(e.target.value))}
            disabled={!bgOn}
            className="flex-1 h-1 rounded-full accent-rose-400 disabled:opacity-30"
            style={{ accentColor: "#B76E79" }}
          />
        </div>

        {/* Narration row */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setNarrationOn(v => !v)}
            className="flex-none w-7 h-7 rounded-full flex items-center justify-center transition-all"
            style={{ background: narrationOn ? "#B76E79" : "#F7C5CC", color: narrationOn ? "#FFFDF9" : "#8B3A52" }}
          >
            <VolumeIcon muted={!narrationOn} />
          </button>
          <span className="font-body text-xs" style={{ color: "#5C3D2E", minWidth: 56 }}>Narration</span>
          <input
            type="range" min={0} max={2} step={0.05} value={narrationVol}
            onChange={e => setNarrationVol(Number(e.target.value))}
            disabled={!narrationOn}
            className="flex-1 h-1 rounded-full disabled:opacity-30"
            style={{ accentColor: "#B76E79" }}
          />
        </div>
      </motion.div>
    </div>
  );
}

export default function StorybookPage() {
  return <AuthGuard><StorybookContent /></AuthGuard>;
}
