"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AuthGuard from "@/components/AuthGuard";

const AUDIO_URL =
  "https://ayvgxtdwylgpsjkpiulc.supabase.co/storage/v1/object/public/Media/More%20Like%20You.mp3";

function img(id: string) {
  return `https://drive.google.com/thumbnail?id=${id}&sz=w1200`;
}

// Scenes matched to song sections — each defines what's on screen and when
// layout: "single" | "duo"
const scenes = [
  // Intro
  { t: 0,      layout: "single", photos: ["1N4qQnfA8a1cHr5mDMtN2E9WX9G9BY7Ju"] },
  // Verse 1 — her younger days / different versions of Sharlyn
  { t: 12.84,  layout: "duo",    photos: ["1wvOPZomTRU-AHxBY0A8_xHY0wp9aGrwx", "1rJD8XyZdrLtmFULatEl9Zod8nkiiaOoh"] },
  { t: 23.53,  layout: "duo",    photos: ["1UHYS4ABVhH53NQFjcvO9d_P8RgHb7sK7", "1j34cce_q8Skb_tI2uKWtvsN0xVUiZIal"] },
  { t: 34.58,  layout: "duo",    photos: ["1dNsWV-PFM21rg2M5aRL_nzOo010BHAwD", "1izH7PeHO6B23TQN25zSsuHbhsV13FNn1"] },
  // Chorus 1 — the mom I know / I see you in her face
  { t: 45.88,  layout: "duo",    photos: ["1oSRtbuTzaE9PJQeKPxeoBKK7ze0o5pf6", "1MMSUV77wkcCnSWnM-rgcZa8XLOZGM2rY"] },
  { t: 56.71,  layout: "duo",    photos: ["1NkBkBZQixRrVnseO5w-0Yz76dO3pN-EO", "1i1XyaFG-zto08-Rd2fkf0NKRH-0QPOBj"] },
  // Instrumental break
  { t: 67.5,   layout: "single", photos: ["1Hu_UFC7hhSNtSeVFlyhUY-NuEApVElwF"] },
  // Verse 2 — Sofiel growing / she's getting spunky
  { t: 78.16,  layout: "duo",    photos: ["18OIvHe4mxv4X5ELsttbcgeyAdQeyAMX_", "1xt6CtaKmSMtfGi_f1MW0sfkNMMfk5bXI"] },
  { t: 88.76,  layout: "duo",    photos: ["1YcQy4uDYd0xfT-1KY6d6ZFe5cHHFjFt2", "1CdTtXrqPzJIQfuDsRcKlPm9Qjz4jo9mk"] },
  // Chorus 2
  { t: 99.84,  layout: "duo",    photos: ["1fNdgc56KQNeaVoJAv7eE8lntJacoSsid", "1gztV-yZlPSwO0D038XTS_kZlI2iy33wv"] },
  { t: 110.61, layout: "duo",    photos: ["1EDMnrzWuRr9SDMqVBrkdYuLt9WwMvrQf", "1ZBz8ZEZBbAyn39UjPl2ZzXxbKYFOyzWg"] },
  // Refrain — emotional peak
  { t: 120.5,  layout: "single", photos: ["1v1-nTr7jqLK3EMP17lz1AgaQzehNK0ZT"] },
  { t: 126.34, layout: "single", photos: ["1NcK5PXkxFk01DIgDR0EMVnz89Y8KteEV"] },
  { t: 137.34, layout: "duo",    photos: ["1p1D_SDwUOxxRWh4N7pnWCJWgoFLb3RfJ", "1ZRDTGw7Skdz--uS7lwwdt60dBsVah6hw"] },
  // Final chorus — all of you together
  { t: 143.08, layout: "duo",    photos: ["1Pd_lOvO11Dk7yY1Ql0if8_P2MpDcAADF", "1fAw3llopS7DC6DiYsW7HUI0CGgNovDEu"] },
  { t: 153.53, layout: "duo",    photos: ["1ijsoLFygZsZ811deWBbm7T7FLdsEx2XR", "1BcC8La_IHOEL4KVxDwYGpyyCYGd0WyGL"] },
  { t: 161.57, layout: "single", photos: ["1SooEMiQEB3MLIVuupQswibUt_xRK3N5W"] },
];

