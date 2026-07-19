"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface FaceScanAnimationProps {
  imageBase64: string;
  messageIdx?: number;
  messages?: string[];
}

type Landmark = { cx: number; cy: number; r: number; label: string; delay: number };

const FACE_LANDMARKS: Landmark[] = [
  { cx: 100, cy: 60, r: 4, label: "forehead", delay: 0.2 },
  { cx: 75, cy: 95, r: 4, label: "left-eye", delay: 0.4 },
  { cx: 125, cy: 95, r: 4, label: "right-eye", delay: 0.5 },
  { cx: 100, cy: 100, r: 4, label: "nose-bridge", delay: 0.7 },
  { cx: 100, cy: 125, r: 4, label: "nose-tip", delay: 0.85 },
  { cx: 78, cy: 150, r: 4, label: "left-cheek", delay: 1.0 },
  { cx: 122, cy: 150, r: 4, label: "right-cheek", delay: 1.05 },
  { cx: 100, cy: 160, r: 4, label: "lips", delay: 1.2 },
  { cx: 70, cy: 120, r: 4, label: "jaw-left", delay: 1.35 },
  { cx: 130, cy: 120, r: 4, label: "jaw-right", delay: 1.4 },
  { cx: 100, cy: 185, r: 4, label: "chin", delay: 1.55 },
];

const FACE_OUTLINE_PATH = "M 60 80 Q 60 50 100 50 Q 140 50 140 80 L 140 130 Q 140 175 100 185 Q 60 175 60 130 Z";

export function FaceScanAnimation({
  imageBase64,
  messageIdx = 0,
  messages = [],
}: FaceScanAnimationProps) {
  const [landmarkIdx, setLandmarkIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLandmarkIdx((prev) => (prev + 1) % (FACE_LANDMARKS.length + 1));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-64 h-64 mx-auto">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/jpeg;base64,${imageBase64}`}
          alt="Being analyzed"
          className="w-full h-full object-cover rounded-2xl"
        />
        <div className="absolute inset-0 rounded-2xl bg-blue-900/30 mix-blend-multiply" />
      </motion.div>

      <svg
        viewBox="0 0 200 220"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="scanline-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="50%" stopColor="#60a5fa" stopOpacity="1" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <motion.path
          d={FACE_OUTLINE_PATH}
          fill="none"
          stroke="#60a5fa"
          strokeWidth="1.2"
          strokeDasharray="3 3"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.9 }}
          transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
        />

        <motion.g
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.4 } },
          }}
        >
          {FACE_LANDMARKS.map((pt, i) => (
            <motion.circle
              key={pt.label}
              cx={pt.cx}
              cy={pt.cy}
              r={pt.r}
              fill="#60a5fa"
              filter="url(#glow)"
              custom={i}
              variants={{
                hidden: { opacity: 0, scale: 0 },
                visible: {
                  opacity: [0, 1, 0.3, 1],
                  scale: [0, 1.4, 1, 1.4],
                  transition: {
                    duration: 1.2,
                    repeat: Infinity,
                    repeatDelay: 1,
                    delay: pt.delay,
                  },
                },
              }}
            />
          ))}
        </motion.g>

        {FACE_LANDMARKS.slice(0, landmarkIdx).map((pt) => {
          const w = 18;
          return (
            <motion.g
              key={`cross-${pt.label}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.6 }}
            >
              <line
                x1={pt.cx - w / 2}
                y1={pt.cy}
                x2={pt.cx + w / 2}
                y2={pt.cy}
                stroke="#fbbf24"
                strokeWidth="1"
              />
              <line
                x1={pt.cx}
                y1={pt.cy - w / 2}
                x2={pt.cx}
                y2={pt.cy + w / 2}
                stroke="#fbbf24"
                strokeWidth="1"
              />
            </motion.g>
          );
        })}

        <motion.rect
          x="0"
          y="0"
          width="200"
          height="3"
          fill="url(#scanline-grad)"
          initial={{ y: 0 }}
          animate={{ y: [0, 220, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          opacity="0.85"
        />

        <g stroke="#60a5fa" strokeWidth="2" fill="none">
          <motion.path
            d="M 6 26 L 6 6 L 26 6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          />
          <motion.path
            d="M 194 6 L 174 6 M 194 6 L 194 26"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          />
          <motion.path
            d="M 6 194 L 6 214 L 26 214"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          />
          <motion.path
            d="M 194 214 L 174 214 M 194 214 L 194 194"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          />
        </g>
      </svg>

      <motion.div
        className="absolute -top-7 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/40 text-blue-300 text-xs font-mono whitespace-nowrap"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        ◌ facial mesh mapping · {Math.round((messageIdx + 1) / (messages.length || 1) * 100)}%
      </motion.div>

      <motion.div
        className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-900/70 border border-blue-500/30 text-blue-200 text-xs font-mono whitespace-nowrap"
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {messages[messageIdx] || "analyzing..."}
      </motion.div>
    </div>
  );
}
