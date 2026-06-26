"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ParticleField from "@/components/ParticleField";
import AuthGuard from "@/components/AuthGuard";

const VIDEO_ID = "1l38rECiCjjVZPYnCZCDTrxyGXvQBbt17";
const PASSWORD = "simsimbibilabidabs04";

function MessageContent() {
  const [stage, setStage] = useState<"idle" | "password" | "video">("idle");
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handlePasswordSubmit() {
    if (input === PASSWORD) {
      setError(false);
      setStage("video");
    } else {
      setError(true);
      setInput("");
      inputRef.current?.focus();
    }
  }

  return (
    <div className="relative min-h-screen fairytale-bg flex items-center justify-center overflow-hidden">
      <ParticleField count={60} />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blush/10" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 w-full max-w-lg px-6 text-center"
      >
        {/* Daddy photo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, type: "spring" }}
          className="relative mx-auto w-52 h-52 mb-8"
        >
          <div
            className="w-full h-full rounded-full flex items-center justify-center shadow-2xl overflow-hidden"
            style={{ background: "linear-gradient(135deg, #FFBE88, #F7C5CC)" }}
          >
            <span className="text-8xl">👨</span>
          </div>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="absolute text-lg"
              style={{ top: "50%", left: "50%", transformOrigin: "0 0" }}
              animate={{
                rotate: [i * 60, i * 60 + 360],
                x: [Math.cos((i * 60 * Math.PI) / 180) * 100, Math.cos((i * 60 * Math.PI) / 180) * 100],
                y: [Math.sin((i * 60 * Math.PI) / 180) * 100, Math.sin((i * 60 * Math.PI) / 180) * 100],
              }}
              transition={{ repeat: Infinity, duration: 6, delay: i * 0.5 }}
            >
              *
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-3xl p-8 shadow-xl"
        >
          <p className="font-display text-3xl mb-4" style={{ color: "#8B3A52" }}>
            &ldquo;Wait…&rdquo;
          </p>
          <p className="font-body text-xl mb-2" style={{ color: "#5C3D2E" }}>
            &ldquo;I have one more thing…&rdquo;
          </p>

          <AnimatePresence mode="wait">
            {stage === "idle" && (
              <motion.div
                key="btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mt-6"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStage("password")}
                  className="px-8 py-3 rounded-full font-body font-semibold shadow-lg"
                  style={{ background: "#B76E79", color: "#FFFDF9" }}
                >
                  What is it?!
                </motion.button>
              </motion.div>
            )}

            {stage === "password" && (
              <motion.div
                key="password"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6"
              >
                <p className="font-body text-base mb-4" style={{ color: "#5C3D2E" }}>
                  You know the password…
                </p>
                <input
                  ref={inputRef}
                  type="password"
                  value={input}
                  onChange={(e) => { setInput(e.target.value); setError(false); }}
                  onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
                  autoFocus
                  placeholder="Type it here…"
                  className="w-full px-4 py-3 rounded-2xl text-center font-body text-base outline-none mb-3"
                  style={{
                    background: "#FDF6EC",
                    border: `2px solid ${error ? "#B76E79" : "#F7C5CC"}`,
                    color: "#5C3D2E",
                  }}
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-body text-sm mb-3"
                    style={{ color: "#B76E79" }}
                  >
                    Come on, you got this!
                  </motion.p>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePasswordSubmit}
                  className="px-8 py-3 rounded-full font-body font-semibold shadow-lg"
                  style={{ background: "#B76E79", color: "#FFFDF9" }}
                >
                  Open
                </motion.button>
              </motion.div>
            )}

            {stage === "video" && (
              <motion.div
                key="video"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-6"
              >
                <p className="font-display text-xl mb-4" style={{ color: "#8B3A52" }}>
                  A message for your eyes and ears only 💕
                </p>
                <div className="rounded-2xl overflow-hidden shadow-xl" style={{ aspectRatio: "16/9" }}>
                  <iframe
                    src={`https://drive.google.com/file/d/${VIDEO_ID}/preview`}
                    width="100%"
                    height="100%"
                    allow="autoplay"
                    allowFullScreen
                    style={{ border: "none", display: "block" }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function MessagePage() {
  return (
    <AuthGuard>
      <MessageContent />
    </AuthGuard>
  );
}
