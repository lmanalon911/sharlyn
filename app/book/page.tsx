"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ParticleField from "@/components/ParticleField";
import AuthGuard from "@/components/AuthGuard";

function InvitationContent() {
  const router = useRouter();
  const [opening, setOpening] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const handleOpen = () => {
    setOpening(true);
    setTimeout(() => setLeaving(true), 400);
    setTimeout(() => router.push("/the-days-before-me"), 1100);
  };

  return (
    <motion.div className="relative min-h-screen fairytale-bg flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      <motion.div className="absolute inset-0 z-50 pointer-events-none"
        initial={{ opacity: 0 }} animate={{ opacity: leaving ? 1 : 0 }} transition={{ duration: 0.7 }}
        style={{ background: "#FFFDF9" }} />
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
            src="https://ayvgxtdwylgpsjkpiulc.supabase.co/storage/v1/object/public/Media/ChatGPT%20Image%20Jun%2025,%202026,%2009_37_22%20PM.png"
            alt="Sofiel"
            className="w-80 mx-auto -mb-12"
          />
          <motion.div
            className="absolute -top-1 left-1/2 -translate-x-1/2 text-2xl"
            animate={{ rotate: [-10, 10, -10], scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            ✨
          </motion.div>
        </motion.div>

        {/* Speech bubble as button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleOpen}
          disabled={opening}
          className="glass rounded-3xl rounded-tl-sm p-6 shadow-xl mb-6 relative w-full text-center cursor-pointer"
          style={{ border: opening ? "1.5px solid #B76E7960" : "1.5px solid rgba(247,197,204,0.3)" }}
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
            {opening ? "Opening the book… 📖✨" : "“Read tayo book?”"}
          </p>
          <p className="font-body text-sm" style={{ color: "#B76E79" }}>
            — Sofiel 🌸
          </p>
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="font-body italic text-sm"
          style={{ color: "#5C3D2E99" }}
        >
          Daddy told me all about this story.
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

export default function InvitationPage() {
  return (
    <AuthGuard>
      <InvitationContent />
    </AuthGuard>
  );
}
