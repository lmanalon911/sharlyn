"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ParticleField from "@/components/ParticleField";
import AuthGuard from "@/components/AuthGuard";

const finalMessage = `There are no words big enough
for everything you are to us.

But we tried anyway.

Because you deserve a story.
You deserve sparkles and magic and
someone to remind you every single day —

You are the best part of our lives.
You are our home.
You are our forever.

We love you more than all the
days before us,
and all the days still to come.`;

function FinaleContent() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen fairytale-bg flex flex-col items-center justify-center overflow-hidden px-4 py-12">
      <ParticleField count={70} />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] blur-3xl opacity-20" style={{ background: "radial-gradient(ellipse, #F7C5CC, transparent)" }} />

      <div className="relative z-10 w-full max-w-md text-center">
        {/* Family photo placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div
            className="w-60 h-60 mx-auto rounded-full flex items-center justify-center shadow-2xl overflow-hidden"
            style={{ background: "linear-gradient(135deg, #F7C5CC, #C9B8D8, #FFBE88)" }}
          >
            <div className="text-center">
              <div className="text-6xl mb-1">👨‍👩‍👧</div>
              <p className="font-body text-xs italic" style={{ color: "white" }}>
                [Family photo here]
              </p>
            </div>
          </div>
          <motion.div
            className="flex justify-center gap-3 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {["✦", "❤️", "✦"].map((el, i) => (
              <motion.span
                key={i}
                className="text-2xl"
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}
              >
                {el}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="glass rounded-3xl p-8 shadow-2xl mb-6"
        >
          <p className="font-body leading-8 whitespace-pre-line text-base" style={{ color: "#5C3D2E" }}>
            {finalMessage}
          </p>

          <div className="mt-6 pt-6 border-t" style={{ borderColor: "#F7C5CC50" }}>
            <p className="font-display text-xl" style={{ color: "#B76E79" }}>
              With all our love,
            </p>
            <p className="font-display text-2xl mt-1" style={{ color: "#8B3A52" }}>
              Daddy & Sofiel 💕
            </p>
          </div>
        </motion.div>

        {/* Replay button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/welcome")}
            className="px-8 py-3 rounded-full font-body font-semibold shadow-lg text-base border-2 transition-all"
            style={{ borderColor: "#B76E79", color: "#B76E79", background: "transparent" }}
          >
            Read Our Story Again 📖
          </motion.button>
        </motion.div>

        {/* Footer decoration */}
        <motion.p
          className="mt-8 font-body text-xs tracking-widest uppercase"
          style={{ color: "#F7C5CC80" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          ✦ The Days Before Me ✦
        </motion.p>
      </div>
    </div>
  );
}

export default function FinalePage() {
  return (
    <AuthGuard>
      <FinaleContent />
    </AuthGuard>
  );
}
