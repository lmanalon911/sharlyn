"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ParticleField from "@/components/ParticleField";
import AuthGuard from "@/components/AuthGuard";

function InvitationContent() {
  const router = useRouter();
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    setOpening(true);
    setTimeout(() => {
      router.push("/storybook");
    }, 1200);
  };

  return (
    <div className="relative min-h-screen fairytale-bg flex items-center justify-center overflow-hidden">
      <ParticleField count={55} />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-[-50px] w-[200px] h-[200px] rounded-full blur-3xl opacity-30" style={{ background: "#C9B8D8" }} />
        <div className="absolute bottom-1/4 right-[-50px] w-[200px] h-[200px] rounded-full blur-3xl opacity-30" style={{ background: "#F7C5CC" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-sm px-6 text-center"
      >
        {/* Sofiel character */}
        <motion.div
          animate={opening ? { scale: [1, 1.2, 0], opacity: [1, 1, 0] } : { y: [0, -10, 0] }}
          transition={opening ? { duration: 0.8 } : { repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="mb-6 relative"
        >
          <img
            src="https://ayvgxtdwylgpsjkpiulc.supabase.co/storage/v1/object/public/Media/ChatGPT%20Image%20Jun%2025,%202026,%2001_55_10%20AM.png"
            alt="Sofiel"
            className="w-48 mx-auto drop-shadow-2xl"
          />
          <motion.div
            className="absolute -top-1 left-1/2 -translate-x-1/2 text-2xl"
            animate={{ rotate: [-10, 10, -10], scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            ✨
          </motion.div>
        </motion.div>

        {/* Speech bubble */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-3xl rounded-tl-sm p-6 shadow-xl mb-6 relative"
        >
          <div
            className="absolute -top-3 left-8 w-0 h-0"
            style={{
              borderLeft: "12px solid transparent",
              borderRight: "12px solid transparent",
              borderBottom: "12px solid rgba(255,253,249,0.6)",
            }}
          />
          <p className="font-display text-2xl mb-1" style={{ color: "#8B3A52" }}>
            &ldquo;Read tayo book?&rdquo;
          </p>
          <p className="font-body text-sm" style={{ color: "#B76E79" }}>
            — Sofiel 🌸
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="space-y-3"
        >
          <p className="font-body italic text-sm" style={{ color: "#5C3D2E99" }}>
            Daddy told me all about this story.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpen}
            disabled={opening}
            className="w-full py-4 rounded-2xl font-body font-semibold text-lg shadow-xl transition-all"
            style={{ background: "#B76E79", color: "#FFFDF9" }}
          >
            {opening ? "Opening the book… 📖✨" : "Read the Book 📖"}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function InvitationPage() {
  return (
    <AuthGuard>
      <InvitationContent />
    </AuthGuard>
  );
}
