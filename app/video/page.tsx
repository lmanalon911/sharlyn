"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ParticleField from "@/components/ParticleField";
import AuthGuard from "@/components/AuthGuard";

// Replace this with a real Google Drive embed URL when ready
const VIDEO_SRC = "https://www.w3schools.com/html/mov_bbb.mp4";
const VIDEO_IS_PLACEHOLDER = true;

function VideoContent() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-10"
      style={{ background: "linear-gradient(160deg, #1a0a0e, #2d0f1a, #1a0a0e)" }}
    >
      <ParticleField count={70} />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-20" style={{ background: "#B76E79" }} />

      <div className="relative z-10 w-full max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl md:text-5xl mb-2" style={{ color: "#F7C5CC" }}>
            Your Reward, Mommy 🎁
          </h1>
          <p className="font-body italic" style={{ color: "#F7C5CC80" }}>
            Made with all the love in the world… ❤️
          </p>
        </motion.div>

        {/* Video player */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden shadow-2xl mx-auto"
          style={{
            boxShadow: "0 0 60px rgba(183, 110, 121, 0.4), 0 0 120px rgba(183, 110, 121, 0.1)",
          }}
        >
          {VIDEO_IS_PLACEHOLDER ? (
            <div
              className="w-full flex items-center justify-center rounded-3xl"
              style={{ height: "360px", background: "linear-gradient(135deg, #2d0f1a, #1a0a0e)" }}
            >
              <div className="text-center px-8">
                <motion.div
                  className="text-7xl mb-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  🎬
                </motion.div>
                <p className="font-display text-2xl mb-2" style={{ color: "#F7C5CC" }}>
                  Video Coming Soon
                </p>
                <p className="font-body text-sm" style={{ color: "#F7C5CC60" }}>
                  [Google Drive video will appear here]
                </p>
              </div>
            </div>
          ) : (
            <video
              controls
              className="w-full rounded-3xl"
              style={{ maxHeight: "500px" }}
              src={VIDEO_SRC}
            >
              Your browser does not support video.
            </video>
          )}
        </motion.div>

        {/* Google Drive embed alternative */}
        {/* Uncomment and replace FILE_ID when ready:
        <iframe
          src="https://drive.google.com/file/d/FILE_ID/preview"
          className="w-full rounded-3xl"
          style={{ height: "500px", border: "none" }}
          allow="autoplay"
        /> */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/finale")}
            className="px-10 py-4 rounded-full font-body font-semibold text-lg shadow-xl"
            style={{ background: "#B76E79", color: "#FFFDF9" }}
          >
            One More Thing… ✦
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default function VideoPage() {
  return (
    <AuthGuard>
      <VideoContent />
    </AuthGuard>
  );
}
