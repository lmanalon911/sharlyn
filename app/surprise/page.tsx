"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ParticleField from "@/components/ParticleField";
import AuthGuard from "@/components/AuthGuard";

function SurpriseContent() {
  const router = useRouter();
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="relative min-h-screen fairytale-bg flex items-center justify-center overflow-hidden">
      <ParticleField count={60} />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blush/10" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 w-full max-w-md px-6 text-center"
      >
        {/* Daddy photo placeholder */}
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
          {/* Halo sparkle */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="absolute text-lg"
              style={{
                top: "50%",
                left: "50%",
                transformOrigin: "0 0",
              }}
              animate={{
                rotate: [i * 60, i * 60 + 360],
                x: [Math.cos((i * 60 * Math.PI) / 180) * 100, Math.cos((i * 60 * Math.PI) / 180) * 100],
                y: [Math.sin((i * 60 * Math.PI) / 180) * 100, Math.sin((i * 60 * Math.PI) / 180) * 100],
              }}
              transition={{ repeat: Infinity, duration: 6, delay: i * 0.5 }}
            >
              ✨
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

          <AnimatePresence>
            {!revealed ? (
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
                  onClick={() => setRevealed(true)}
                  className="px-8 py-3 rounded-full font-body font-semibold shadow-lg"
                  style={{ background: "#B76E79", color: "#FFFDF9" }}
                >
                  What is it?! 👀
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="reveal"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="mt-6"
              >
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ scale: [1, 1.3, 1], rotate: [-5, 5, -5, 0] }}
                  transition={{ duration: 0.8 }}
                >
                  🎉
                </motion.div>
                <p className="font-display text-2xl mb-2" style={{ color: "#8B3A52" }}>
                  A little game!
                </p>
                <p className="font-body text-base mb-6" style={{ color: "#5C3D2E" }}>
                  Sofiel made something special for you… 💕
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/game")}
                  className="px-8 py-3 rounded-full font-body font-semibold shadow-lg"
                  style={{ background: "#B76E79", color: "#FFFDF9" }}
                >
                  Let&apos;s Play! 🌸
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function SurprisePage() {
  return (
    <AuthGuard>
      <SurpriseContent />
    </AuthGuard>
  );
}
