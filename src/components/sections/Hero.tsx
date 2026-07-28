"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import App from "@/components/band/App";
import TextType from "@/components/band/TextType";

const skills = ["Python", "TensorFlow", "PyTorch", "Apache Spark", "SQL", "scikit-learn"];

type HeroProps = {
  showApp: boolean;
};

export default function Hero({ showApp }: HeroProps) {
  const [startAnim, setStartAnim] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const heroPlayed = sessionStorage.getItem("heroPlayed");
    if (heroPlayed === "true") { setStartAnim(true); return; }
    const delay = 3600;
    const t1 = setTimeout(() => setStartAnim(true), delay);
    const t2 = setTimeout(() => sessionStorage.setItem("heroPlayed", "true"), delay + 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <section
      id="home"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: isMobile ? "center" : "space-between",
        flexDirection: "row",
        position: "relative",
        overflow: "hidden",
        padding: isMobile ? "80px 24px 40px" : "0 clamp(24px, 6vw, 120px)",
        gap: 40,
      }}
    >
      {/* LEFT — Text Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: isMobile ? "center" : "flex-start",
          justifyContent: "center",
          position: "relative",
          zIndex: 5,
          maxWidth: isMobile ? "100%" : 560,
          textAlign: isMobile ? "center" : "left",
        }}
      >
        {/* Available badge */}
        <motion.div
          initial={false}
          animate={
            startAnim
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 30, filter: "blur(12px)" }
          }
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 20 }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11,
              color: "#38bdf8",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "5px 14px",
              borderRadius: 999,
              border: "1px solid rgba(14,165,233,0.35)",
              background: "rgba(14,165,233,0.07)",
            }}
          >
            <span
              style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "#38bdf8",
                boxShadow: "0 0 10px rgba(56,189,248,0.9)",
                display: "inline-block",
                animation: "pulse 2s infinite",
              }}
            />
            Open to opportunities
          </span>
        </motion.div>

        {/* Main Heading */}
        <div style={{ marginBottom: 18 }}>
          <motion.h1
            initial={false}
            animate={startAnim ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: "clamp(34px, 5.5vw, 64px)",
              fontWeight: 800,
              lineHeight: 1.0,
              color: "var(--text-primary)",
              letterSpacing: "-0.04em",
              fontFamily: "'Inter', sans-serif",
              marginBottom: 0,
            }}
          >
            ML &amp; Data
          </motion.h1>

          <motion.h1
            initial={false}
            animate={startAnim ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: "clamp(34px, 5.5vw, 64px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              fontFamily: "'Inter', sans-serif",
              background: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 40%, #06b6d4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 0,
            }}
          >
            Engineer.
          </motion.h1>
        </div>

        {/* Typewriter */}
        <motion.div
          initial={false}
          animate={startAnim ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          style={{ marginBottom: 16 }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 14,
              color: "var(--text-secondary)",
              letterSpacing: "0.05em",
            }}
          >
            <TextType
              text={[
                "Machine Learning Engineer",
                "Data Engineer",
                "AI Enthusiast",
                "Python Developer",
              ]}
              typingSpeed={70}
              pauseDuration={1800}
              showCursor
              cursorCharacter="_"
              deletingSpeed={45}
              cursorBlinkDuration={0.5}
            />
          </span>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={false}
          animate={startAnim ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{ marginBottom: 28, maxWidth: 440 }}
        >
          <p
            style={{
              fontSize: 15,
              color: "var(--text-secondary)",
              lineHeight: 1.8,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Passionate about building intelligent data pipelines and machine
            learning systems that turn raw data into meaningful insights and
            real-world impact.
          </p>
        </motion.div>

        {/* Skills */}
        <motion.div
          initial="hidden"
          animate={startAnim ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.09, delayChildren: 0.65 } },
          }}
          style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 30 }}
        >
          {skills.map((skill) => (
            <motion.span
              key={skill}
              variants={{
                hidden: { opacity: 0, y: 16, scale: 0.9 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ duration: 0.45 }}
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 11,
                color: "rgba(56,189,248,0.75)",
                border: "1px solid rgba(14,165,233,0.25)",
                borderRadius: 999,
                padding: "4px 12px",
                backgroundColor: "rgba(14,165,233,0.06)",
                letterSpacing: "0.04em",
              }}
            >
              {skill}
            </motion.span>
          ))}
        </motion.div>

        {/* Footer text */}
        <motion.div
          initial={false}
          animate={startAnim ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1 }}
          style={{ display: "flex", flexDirection: "column", gap: 5 }}
        >
          <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.04em" }}>
            ↓ explore my work below
          </span>
          <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.04em" }}>
            ↗ open to full-time &amp; freelance opportunities
          </span>
        </motion.div>
      </div>

      {/* RIGHT — 3D Band (ID Card) — desktop only */}
      {!isMobile && (
        <div
          style={{
            flex: "0 0 auto",
            width: "clamp(260px, 38vw, 520px)",
            height: "100vh",
            position: "relative",
            zIndex: 40,
            pointerEvents: showApp ? "auto" : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {showApp && <App />}
        </div>
      )}

      {/* Scroll Indicator */}
      <motion.div
        initial={false}
        animate={startAnim ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.9, delay: 1.2 }}
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          pointerEvents: "none",
        }}
      >
        <motion.div
          animate={{ y: [0, 7, 0], opacity: [0.6, 0.3, 0.6] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}
        >
          <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)" }}>
            Scroll
          </span>
          <span style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1 }}>↓</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
