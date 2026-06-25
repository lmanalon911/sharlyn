"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AuthGuard from "@/components/AuthGuard";

const AUDIO_URL =
  "https://ayvgxtdwylgpsjkpiulc.supabase.co/storage/v1/object/public/Media/More%20Like%20You.mp3";

function img(id: string) {
  return `https://drive.google.com/thumbnail?id=${id}&sz=w1200`;
}

// Photos paired to song timestamps (seconds) — adjust times after first listen
const photos = [
  { url: img("1N4qQnfA8a1cHr5mDMtN2E9WX9G9BY7Ju"), t: 0,   ken: "zoom"  }, // early couple selfie
  { url: img("1wvOPZomTRU-AHxBY0A8_xHY0wp9aGrwx"), t: 14,  ken: "left"  }, // Sharlyn solo glasses
  { url: img("1rJD8XyZdrLtmFULatEl9Zod8nkiiaOoh"), t: 21,  ken: "right" }, // Sharlyn certificate
  { url: img("1UHYS4ABVhH53NQFjcvO9d_P8RgHb7sK7"), t: 33,  ken: "zoom"  }, // Sharlyn b&w portrait
  { url: img("1dNsWV-PFM21rg2M5aRL_nzOo010BHAwD"), t: 46,  ken: "left"  }, // couple selfie (it was always you)
  { url: img("1izH7PeHO6B23TQN25zSsuHbhsV13FNn1"), t: 53,  ken: "zoom"  }, // couple with sunflowers
  { url: img("1oSRtbuTzaE9PJQeKPxeoBKK7ze0o5pf6"), t: 66,  ken: "right" }, // couple + newborn Sofiel
  { url: img("1MMSUV77wkcCnSWnM-rgcZa8XLOZGM2rY"), t: 72,  ken: "zoom"  }, // Louise Sofiel sign
  { url: img("1NkBkBZQixRrVnseO5w-0Yz76dO3pN-EO"), t: 85,  ken: "left"  }, // family christening
  { url: img("18OIvHe4mxv4X5ELsttbcgeyAdQeyAMX_"), t: 94,  ken: "zoom"  }, // Sharlyn + young Sofiel
  { url: img("1xt6CtaKmSMtfGi_f1MW0sfkNMMfk5bXI"), t: 106, ken: "right" }, // Sofiel + mom selfie
  { url: img("1YcQy4uDYd0xfT-1KY6d6ZFe5cHHFjFt2"), t: 113, ken: "zoom"  }, // Sofiel lifted in water
  { url: img("16ntA5w0yFBCRgAqLrB4rovsgd6TrWgqb"), t: 124, ken: "left"  }, // Sofiel in car
  { url: img("1fNdgc56KQNeaVoJAv7eE8lntJacoSsid"), t: 131, ken: "zoom"  }, // beach family
  { url: img("1gztV-yZlPSwO0D038XTS_kZlI2iy33wv"), t: 149, ken: "right" }, // Sharlyn + Sofiel smiling
  { url: img("1EDMnrzWuRr9SDMqVBrkdYuLt9WwMvrQf"), t: 161, ken: "zoom"  }, // family beach
  { url: img("1v1-nTr7jqLK3EMP17lz1AgaQzehNK0ZT"), t: 168, ken: "left"  }, // sunset silhouette
  { url: img("1NcK5PXkxFk01DIgDR0EMVnz89Y8KteEV"), t: 177, ken: "zoom"  }, // flower arch sunset
  { url: img("1Pd_lOvO11Dk7yY1Ql0if8_P2MpDcAADF"), t: 190, ken: "right" }, // family portrait studio
  { url: img("1ijsoLFygZsZ811deWBbm7T7FLdsEx2XR"), t: 208, ken: "zoom"  }, // Christmas kiss
  { url: img("1SooEMiQEB3MLIVuupQswibUt_xRK3N5W"), t: 220, ken: "left"  }, // city waterfront couple
];

