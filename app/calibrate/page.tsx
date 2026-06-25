"use client";

import { useState, useRef } from "react";

const AUDIO_URL =
  "https://ayvgxtdwylgpsjkpiulc.supabase.co/storage/v1/object/public/Media/More%20Like%20You.mp3";

const lyricLines = [
  "I've been with a lot of girls in my life",
  "high school love, a college girl who's a little wrecked",
  "a good girl praying, hands held tight",
  "a career girl, working day and night",
  "So many others came and went with time",
  "different hearts and different lives",
  "Feels like there's always someone new",
  "And every time, it was always you",
  // chorus 1
  "Now I see it in your eyes",
  "Every version still alive",
  "All the ways you had to grow",
  "Just to be the mom I know",
  "And I see you in her face",
  "In her early growing days",
  "all the love you carried through",
  "she's becoming more like you",
  // verse 2
  "We don't really fight these days",
  "Kinda funny how it changed",
  "All that fire you once had",
  "Now she's the one getting mad",
  "And you just laugh and let it go",
  "You already know how it goes",
  "How I should be chasing after",
  "this little girl who's like her mother",
  // chorus 2
  "Now I see it in your eyes",
  "Every version still alive",
  "All the ways you had to grow",
  "Just to be the mom I know",
  "And I see you in her face",
  "In her early growing days",
  "all the love you carried through",
  "she's becoming more like you",
  // refrain
  "I don't say it like I should",
  "but damn, you make this look so good",
  "'cause every day, in what you do",
  "she's becoming her because of you",
  // final chorus
  "Now I see it in this life",
  "Your little version by my side",
  "All the ways you let her grow",
  "You're the best mom I know",
  "And I see you in her face",
  "In her early growing days",
  "all the love we carried through",
  "She'll be more than me and you",
];

export default function CalibratePage() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState<"intro" | "calibrating" | "done">("intro");
  const [currentLine, setCurrentLine] = useState(0);
  const [timestamps, setTimestamps] = useState<number[]>([]);

  const startCalibration = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    await audio.play();
    setIsPlaying(true);
    setStep("calibrating");
  };

  const tap = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const t = parseFloat(audio.currentTime.toFixed(2));
    const next = [...timestamps, t];
    setTimestamps(next);
    if (currentLine + 1 >= lyricLines.length) {
      audio.pause();
      setIsPlaying(false);
      setStep("done");
    } else {
      setCurrentLine((c) => c + 1);
    }
  };

  const result = timestamps.map((t, i) => `  { t: ${t}, text: "${lyricLines[i]}" },`).join("\n");

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <audio ref={audioRef} src={AUDIO_URL} />

      {step === "intro" && (
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Lyric Calibration Tool</h1>
          <p className="text-white/60 mb-2">How it works:</p>
          <ol className="text-left text-white/70 space-y-2 mb-8 text-sm">
            <li>1. Press Start — the song begins playing</li>
            <li>2. TAP THE BUTTON the moment you hear each lyric line start</li>
            <li>3. Keep tapping for every line until the end</li>
            <li>4. Copy the result and send it to Claude</li>
          </ol>
          <button
            onClick={startCalibration}
            className="px-8 py-4 rounded-full text-lg font-semibold"
            style={{ background: "#B76E79" }}
          >
            Start
          </button>
        </div>
      )}

      {step === "calibrating" && (
        <div className="text-center max-w-lg w-full">
          <p className="text-white/40 text-sm mb-2">
            Line {currentLine + 1} of {lyricLines.length}
          </p>

          {/* Previous line */}
          {currentLine > 0 && (
            <p className="text-white/30 text-base mb-3">{lyricLines[currentLine - 1]}</p>
          )}

          {/* Current line — tap when you hear THIS */}
          <p className="text-white text-2xl font-bold mb-2">{lyricLines[currentLine]}</p>

          {/* Next line preview */}
          {currentLine + 1 < lyricLines.length && (
            <p className="text-white/30 text-base mb-8">{lyricLines[currentLine + 1]}</p>
          )}

          <button
            onClick={tap}
            onTouchStart={tap}
            className="w-40 h-40 rounded-full text-xl font-bold shadow-2xl active:scale-95 transition-transform select-none"
            style={{ background: "#B76E79" }}
          >
            TAP
          </button>

          <p className="text-white/30 text-xs mt-6">
            Tap when you HEAR the highlighted line start
          </p>
        </div>
      )}

      {step === "done" && (
        <div className="max-w-2xl w-full">
          <h2 className="text-xl font-bold mb-4 text-center">Done! Copy this and send it to Claude:</h2>
          <pre className="bg-white/10 rounded-xl p-4 text-xs overflow-auto max-h-96 text-green-300">
{`const lyrics = [\n  { t: 0, text: "" },\n${result}\n];`}
          </pre>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `const lyrics = [\n  { t: 0, text: "" },\n${result}\n];`
              );
            }}
            className="mt-4 w-full py-3 rounded-xl font-semibold"
            style={{ background: "#B76E79" }}
          >
            Copy to Clipboard
          </button>
          <button
            onClick={() => {
              setStep("intro");
              setCurrentLine(0);
              setTimestamps([]);
            }}
            className="mt-2 w-full py-3 rounded-xl font-semibold border border-white/20 text-white/60"
          >
            Redo
          </button>
        </div>
      )}
    </div>
  );
}