// Calibrated timestamps minus 1s to fix latency
const lyrics = [
  { t: 0,      text: "" },
  { t: 11.84,  text: "I've been with a lot of girls in my life" },
  { t: 17.16,  text: "high school love, a college girl who's a little wrecked" },
  { t: 22.53,  text: "a good girl praying, hands held tight" },
  { t: 27.72,  text: "a career girl, working day and night" },
  { t: 33.58,  text: "So many others came and went with time" },
  { t: 36.7,   text: "different hearts and different lives" },
  { t: 39.13,  text: "Feels like there's always someone new" },
  { t: 42.13,  text: "And every time, it was always you" },
  { t: 44.88,  text: "Now I see it in your eyes" },
  { t: 47.55,  text: "Every version still alive" },
  { t: 50.23,  text: "All the ways you had to grow" },
  { t: 53,     text: "Just to be the mom I know" },
  { t: 55.71,  text: "And I see you in her face" },
  { t: 58.41,  text: "In her early growing days" },
  { t: 61.1,   text: "all the love you carried through" },
  { t: 63.81,  text: "she's becoming more like you" },
  { t: 66.5,   text: "" },
  { t: 77.16,  text: "We don't really fight these days" },
  { t: 79.94,  text: "Kinda funny how it changed" },
  { t: 82.66,  text: "All that fire you once had" },
  { t: 84.71,  text: "Now she's the one getting mad" },
  { t: 87.76,  text: "And you just laugh and let it go" },
  { t: 90.16,  text: "You already know how it goes" },
  { t: 93.13,  text: "How I should be chasing after" },
  { t: 96.08,  text: "this little girl who's like her mother" },
  { t: 98.84,  text: "Now I see it in your eyes" },
  { t: 101.47, text: "Every version still alive" },
  { t: 104.23, text: "All the ways you had to grow" },
  { t: 106.93, text: "Just to be the mom I know" },
  { t: 109.61, text: "And I see you in her face" },
  { t: 112.29, text: "In her early growing days" },
  { t: 114.97, text: "all the love you carried through" },
  { t: 117.63, text: "she's becoming more like you" },
  { t: 119.5,  text: "" },
  { t: 121.24, text: "I don't say it like I should" },
  { t: 125.34, text: "but damn, you make this look so good" },
  { t: 130.72, text: "'cause every day, in what you do" },
  { t: 136.34, text: "she's becoming her because of you" },
  { t: 140,    text: "" },
  { t: 142.08, text: "Now I see it in this life" },
  { t: 144.29, text: "Your little version by my side" },
  { t: 147.1,  text: "All the ways you let her grow" },
  { t: 149.49, text: "You're the best mom I know" },
  { t: 152.53, text: "And I see you in her face" },
  { t: 155.1,  text: "In her early growing days" },
  { t: 157.89, text: "all the love we carried through" },
  { t: 160.57, text: "She'll be more than me and you" },
];

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function getIdx<T extends { t: number }>(track: T[], time: number): number {
  let idx = 0;
  for (let i = track.length - 1; i >= 0; i--) {
    if (time >= track[i].t) { idx = i; break; }
  }
  return idx;
}

// A single photo with slow Ken Burns — uses contain so no faces get cropped
function KenBurnsPhoto({ src, kenKey }: { src: string; kenKey: string }) {
  const anims = ["ken-zoom", "ken-left", "ken-right", "ken-zoom-out"];
  const anim = anims[Math.abs(kenKey.charCodeAt(0) + kenKey.charCodeAt(4)) % anims.length];
  return (
    <div className="w-full h-full overflow-hidden rounded-2xl shadow-xl flex items-center justify-center bg-black/20">
      <img
        src={src}
        alt=""
        className={`w-full h-full object-contain ${anim}`}
        style={{ maxHeight: "100%", maxWidth: "100%" }}
      />
    </div>
  );
}