// Lyrics with timestamps (seconds)
const lyrics = [
  { t: 0,   text: "" },
  { t: 14,  text: "I've been with a lot of girls in my life" },
  { t: 19,  text: "high school love, a college girl who's a little wrecked" },
  { t: 24,  text: "a good girl praying, hands held tight" },
  { t: 29,  text: "a career girl, working day and night" },
  { t: 35,  text: "So many others came and went with time" },
  { t: 40,  text: "different hearts and different lives" },
  { t: 44,  text: "Feels like there's always someone new" },
  { t: 48,  text: "And every time, it was always you" },
  { t: 53,  text: "" },
  { t: 55,  text: "Now I see it in your eyes" },
  { t: 60,  text: "Every version still alive" },
  { t: 64,  text: "All the ways you had to grow" },
  { t: 68,  text: "Just to be the mom I know" },
  { t: 74,  text: "And I see you in her face" },
  { t: 78,  text: "In her early growing days" },
  { t: 82,  text: "all the love you carried through" },
  { t: 86,  text: "she's becoming more like you" },
  { t: 91,  text: "" },
  { t: 94,  text: "We don't really fight these days" },
  { t: 98,  text: "Kinda funny how it changed" },
  { t: 102, text: "All that fire you once had" },
  { t: 106, text: "Now she's the one getting mad" },
  { t: 112, text: "And you just laugh and let it go" },
  { t: 116, text: "You already know how it goes" },
  { t: 120, text: "How I should be chasing after" },
  { t: 124, text: "this little girl who's like her mother" },
  { t: 129, text: "" },
  { t: 131, text: "Now I see it in your eyes" },
  { t: 135, text: "Every version still alive" },
  { t: 139, text: "All the ways you had to grow" },
  { t: 143, text: "Just to be the mom I know" },
  { t: 149, text: "And I see you in her face" },
  { t: 153, text: "In her early growing days" },
  { t: 157, text: "all the love you carried through" },
  { t: 161, text: "she's becoming more like you" },
  { t: 166, text: "" },
  { t: 168, text: "I don't say it like I should" },
  { t: 172, text: "but damn, you make this look so good" },
  { t: 177, text: "'cause every day, in what you do" },
  { t: 181, text: "she's becoming her because of you" },
  { t: 188, text: "" },
  { t: 190, text: "Now I see it in this life" },
  { t: 194, text: "Your little version by my side" },
  { t: 198, text: "All the ways you let her grow" },
  { t: 202, text: "You're the best mom I know" },
  { t: 208, text: "And I see you in her face" },
  { t: 212, text: "In her early growing days" },
  { t: 216, text: "all the love we carried through" },
  { t: 220, text: "She'll be more than me and you" },
];

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

const kenVariants: Record<string, { initial: Record<string, number>; animate: Record<string, number> }> = {
  zoom:  { initial: { scale: 1.12 }, animate: { scale: 1.0 } },
  left:  { initial: { scale: 1.08, x: 30 }, animate: { scale: 1.0, x: 0 } },
  right: { initial: { scale: 1.08, x: -30 }, animate: { scale: 1.0, x: 0 } },
};

