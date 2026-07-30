"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { FileText, ArrowUpRight, Brain, Database, BarChart3 } from "lucide-react";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 35, filter: "blur(8px)" },
  show: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
  },
};

const slideLeft: Variants = {
  hidden: { opacity: 0, x: 70 },
  show: {
    opacity: 1, x: 0,
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
  },
};

const pop: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 25 },
  show: {
    opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

const highlights = [
  { icon: <Brain size={16} />, label: "Machine Learning", desc: "Building and training ML models for predictive tasks" },
  { icon: <Database size={16} />, label: "Data Engineering", desc: "Designing scalable data pipelines and ETL workflows" },
  { icon: <BarChart3 size={16} />, label: "Data Analytics", desc: "Transforming raw data into actionable insights" },
];

export default function About() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const scrollToPortfolio = () => {
    document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" });
  };

  if (isMobile === null) return null;

  return (
    <section
      id="about"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        padding: isMobile ? "80px 24px 40px" : "100px 60px 60px 120px",
      }}
    >
      <div style={{ width: "100%" }}>
        {/* Top row */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
            gap: "40px",
          }}
        >
          {/* Left: Info */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, margin: "-80px" }}
            style={{ maxWidth: 540, width: "100%" }}
          >
            {/* Label */}
            <motion.div variants={fadeUp} style={{ marginBottom: 16 }}>
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
                  border: "1px solid rgba(14,165,233,0.3)",
                  background: "rgba(14,165,233,0.06)",
                }}
              >
                About Me
              </span>
            </motion.div>

            {/* Name */}
            <motion.div variants={fadeUp}>
              <div
                style={{
                  fontSize: isMobile ? 36 : "clamp(36px, 5.5vw, 52px)",
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: "-0.04em",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <div style={{ color: "var(--text-primary)" }}>Yug</div>
                <div
                  style={{
                    background: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 50%, #06b6d4 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Patel.
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.2 } } }}
              style={{
                marginTop: 20,
                fontSize: 15,
                color: "var(--text-secondary)",
                lineHeight: 1.8,
                maxWidth: isMobile ? "100%" : "480px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Aspiring ML and Data Engineer with a passion for building intelligent
              systems and data-driven solutions. Focused on machine learning, data
              pipelines, and turning complex datasets into real-world value.
            </motion.p>

            {/* Quote */}
            <motion.div
              variants={{ hidden: { opacity: 0, scale: 0.94 }, show: { opacity: 1, scale: 1, transition: { duration: 0.9, delay: 0.3 } } }}
              style={{
                marginTop: 20,
                padding: "12px 20px",
                borderRadius: 12,
                border: "1px solid rgba(14,165,233,0.2)",
                background: "rgba(14,165,233,0.04)",
                fontSize: 13,
                fontStyle: "italic",
                display: "inline-block",
                width: "fit-content",
                color: "rgba(56,189,248,0.75)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              "Data is the new oil — I help refine it."
            </motion.div>

            {/* Buttons */}
            <motion.div
              variants={fadeUp}
              style={{ display: "flex", gap: 16, marginTop: 28, flexWrap: "wrap" }}
            >
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 22px",
                    borderRadius: 12,
                    border: "none",
                    background: "linear-gradient(135deg, #0369a1, #0ea5e9)",
                    color: "white",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    boxShadow: "0 4px 20px rgba(14,165,233,0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 28px rgba(14,165,233,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(14,165,233,0.3)";
                  }}
                >
                  <FileText size={15} />
                  Download CV
                </button>
              </a>

              <button
                onClick={scrollToPortfolio}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 22px",
                  borderRadius: 12,
                  border: "1px solid rgba(14,165,233,0.35)",
                  background: "rgba(14,165,233,0.07)",
                  color: "#38bdf8",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  transition: "transform 0.25s ease, background 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.background = "rgba(14,165,233,0.14)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.background = "rgba(14,165,233,0.07)";
                }}
              >
                <ArrowUpRight size={15} />
                View Portfolio
              </button>

              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 22px",
                  borderRadius: 12,
                  border: "1px solid rgba(14,165,233,0.25)",
                  background: "rgba(2,4,8,0.6)",
                  color: "var(--text-primary)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  transition: "transform 0.25s ease, border-color 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.borderColor = "#38bdf8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(14,165,233,0.25)";
                }}
              >
                Get In Touch
              </button>
            </motion.div>
          </motion.div>

          {/* Right: Profile Photo */}
          <motion.div
            variants={slideLeft}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false }}
            style={{
              width: isMobile ? "100%" : "40%",
              display: "flex",
              justifyContent: isMobile ? "center" : "flex-end",
              flexShrink: 0,
              marginTop: isMobile ? 48 : 0,
            }}
          >
            <div
              style={{
                position: "relative",
                transform: isMobile ? "none" : "translateX(-40px)",
              }}
            >
                {/* Glow ring */}
                <div
                  style={{
                    position: "absolute",
                    inset: -4,
                    borderRadius: "50%",
                    background: "conic-gradient(from 0deg, #0ea5e9, #06b6d4, #38bdf8, #0369a1, #0ea5e9)",
                    animation: "spin 6s linear infinite",
                    opacity: 0.6,
                  }}
                />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <div
                  style={{
                    position: "relative",
                    padding: 4,
                    borderRadius: "50%",
                    background: "var(--bg-primary)",
                  }}
                >
                  <img
                    src="/assets/yug.png"
                    alt="Yug Patel"
                    style={{
                      width: 230,
                      height: 230,
                      borderRadius: "50%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
              </div>
            </motion.div>
        </div>

        {/* Highlights Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: 16,
            marginTop: 48,
          }}
        >
          {highlights.map((item, i) => (
            <motion.div
              key={i}
              variants={pop}
              whileHover={{ scale: 1.03, y: -4 }}
              style={{
                position: "relative",
                padding: "20px 22px",
                borderRadius: 18,
                border: "1px solid rgba(14,165,233,0.18)",
                background: "rgba(8,15,26,0.8)",
                cursor: "default",
                overflow: "hidden",
              }}
            >
              {/* Top accent line */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 1,
                  background: "linear-gradient(90deg, transparent, rgba(14,165,233,0.5), transparent)",
                }}
              />

              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  border: "1px solid rgba(14,165,233,0.3)",
                  background: "rgba(14,165,233,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 14,
                  color: "#38bdf8",
                }}
              >
                {item.icon}
              </div>

              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  color: "var(--text-primary)",
                  marginBottom: 6,
                }}
              >
                {item.label}
              </div>

              <div
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: 1.6,
                }}
              >
                {item.desc}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
