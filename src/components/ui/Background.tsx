"use client";

import { motion } from "motion/react";

export default function Background() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-slate-950">


      {/* Luz superior izquierda */}
      <motion.div
        className="
          absolute
          w-[700px]
          h-[700px]
          rounded-full
          bg-sky-500/12
          blur-[160px]
        "
        animate={{
          x: [-80, 80, -80],
          y: [-40, 40, -40],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          top: "-250px",
          left: "-250px",
        }}
      />


      {/* Glow inferior central pequeño */}
      <motion.div
        className="
          absolute
          w-[500px]
          h-[300px]
          rounded-full
          bg-cyan-500/15
          blur-[130px]
        "
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          bottom: "-180px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />


      {/* Luz derecha corregida */}
      <motion.div
        className="
          absolute
          w-[500px]
          h-[500px]
          rounded-full
          bg-blue-500/8
          blur-[160px]
        "
        animate={{
          x: [40, -40, 40],
          y: [20, -20, 20],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          top: "120px",
          right: "-450px",
        }}
      />


      {/* Luz central */}
      <motion.div
        className="
          absolute
          w-[400px]
          h-[400px]
          rounded-full
          bg-violet-500/8
          blur-[140px]
        "
        animate={{
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          top: "35%",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />


    </div>
  );
}