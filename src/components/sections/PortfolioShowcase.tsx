'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Award, Lock, Sparkles, FolderGit2 } from 'lucide-react'
import usePortfolio from '@/hooks/usePortfolio'
import PortfolioCard from './PortfolioCard'

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function PortfolioShowcase() {
  const { projects, certificates, techStacks, loading } = usePortfolio()
  const [activeTab, setActiveTab] = useState('projects')
  const [showAllProjects, setShowAllProjects] = useState(false)

  const displayedProjects = showAllProjects ? projects : projects.slice(0, 3)

  const tabStyle = (tab: string): React.CSSProperties => ({
    flex: 1,
    borderRadius: 999,
    padding: '10px 0',
    fontSize: 13,
    fontFamily: "'Inter', sans-serif",
    fontWeight: activeTab === tab ? 600 : 400,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: activeTab === tab
      ? 'linear-gradient(135deg, rgba(3,105,161,0.4), rgba(14,165,233,0.25))'
      : 'transparent',
    color: activeTab === tab ? '#38bdf8' : 'rgba(232,244,255,0.4)',
    boxShadow: activeTab === tab
      ? 'inset 0 0 0 1px rgba(14,165,233,0.3)'
      : 'none',
  })

  return (
    <>
      <section
        id="portfolio"
        style={{ marginBottom: 140, paddingBottom: 80 }}
        className="w-full max-w-[1450px] mx-auto px-6 md:px-12 lg:px-20 pt-28 text-white"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-center mb-10"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{
              display: 'inline-block',
              marginBottom: 14,
              fontSize: 11,
              color: '#38bdf8',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              padding: '5px 14px',
              borderRadius: 999,
              border: '1px solid rgba(14,165,233,0.3)',
              background: 'rgba(14,165,233,0.06)',
              fontFamily: 'var(--font-mono), monospace',
            }}
          >
            My Work
          </motion.span>

          <h1
            className="text-3xl md:text-5xl font-extrabold mb-3"
            style={{
              letterSpacing: '-0.03em',
              fontFamily: "'Inter', sans-serif",
              background: 'linear-gradient(135deg, #e8f4ff 0%, #38bdf8 50%, #0ea5e9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Portfolio Showcase
          </h1>

          <p
            className="max-w-xl mx-auto text-sm md:text-base"
            style={{ color: 'var(--text-secondary)', fontFamily: "'Inter', sans-serif" }}
          >
            Explore my ML projects, technical stack, and upcoming certifications.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div
            className="w-full max-w-3xl p-2 flex gap-2"
            style={{
              borderRadius: 999,
              border: '1px solid rgba(14,165,233,0.2)',
              background: 'rgba(14,165,233,0.03)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {['projects', 'certificates'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab)
                  if (tab !== 'projects') setShowAllProjects(false)
                }}
                style={tabStyle(tab)}
              >
                {tab === 'projects' ? 'Projects' : 'Certificates'}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
          >
            {/* PROJECTS */}
            {activeTab === 'projects' && (
              <div className="space-y-8">
                <motion.div
                  layout
                  transition={{ layout: { duration: 0.75, ease: smoothEase } }}
                  className="grid md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  <AnimatePresence mode="popLayout">
                    {!loading && displayedProjects.map((item, i) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 40, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.5, delay: i * 0.04 }}
                      >
                        <PortfolioCard
                          index={i}
                          id={item.id}
                          title={item.title}
                          description={item.description}
                          image={item.image_url}
                          github_url={item.github_url}
                          tech={item.tech}
                          status={item.status}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {!loading && projects.length > 3 && (
                  <div className="flex justify-center">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setShowAllProjects(!showAllProjects)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '12px 28px',
                        borderRadius: 999,
                        border: '1px solid rgba(14,165,233,0.25)',
                        background: 'rgba(14,165,233,0.06)',
                        color: '#38bdf8',
                        fontSize: 13,
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {showAllProjects ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      {showAllProjects ? 'Show Less' : 'Show All Projects'}
                    </motion.button>
                  </div>
                )}
              </div>
            )}

            {/* CERTIFICATES */}
            {activeTab === 'certificates' && (
              <div className="flex justify-center py-10">
                <motion.div
                  initial={{ opacity: 0, y: 25, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    borderRadius: 24,
                    border: '1px solid rgba(14,165,233,0.2)',
                    background: 'rgba(8,15,26,0.85)',
                    backdropFilter: 'blur(16px)',
                    padding: '48px 32px',
                    maxWidth: 600,
                    width: '100%',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 16,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.6), transparent)' }} />
                  
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      border: '1px solid rgba(14,165,233,0.3)',
                      background: 'rgba(14,165,233,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#38bdf8',
                      boxShadow: '0 0 25px rgba(14,165,233,0.2)',
                    }}
                  >
                    <Award size={32} />
                  </div>

                  <div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif", marginBottom: 8 }}>
                      Certifications Coming Soon &amp; Building
                    </h3>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', fontFamily: "'Inter', sans-serif", lineHeight: 1.6, maxWidth: 460 }}>
                      Currently pursuing Machine Learning &amp; Data Engineering certifications. Verified credentials will be posted here as they are earned.
                    </p>
                  </div>

                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 12,
                      fontFamily: 'var(--font-mono), monospace',
                      color: '#38bdf8',
                      padding: '6px 16px',
                      borderRadius: 999,
                      border: '1px solid rgba(14,165,233,0.25)',
                      background: 'rgba(14,165,233,0.06)',
                      marginTop: 8,
                    }}
                  >
                    <Lock size={12} />
                    Status: In Progress
                  </span>
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* STANDALONE TECH STACK SECTION */}
        <div className="mt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2
              className="text-2xl md:text-4xl font-bold mb-4"
              style={{
                fontFamily: "'Inter', sans-serif",
                background: 'linear-gradient(135deg, #e8f4ff 0%, #38bdf8 50%, #0ea5e9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              My Tech Stack
            </h2>
            <p
              className="max-w-2xl mx-auto text-sm md:text-base"
              style={{ color: 'var(--text-secondary)', fontFamily: "'Inter', sans-serif" }}
            >
              The tools, languages, and frameworks I use to build scalable data pipelines and intelligent machine learning models.
            </p>
          </motion.div>

          <div className="flex justify-center">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 max-w-5xl w-full">
              {!loading && techStacks?.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.85, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.03 }}
                  whileHover={{ y: -6, scale: 1.05 }}
                  style={{
                    borderRadius: 20,
                    border: '1px solid rgba(14,165,233,0.15)',
                    background: 'rgba(8,15,26,0.8)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    height: 110,
                    padding: '12px 8px',
                    cursor: 'default',
                    transition: 'border-color 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ position: 'absolute', width: 60, height: 60, borderRadius: '50%', background: 'rgba(14,165,233,0.15)', filter: 'blur(16px)', opacity: 0, transition: 'opacity 0.3s ease' }} className="group-hover:opacity-100" />
                    {item.logo_url ? (
                      <img
                        src={item.logo_url}
                        alt={item.name}
                        style={{ width: 40, height: 40, objectFit: 'contain', position: 'relative', zIndex: 1 }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                    ) : (
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(14,165,233,0.1)' }} />
                    )}
                  </div>
                  <p style={{ fontSize: 11, color: 'rgba(232,244,255,0.7)', textAlign: 'center', lineHeight: 1.3, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                    {item.name}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}