function IntroContent() {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [started, setStarted] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const navigateNext = useCallback(() => {
    setLeaving(true);
    setTimeout(() => router.push("/book"), 700);
  }, [router]);

  const sceneIdx = getIdx(scenes, currentTime);
  const lyricIdx = getIdx(lyrics, currentTime);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!started) setStarted(true);
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      await audio.play();
      setIsPlaying(true);
    }
  }, [isPlaying, started]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const t = parseFloat(e.target.value);
    audio.currentTime = t;
    setCurrentTime(t);
  };

  const scene    = scenes[sceneIdx];
  const curLyric = lyrics[lyricIdx];
  const prevLyric = lyricIdx > 0 ? lyrics[lyricIdx - 1] : null;
  const nextLyric = lyricIdx < lyrics.length - 1 ? lyrics[lyricIdx + 1] : null;
  const progress  = duration ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      className="relative w-full h-screen overflow-hidden fairytale-bg flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <motion.div className="absolute inset-0 z-50 pointer-events-none"
        initial={{ opacity: 0 }} animate={{ opacity: leaving ? 1 : 0 }} transition={{ duration: 0.7 }}
        style={{ background: "#FFFDF9" }} />
      <audio
        ref={audioRef}
        src={AUDIO_URL}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => { setIsPlaying(false); setTimeout(() => navigateNext(), 2500); }}
      />

      {/* Song title */}
      <p className="relative z-10 text-center font-display text-white/40 text-xs tracking-widest uppercase pt-5 pb-1">
        More Like You
      </p>

      {/* Skip */}
      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} whileHover={{ opacity: 1 }}
        onClick={() => navigateNext()}
        className="absolute top-4 right-5 z-20 text-white text-sm font-body"
      >
        Skip →
      </motion.button>

      {/* Photo area */}
      <div className="relative z-10 flex-1 px-5 pt-2 pb-1 min-h-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={sceneIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-x-5 top-2 bottom-1 flex gap-3"
          >
            {scene.layout === "single" && (
              <KenBurnsPhoto src={img(scene.photos[0])} kenKey={scene.photos[0]} />
            )}
            {scene.layout === "duo" && (
              <>
                <div className="flex-1 h-full">
                  <KenBurnsPhoto src={img(scene.photos[0])} kenKey={scene.photos[0]} />
                </div>
                <div className="flex-1 h-full">
                  <KenBurnsPhoto src={img(scene.photos[1])} kenKey={scene.photos[1]} />
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Lyrics */}
      <div className="relative z-10 flex flex-col items-center gap-1 px-8 py-3 text-center" style={{ minHeight: 96 }}>
        <AnimatePresence mode="wait">
          {prevLyric?.text ? (
            <motion.p key={`p${lyricIdx}`} initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }} className="font-display text-white text-xs md:text-sm">
              {prevLyric.text}
            </motion.p>
          ) : <div key={`pe${lyricIdx}`} className="h-4" />}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.p
            key={`c${lyricIdx}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="font-display text-white text-xl md:text-3xl font-medium"
            style={{ textShadow: "0 2px 20px rgba(247,197,204,0.8)" }}
          >
            {curLyric.text}
          </motion.p>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {nextLyric?.text && curLyric.text ? (
            <motion.p key={`n${lyricIdx}`} initial={{ opacity: 0 }} animate={{ opacity: 0.18 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }} className="font-display text-white text-xs md:text-sm">
              {nextLyric.text}
            </motion.p>
          ) : <div key={`ne${lyricIdx}`} className="h-4" />}
        </AnimatePresence>
      </div>

      {/* Player */}
      <div className="relative z-10 px-6 pb-6 pt-1">
        <div className="max-w-lg mx-auto flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-white/40 text-xs font-body w-10 text-right tabular-nums">{fmt(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 cursor-pointer rounded-full outline-none appearance-none"
              style={{
                background: `linear-gradient(to right, #B76E79 ${progress}%, rgba(255,255,255,0.2) ${progress}%)`,
                accentColor: "#B76E79",
              }}
            />
            <span className="text-white/40 text-xs font-body w-10 tabular-nums">{fmt(duration)}</span>
          </div>
          <div className="flex justify-center">
            <button onClick={togglePlay}
              className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
              style={{ background: "#B76E79" }}>
              {isPlaying
                ? <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                : <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              }
            </button>
          </div>
        </div>
      </div>

      {/* Start overlay */}
      <AnimatePresence>
        {!started && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black/70">
            <motion.div className="text-center" animate={{ scale: [1, 1.03, 1] }} transition={{ repeat: Infinity, duration: 2.5 }}>
              <p className="font-display text-white/90 text-4xl mb-3">More Like You</p>
              <p className="font-body text-white/55 text-sm mb-10 italic max-w-xs mx-auto leading-relaxed">You may not always believe it, but I've always seen you as your best self all along.</p>
              <button onClick={togglePlay}
                className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl border-2 border-white/40 mx-auto active:scale-95 transition-transform"
                style={{ background: "rgba(183,110,121,0.85)" }}>
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function IntroPage() {
  return <AuthGuard><IntroContent /></AuthGuard>;
}
