"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ParticleField from "@/components/ParticleField";

const PASSWORD = "simsimbibilabidabs04";

const errorMessages = [
  "Hmm… that doesn't sound right, love! 💭",
  "Nope! Try again, Mommy! 🌸",
  "So close… or maybe not! 😄",
  "The stars say that's wrong! ✨",
  "That's not it! But you'll get it! 💕",
];

export default function PasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD) {
      setLoading(true);
      document.cookie = "tdbm_auth=true; path=/; max-age=86400";
      setTimeout(() => {
        router.push("/welcome");
      }, 800);
    } else {
      const msg = errorMessages[Math.floor(Math.random() * errorMessages.length)];
      setError(msg);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setPassword("");
    }
  };

  return (
    <div className="relative min-h-screen fairytale-bg flex items-center justify-center overflow-hidden">
      <ParticleField count={50} />

      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-blush opacity-20 blur-3xl" />
      <div className="absolute bottom-[-80px] left-[-80px] w-[300px] h-[300px] rounded-full bg-lavender opacity-20 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <motion.div
          className="text-center text-4xl mb-4"
          style={{ color: "#B76E79" }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          ✦
        </motion.div>

        <div className="glass rounded-3xl p-10 shadow-2xl text-center">
          <motion.p
            className="font-body text-lg mb-8 italic"
            style={{ color: "#8B3A52cc" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            &ldquo;You know the password…&rdquo;
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="✦ ✦ ✦ ✦ ✦"
                className="w-full px-6 py-4 rounded-2xl border-2 bg-white/80 text-center text-xl tracking-widest focus:outline-none transition-colors font-display"
                style={{
                  borderColor: "#F7C5CC80",
                  color: "#8B3A52",
                }}
                autoFocus
              />
            </motion.div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.p
                  key={error}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="font-body text-sm italic"
                  style={{ color: "#B76E79" }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading || !password}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-4 rounded-2xl font-body font-semibold text-lg tracking-wide shadow-lg disabled:opacity-40 transition-all duration-300"
              style={{ background: "#B76E79", color: "#FFFDF9" }}
            >
              {loading ? "Opening… ✨" : "Open Your Birthday Gift 🎁"}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-xs mt-6 font-body" style={{ color: "#F7C5CC80" }}>
          Made with love by Lemuel & Sofiel 💕
        </p>
      </motion.div>
    </div>
  );
}
