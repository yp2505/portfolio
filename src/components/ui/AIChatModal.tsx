'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Bot, User } from 'lucide-react'

type Message = {
  role: 'user' | 'ai'
  content: string
}

export default function AIChatModal({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "Hi! I'm Yug's AI assistant. Ask me anything about his skills, experience, or portfolio!" }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      })

      const data = await response.json()
      
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'ai', content: data.reply }])
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: 'Oops! Something went wrong communicating with my server.' }])
      }
    } catch (_error) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Error: Unable to connect to the AI.' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      style={{
        position: 'fixed',
        bottom: 90,
        right: 20,
        width: 'calc(100vw - 40px)',
        maxWidth: 380,
        height: '70vh',
        maxHeight: 600,
        backgroundColor: 'rgba(10, 10, 15, 0.75)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        borderRadius: 24,
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 9999,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(0, 0, 0, 0.2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'white', fontFamily: "'Inter', sans-serif" }}>
            Ask Yug&apos;s AI
          </h3>
        </div>
        <button
          onClick={onClose}
          style={{
            background: '#ff5f56',
            border: '1px solid #e0443e',
            borderRadius: '50%',
            width: 12,
            height: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
          }}
        />
      </div>

      {/* Messages */}
      <div
        className="custom-scroll"
        style={{
          flex: 1,
          padding: '20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: msg.role === 'ai' ? 'linear-gradient(135deg, #0284c7, #38bdf8)' : 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                flexShrink: 0,
              }}
            >
              {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
            </div>
            
            <div
              style={{
                background: msg.role === 'user' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${msg.role === 'user' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                padding: '12px 16px',
                borderRadius: 16,
                borderTopRightRadius: msg.role === 'user' ? 4 : 16,
                borderTopLeftRadius: msg.role === 'ai' ? 4 : 16,
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: 14,
                lineHeight: 1.5,
                fontFamily: "'Inter', sans-serif",
                maxWidth: '80%',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #0284c7, #38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Bot size={16} />
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px 16px', borderRadius: 16, borderTopLeftRadius: 4, display: 'flex', gap: 4 }}>
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} style={{ width: 4, height: 4, borderRadius: '50%', background: 'white' }} />
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} style={{ width: 4, height: 4, borderRadius: '50%', background: 'white' }} />
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} style={{ width: 4, height: 4, borderRadius: '50%', background: 'white' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(0, 0, 0, 0.2)' }}>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: 10 }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Yug's skills..."
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 20,
              padding: '12px 16px',
              color: 'white',
              fontSize: 14,
              fontFamily: "'Inter', sans-serif",
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.5)'}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            style={{
              background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
              border: 'none',
              borderRadius: '50%',
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: (!input.trim() || isLoading) ? 'not-allowed' : 'pointer',
              opacity: (!input.trim() || isLoading) ? 0.5 : 1,
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => { if (input.trim() && !isLoading) e.currentTarget.style.transform = 'scale(1.05)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
          >
            <Send size={18} style={{ marginLeft: 2 }} />
          </button>
        </form>
      </div>
    </motion.div>
  )
}