function IntroContent() {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [lyricIdx, setLyricIdx] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    let pi = 0;
    for (let i = photos.length - 1; i >= 0; i--) {
      if (currentTime >= photos[i].t) { pi = i; break; }
    }
    setPhotoIdx(pi);

    let li = 0;
    for (let i = lyrics.length - 1; i >= 0; i--) {
      if (currentTime >= lyrics[i].t) { li = i; break; }
    }
    setLyricIdx(li);
  }, [currentTime]);

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

  const photo = photos[photoIdx];
  const curLyric = lyrics[lyricIdx];
  const prevLyric = lyricIdx > 0 ? lyrics[lyricIdx - 1] : null;
  const nextLyric = lyricIdx < lyrics.length - 1 ? lyrics[lyricIdx + 1] : null;
  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <audio
        ref={audioRef}
        src={AUDIO_URL}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => {
          setIsPlaying(false);
          setTimeout(() => router.push("/invitation"), 2500);
        }}
      />

      {/* Background photo with Ken Burns effect */}
      <AnimatePresence mode="sync">
        <motion.div
          key={photoIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <motion.div
            initial={kenVariants[photo.ken].initial}
            animate={kenVariants[photo.ken].animate}
            transition={{ duration: 18, ease: "linear" }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${photo.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/35 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.05) 45%, rgba(0,0,0,0.25) 100%)",
        }}
      />

      {/* Song title */}
      <motion.p
        className="absolute top-6 left-0 right-0 text-center font-display text-white/60 text-sm tracking-widest uppercase z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        More Like You
      </motion.p>

      {/* Skip */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        whileHover={{ opacity: 1 }}
        onClick={() => router.push("/invitation")}
        className="absolute top-5 right-6 z-20 text-white text-sm font-body"
      >
        Skip →
      </motion.button>

      {/* Start overlay */}
      <AnimatePresence>
        {!started && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-20"
          >
            <motion.div
              className="text-center"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            >
              <p className="font-display text-white/85 text-3xl mb-2">A song for you, Mommy</p>
              <p className="font-body text-white/45 text-sm mb-10 italic">tap to play</p>
              <button
                onClick={togglePlay}
                className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl border-2 border-white/40 mx-auto transition-transform active:scale-95"
                style={{ background: "rgba(183,110,121,0.85)" }}
              >
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lyrics display */}
      <AnimatePresence>
        {started && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute bottom-36 left-0 right-0 flex flex-col items-center gap-3 px-8 z-10 text-center"
          >
            {/* Previous line */}
            <AnimatePresence mode="wait">
              {prevLyric?.text ? (
                <motion.p
                  key={`prev-${lyricIdx}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.35 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="font-display text-white text-sm md:text-base"
                >
                  {prevLyric.text}
                </motion.p>
              ) : (
                <div key={`prev-empty-${lyricIdx}`} className="h-5" />
              )}
            </AnimatePresence>

            {/* Current line */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`cur-${lyricIdx}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.45 }}
                className="font-display text-white text-2xl md:text-4xl font-medium"
                style={{
                  textShadow:
                    "0 2px 24px rgba(247,197,204,0.6), 0 0 40px rgba(183,110,121,0.3)",
                }}
              >
                {curLyric.text}
              </motion.p>
            </AnimatePresence>

            {/* Next line */}
            <AnimatePresence mode="wait">
              {nextLyric?.text ? (
                <motion.p
                  key={`next-${lyricIdx}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.2 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="font-display text-white text-sm md:text-base"
                >
                  {nextLyric.text}
                </motion.p>
              ) : (
                <div key={`next-empty-${lyricIdx}`} className="h-5" />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Player bar */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-8 pt-6"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 70%, transparent)" }}
      >
        <div className="max-w-lg mx-auto flex flex-col gap-4">
          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <span className="text-white/50 text-xs font-body w-10 text-right tabular-nums">
              {fmt(currentTime)}
            </span>
            <div className="relative flex-1 h-1 rounded-full bg-white/20 cursor-pointer">
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div
                className="h-full rounded-full"
                style={{ width: `${progress}%`, background: "#B76E79" }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md pointer-events-none"
                style={{ left: `calc(${progress}% - 6px)` }}
              />
            </div>
            <span className="text-white/50 text-xs font-body w-10 tabular-nums">
              {fmt(duration)}
            </span>
          </div>

          {/* Play/Pause */}
          <div className="flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95"
              style={{ background: "#B76E79" }}
            >
              {isPlaying ? (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function IntroPage() {
  return (
    <AuthGuard>
      <IntroContent />
    </AuthGuard>
  );
}
