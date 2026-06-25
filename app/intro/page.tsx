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

// Three independent photo tracks — bg (blurred ambiance), left card, right card
const bgTrack = [
  { id: "1v1-nTr7jqLK3EMP17lz1AgaQzehNK0ZT", t: 0   }, // sunset silhouette
  { id: "1NcK5PXkxFk01DIgDR0EMVnz89Y8KteEV", t: 25  }, // flower arch
  { id: "1SooEMiQEB3MLIVuupQswibUt_xRK3N5W", t: 50  }, // city waterfront
  { id: "11gblEdk3ZjyzFknIgQmyo-XB7q-uF1O7", t: 75  }, // beach resort
  { id: "1dnKtzEYabKCaSbYBQu8pSBHaYf2_70GY", t: 100 }, // mangrove beach
  { id: "1Mrq-YQEX4fuuvYeys_8DX4Xyhlqq3uEs", t: 125 }, // sunset arch
  { id: "12nJ2KK_di1Sdcwl-PpS1JZuT4aNZcvgH", t: 150 }, // boat couple
  { id: "1fAw3llopS7DC6DiYsW7HUI0CGgNovDEu", t: 175 }, // christmas
  { id: "1Pd_lOvO11Dk7yY1Ql0if8_P2MpDcAADF", t: 200 }, // family portrait
];

const leftTrack = [
  { id: "1N4qQnfA8a1cHr5mDMtN2E9WX9G9BY7Ju", t: 0   }, // early couple selfie
  { id: "1wvOPZomTRU-AHxBY0A8_xHY0wp9aGrwx", t: 12  }, // Sharlyn solo glasses
  { id: "1rJD8XyZdrLtmFULatEl9Zod8nkiiaOoh", t: 22  }, // Sharlyn certificate
  { id: "1UHYS4ABVhH53NQFjcvO9d_P8RgHb7sK7", t: 33  }, // Sharlyn b&w portrait
  { id: "1izH7PeHO6B23TQN25zSsuHbhsV13FNn1", t: 46  }, // couple sunflowers
  { id: "1oSRtbuTzaE9PJQeKPxeoBKK7ze0o5pf6", t: 58  }, // couple + newborn
  { id: "1NkBkBZQixRrVnseO5w-0Yz76dO3pN-EO", t: 72  }, // family christening
  { id: "1xt6CtaKmSMtfGi_f1MW0sfkNMMfk5bXI", t: 90  }, // Sofiel + mom selfie
  { id: "1YcQy4uDYd0xfT-1KY6d6ZFe5cHHFjFt2", t: 108 }, // Sofiel lifted water
  { id: "1fNdgc56KQNeaVoJAv7eE8lntJacoSsid", t: 122 }, // beach family
  { id: "1gztV-yZlPSwO0D038XTS_kZlI2iy33wv", t: 140 }, // Sharlyn+Sofiel smiling
  { id: "1EDMnrzWuRr9SDMqVBrkdYuLt9WwMvrQf", t: 157 }, // family beach
  { id: "1NcK5PXkxFk01DIgDR0EMVnz89Y8KteEV", t: 170 }, // flower arch
  { id: "1Pd_lOvO11Dk7yY1Ql0if8_P2MpDcAADF", t: 188 }, // family portrait
  { id: "1ijsoLFygZsZ811deWBbm7T7FLdsEx2XR", t: 206 }, // christmas kiss
];

const rightTrack = [
  { id: "1j34cce_q8Skb_tI2uKWtvsN0xVUiZIal", t: 0   }, // Sharlyn solo glasses 2
  { id: "1d5W1H4xaI24cC9gChQoPuULHjQEHMl8d", t: 8   }, // night lights Sharlyn
  { id: "1sPACaTsZ7QCwxhK8MXb1U-I9ALwSuGlh", t: 18  }, // Sharlyn+Lemuel landmark
  { id: "1dNsWV-PFM21rg2M5aRL_nzOo010BHAwD", t: 28  }, // couple selfie
  { id: "1S5lS2DUyoDp77D7Gtb7kpOGVMUfcN1lX", t: 39  }, // Sharlyn mountains
  { id: "1Hu_UFC7hhSNtSeVFlyhUY-NuEApVElwF", t: 52  }, // couple resort
  { id: "1MMSUV77wkcCnSWnM-rgcZa8XLOZGM2rY", t: 64  }, // Louise Sofiel sign
  { id: "1i1XyaFG-zto08-Rd2fkf0NKRH-0QPOBj", t: 78  }, // couple+baby christening
  { id: "18OIvHe4mxv4X5ELsttbcgeyAdQeyAMX_", t: 96  }, // Sharlyn + baby Sofiel
  { id: "1CdTtXrqPzJIQfuDsRcKlPm9Qjz4jo9mk", t: 112 }, // car selfie Sofiel
  { id: "1tTt9lusj5TG9XcssW6xasaq5yRi79LBS", t: 128 }, // Sharlyn beach hat
  { id: "1ZBz8ZEZBbAyn39UjPl2ZzXxbKYFOyzWg", t: 145 }, // Sharlyn+Sofiel beach selfie
  { id: "1ZRDTGw7Skdz--uS7lwwdt60dBsVah6hw", t: 162 }, // Sofiel+mom indoor
  { id: "1BcC8La_IHOEL4KVxDwYGpyyCYGd0WyGL", t: 180 }, // christmas family
  { id: "1SooEMiQEB3MLIVuupQswibUt_xRK3N5W", t: 200 }, // city boat
];

