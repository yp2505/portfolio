'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Code2, ExternalLink, FolderKanban, GitFork, Mail, Terminal, UserRound } from 'lucide-react'
import usePortfolio from '@/hooks/usePortfolio'
import styles from './PortfolioOsDesktop.module.css'

type AppId = 'about' | 'projects' | 'contact' | 'terminal'

const apps: Array<{ id: AppId; label: string; icon: typeof UserRound; tint: string }> = [
  { id: 'about', label: 'About Yug', icon: UserRound, tint: '#67e8f9' },
  { id: 'projects', label: 'Projects', icon: FolderKanban, tint: '#60a5fa' },
  { id: 'contact', label: 'Contact', icon: Mail, tint: '#c4b5fd' },
  { id: 'terminal', label: 'Terminal', icon: Terminal, tint: '#86efac' },
]

const terminalCommands = {
  whoami: 'Yug Patel — Data Engineer & Machine Learning Engineer',
  skills: 'Python · SQL · Spark · PyTorch · TensorFlow · Next.js',
  contact: 'Open the Contact app, or email yugpatel2505@gmail.com.',
}

export default function PortfolioOsDesktop() {
  const [activeApp, setActiveApp] = useState<AppId>('about')
  const [terminalLine, setTerminalLine] = useState(terminalCommands.whoami)
  const { projects, loading } = usePortfolio()
  const active = apps.find((app) => app.id === activeApp) ?? apps[0]

  const openApp = (app: AppId) => setActiveApp(app)

  return (
    <section className={styles.desktop} aria-label="Portfolio OS desktop">
      <header className={styles.menuBar}>
        <div className={styles.brand}><span className={styles.brandDot} />Yug OS</div>
        <span className={styles.menuTitle}>{active.label}</span>
        <span className={styles.status}>● Online</span>
      </header>

      <div className={styles.workspace}>
        <nav className={styles.launcher} aria-label="Portfolio OS applications">
          {apps.map((app) => {
            const Icon = app.icon
            const isActive = app.id === activeApp

            return (
              <button
                className={`${styles.appIcon} ${isActive ? styles.appIconActive : ''}`}
                key={app.id}
                onClick={() => openApp(app.id)}
                aria-pressed={isActive}
                type="button"
              >
                <span className={styles.iconTile} style={{ color: app.tint }}><Icon aria-hidden="true" size={24} strokeWidth={1.7} /></span>
                <span>{app.label}</span>
              </button>
            )
          })}
        </nav>

        <main className={styles.window}>
          <div className={styles.windowBar}>
            <div className={styles.windowControls} aria-hidden="true"><i /><i /><i /></div>
            <span>{active.label}</span>
            <span className={styles.windowLocation}>/home/yug/{activeApp}</span>
          </div>

          <div className={styles.content}>
            {activeApp === 'about' && <AboutApp openApp={openApp} />}
            {activeApp === 'projects' && <ProjectsApp projects={projects} loading={loading} />}
            {activeApp === 'contact' && <ContactApp />}
            {activeApp === 'terminal' && (
              <TerminalApp output={terminalLine} onCommand={(command) => setTerminalLine(terminalCommands[command])} />
            )}
          </div>
        </main>
      </div>

      <nav className={styles.dock} aria-label="Quick app launcher">
        {apps.map((app) => {
          const Icon = app.icon
          return (
            <button key={app.id} type="button" onClick={() => openApp(app.id)} aria-label={`Open ${app.label}`}>
              <Icon aria-hidden="true" size={18} style={{ color: app.tint }} />
            </button>
          )
        })}
      </nav>
    </section>
  )
}

function AboutApp({ openApp }: { openApp: (app: AppId) => void }) {
  return (
    <div className={styles.about}>
      <div className={styles.avatarWrap}>
        <Image src="/assets/yug.png" alt="Yug Patel" className={styles.avatar} width={126} height={126} priority />
      </div>
      <div>
        <p className={styles.eyebrow}>DATA & MACHINE LEARNING</p>
        <h1>Yug Patel</h1>
        <p className={styles.lead}>I build intelligent systems and practical data products—from reliable pipelines to edge AI experiences.</p>
        <div className={styles.actions}>
          <button type="button" onClick={() => openApp('projects')}><FolderKanban size={15} />View projects</button>
          <button type="button" className={styles.secondaryAction} onClick={() => openApp('contact')}><Mail size={15} />Contact me</button>
        </div>
      </div>
      <div className={styles.skillPanel}>
        <span>System capabilities</span>
        <div className={styles.tags}>{['Python', 'SQL', 'Spark', 'PyTorch', 'TensorFlow', 'Next.js'].map((skill) => <b key={skill}>{skill}</b>)}</div>
      </div>
    </div>
  )
}

function ProjectsApp({ projects, loading }: { projects: ReturnType<typeof usePortfolio>['projects']; loading: boolean }) {
  if (loading) return <p className={styles.muted}>Loading projects…</p>

  return (
    <div>
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>SELECTED WORK</p><h1>Projects</h1></div><Code2 aria-hidden="true" size={26} /></div>
      <div className={styles.projectGrid}>
        {projects.map((project) => (
          <article className={styles.projectCard} key={project.id}>
            <div className={styles.projectCardTop}><span>{project.status === 'completed' ? 'Shipped' : 'In progress'}</span><FolderKanban aria-hidden="true" size={18} /></div>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <div className={styles.tags}>{project.tech.slice(0, 4).map((tech) => <b key={tech}>{tech}</b>)}</div>
            <a href={project.github_url} target="_blank" rel="noreferrer"><GitFork size={15} />View source <ExternalLink size={13} /></a>
          </article>
        ))}
      </div>
    </div>
  )
}

function ContactApp() {
  return (
    <div className={styles.contact}>
      <p className={styles.eyebrow}>LET&apos;S BUILD SOMETHING USEFUL</p>
      <h1>Get in touch</h1>
      <p className={styles.lead}>Interested in an ML collaboration, data project, or a conversation about building practical AI?</p>
      <div className={styles.contactLinks}>
        <a href="mailto:yugpatel2505@gmail.com"><Mail size={18} />Email Yug</a>
        <a href="https://github.com/yp2505" target="_blank" rel="noreferrer"><GitFork size={18} />GitHub <ExternalLink size={14} /></a>
      </div>
    </div>
  )
}

function TerminalApp({ output, onCommand }: { output: string; onCommand: (command: keyof typeof terminalCommands) => void }) {
  return (
    <div className={styles.terminal}>
      <p><span>yug@portfolio:~$</span> whoami</p>
      <p className={styles.terminalOutput}>{output}</p>
      <div className={styles.commandRow}>
        {(Object.keys(terminalCommands) as Array<keyof typeof terminalCommands>).map((command) => (
          <button key={command} type="button" onClick={() => onCommand(command)}>{command}</button>
        ))}
      </div>
      <p><span>yug@portfolio:~$</span> <i>click a command above</i></p>
    </div>
  )
}