// Lyrics — shifted 2s earlier so they're in sync
const lyrics = [
  { t: 0,   text: "" },
  { t: 12,  text: "I've been with a lot of girls in my life" },
  { t: 17,  text: "high school love, a college girl who's a little wrecked" },
  { t: 22,  text: "a good girl praying, hands held tight" },
  { t: 27,  text: "a career girl, working day and night" },
  { t: 33,  text: "So many others came and went with time" },
  { t: 38,  text: "different hearts and different lives" },
  { t: 42,  text: "Feels like there's always someone new" },
  { t: 46,  text: "And every time, it was always you" },
  { t: 51,  text: "" },
  { t: 53,  text: "Now I see it in your eyes" },
  { t: 58,  text: "Every version still alive" },
  { t: 62,  text: "All the ways you had to grow" },
  { t: 66,  text: "Just to be the mom I know" },
  { t: 72,  text: "And I see you in her face" },
  { t: 76,  text: "In her early growing days" },
  { t: 80,  text: "all the love you carried through" },
  { t: 84,  text: "she's becoming more like you" },
  { t: 89,  text: "" },
  { t: 92,  text: "We don't really fight these days" },
  { t: 96,  text: "Kinda funny how it changed" },
  { t: 100, text: "All that fire you once had" },
  { t: 104, text: "Now she's the one getting mad" },
  { t: 110, text: "And you just laugh and let it go" },
  { t: 114, text: "You already know how it goes" },
  { t: 118, text: "How I should be chasing after" },
  { t: 122, text: "this little girl who's like her mother" },
  { t: 127, text: "" },
  { t: 129, text: "Now I see it in your eyes" },
  { t: 133, text: "Every version still alive" },
  { t: 137, text: "All the ways you had to grow" },
  { t: 141, text: "Just to be the mom I know" },
  { t: 147, text: "And I see you in her face" },
  { t: 151, text: "In her early growing days" },
  { t: 155, text: "all the love you carried through" },
  { t: 159, text: "she's becoming more like you" },
  { t: 164, text: "" },
  { t: 166, text: "I don't say it like I should" },
  { t: 170, text: "but damn, you make this look so good" },
  { t: 175, text: "'cause every day, in what you do" },
  { t: 179, text: "she's becoming her because of you" },
  { t: 186, text: "" },
  { t: 188, text: "Now I see it in this life" },
  { t: 192, text: "Your little version by my side" },
  { t: 196, text: "All the ways you let her grow" },
  { t: 200, text: "You're the best mom I know" },
  { t: 206, text: "And I see you in her face" },
  { t: 210, text: "In her early growing days" },
  { t: 214, text: "all the love we carried through" },
  { t: 218, text: "She'll be more than me and you" },
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

// Randomised entry animations for cards
const cardEnters = [
  { initial: { opacity: 0, scale: 0.92, y: 20 },  animate: { opacity: 1, scale: 1, y: 0 } },
  { initial: { opacity: 0, scale: 0.92, x: -30 }, animate: { opacity: 1, scale: 1, x: 0 } },
  { initial: { opacity: 0, scale: 0.92, x: 30 },  animate: { opacity: 1, scale: 1, x: 0 } },
  { initial: { opacity: 0, scale: 1.08 },          animate: { opacity: 1, scale: 1 } },
];

function PhotoCard({
  id,
  idx,
  animIdx,
  className,
  style,
}: {
  id: string;
  idx: number;
  animIdx: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const anim = cardEnters[animIdx % cardEnters.length];
  return (
    <AnimatePresence mode="sync">
      <motion.div
        key={`${id}-${idx}`}
        initial={anim.initial}
        animate={anim.animate}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className={`overflow-hidden rounded-2xl shadow-2xl ${className ?? ""}`}
        style={style}
      >
        <motion.img
          src={img(id)}
          alt=""
          className="w-full h-full object-cover"
          animate={{ scale: [1, 1.06] }}
          transition={{ duration: 14, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
        />
      </motion.div>
    </AnimatePresence>
  );
}

function IntroContent() {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [started, setStarted] = useState(false);

  const bgIdx    = getIdx(bgTrack,    currentTime);
  const leftIdx  = getIdx(leftTrack,  currentTime);
  const rightIdx = getIdx(rightTrack, currentTime);
  const lyricIdx = getIdx(lyrics,     currentTime);

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

  const curLyric  = lyrics[lyricIdx];
  const prevLyric = lyricIdx > 0 ? lyrics[lyricIdx - 1] : null;
  const nextLyric = lyricIdx < lyrics.length - 1 ? lyrics[lyricIdx + 1] : null;
  const progress  = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black flex flex-col">
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

      {/* Blurred ambient background */}
      <AnimatePresence mode="sync">
        <motion.div
          key={bgIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${img(bgTrack[bgIdx].id)})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(40px) brightness(0.3) saturate(1.4)",
            transform: "scale(1.1)",
          }}
        />
      </AnimatePresence>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />

      {/* Song title */}
      <motion.p
        className="relative z-10 text-center font-display text-white/50 text-xs tracking-widest uppercase pt-5 pb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        More Like You
      </motion.p>

      {/* Skip */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.45 }}
        whileHover={{ opacity: 1 }}
        onClick={() => router.push("/invitation")}
        className="absolute top-4 right-5 z-20 text-white text-sm font-body"
      >
        Skip →
      </motion.button>

      {/* Photo canvas */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4">
        <div className="relative w-full max-w-2xl h-full max-h-[55vh] flex items-center justify-center gap-4">

          {/* Left card — tall portrait */}
          <div className="relative h-full" style={{ width: "42%", maxHeight: "100%" }}>
            <PhotoCard
              id={leftTrack[leftIdx].id}
              idx={leftIdx}
              animIdx={leftIdx}
              className="w-full h-full"
              style={{ aspectRatio: "3/4" }}
            />
          </div>

          {/* Right column — two stacked cards */}
          <div className="flex flex-col gap-3 h-full" style={{ width: "42%", maxHeight: "100%" }}>
            <PhotoCard
              id={rightTrack[rightIdx].id}
              idx={rightIdx}
              animIdx={rightIdx + 1}
              className="w-full flex-1"
              style={{ aspectRatio: "4/3" }}
            />
            {/* Third card — pulls from left track offset by a few */}
            <PhotoCard
              id={leftTrack[(leftIdx + 3) % leftTrack.length].id}
              idx={(leftIdx + 3) % leftTrack.length}
              animIdx={rightIdx + 2}
              className="w-full flex-1"
              style={{ aspectRatio: "4/3" }}
            />
          </div>
        </div>
      </div>

      {/* Lyrics */}
      <div className="relative z-10 flex flex-col items-center gap-2 px-8 py-3 text-center min-h-[100px] justify-center">
        <AnimatePresence mode="wait">
          {prevLyric?.text ? (
            <motion.p
              key={`prev-${lyricIdx}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.32 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="font-display text-white text-xs md:text-sm"
            >
              {prevLyric.text}
            </motion.p>
          ) : <div key={`pe-${lyricIdx}`} />}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.p
            key={`cur-${lyricIdx}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="font-display text-white text-xl md:text-3xl font-medium"
            style={{ textShadow: "0 2px 20px rgba(247,197,204,0.7)" }}
          >
            {curLyric.text}
          </motion.p>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {nextLyric?.text ? (
            <motion.p
              key={`next-${lyricIdx}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="font-display text-white text-xs md:text-sm"
            >
              {nextLyric.text}
            </motion.p>
          ) : <div key={`ne-${lyricIdx}`} />}
        </AnimatePresence>
      </div>

      {/* Player bar */}
      <div className="relative z-10 px-6 pb-6 pt-2">
        <div className="max-w-lg mx-auto flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-white/45 text-xs font-body w-10 text-right tabular-nums">{fmt(currentTime)}</span>
            <div className="relative flex-1 h-1 rounded-full bg-white/20 cursor-pointer">
              <input
                type="range" min={0} max={duration || 100} step={0.1} value={currentTime}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="h-full rounded-full" style={{ width: `${progress}%`, background: "#B76E79" }} />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow pointer-events-none"
                style={{ left: `calc(${progress}% - 6px)` }}
              />
            </div>
            <span className="text-white/45 text-xs font-body w-10 tabular-nums">{fmt(duration)}</span>
          </div>
          <div className="flex justify-center">
            <button
              onClick={togglePlay}
              className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
              style={{ background: "#B76E79" }}
            >
              {isPlaying ? (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Start overlay */}
      <AnimatePresence>
        {!started && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black/60"
          >
            <motion.div
              className="text-center"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            >
              <p className="font-display text-white/85 text-3xl mb-2">A song for you, Mommy</p>
              <p className="font-body text-white/45 text-sm mb-10 italic">tap to play</p>
              <button
                onClick={togglePlay}
                className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl border-2 border-white/40 mx-auto active:scale-95 transition-transform"
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
