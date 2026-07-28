'use client'

import { useState } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { Upload, Heart, Pin, Send } from 'lucide-react'
import useComments from '@/hooks/useComments'

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: smoothEase },
  },
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: 16,
  border: '1px solid rgba(14,165,233,0.25)',
  background: 'rgba(5,5,8,0.7)',
  padding: '12px 16px',
  outline: 'none',
  color: '#f0f0f8',
  fontSize: 14,
  fontFamily: "'Inter', sans-serif",
  transition: 'border-color 0.2s ease',
}

export default function CommentsSection() {
  const { comments, loading, addComment, likeComment } = useComments()

  const [name, setName] = useState('')
  const [comment, setComment] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    if (!name.trim() || !comment.trim()) return
    await addComment({ name, comment, image })
    setName('')
    setComment('')
    setImage(null)
    setPreview(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: smoothEase }}
      viewport={{ once: false, amount: 0.2 }}
      style={{
        borderRadius: 28,
        border: '1px solid rgba(14,165,233,0.2)',
        background: 'rgba(14,165,233,0.03)',
        backdropFilter: 'blur(20px)',
        padding: '24px',
        height: '100%',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h3
          style={{
            fontSize: 'clamp(18px, 2.5vw, 22px)',
            fontWeight: 700,
            marginBottom: 6,
            fontFamily: "'Inter', sans-serif",
            letterSpacing: '-0.02em',
          }}
        >
          Comments
        </h3>
        <p
          style={{
            fontSize: 13,
            color: 'var(--text-secondary)',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Leave your thoughts here
        </p>
      </div>

      {/* Form */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false }}
        style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}
      >
        <motion.input
          variants={itemVariants}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          style={inputStyle}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(14,165,233,0.6)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(14,165,233,0.25)')}
        />

        <motion.textarea
          variants={itemVariants}
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Your Comment"
          style={{ ...inputStyle, resize: 'none' }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(14,165,233,0.6)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(14,165,233,0.25)')}
        />

        {/* Upload */}
        <motion.label
          variants={itemVariants}
          style={{
            borderRadius: 16,
            border: '1px dashed rgba(14,165,233,0.3)',
            background: 'rgba(5,5,8,0.5)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer',
          }}
        >
          <Upload size={15} style={{ color: '#38bdf8' }} />
          <span
            style={{
              fontSize: 13,
              color: 'var(--text-secondary)',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Upload Image
          </span>
          <input hidden type="file" accept="image/*" onChange={handleImage} />
        </motion.label>

        <AnimatePresence>
          {preview && (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              src={preview}
              alt="Preview"
              style={{
                borderRadius: 16,
                height: 140,
                width: '100%',
                objectFit: 'cover',
                border: '1px solid rgba(14,165,233,0.2)',
              }}
            />
          )}
        </AnimatePresence>

        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            borderRadius: 16,
            padding: '13px 0',
            background: loading
              ? 'rgba(14,165,233,0.3)'
              : 'linear-gradient(135deg, #0369a1, #38bdf8)',
            border: 'none',
            color: 'white',
            fontSize: 14,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontFamily: "'Inter', sans-serif",
            boxShadow: loading ? 'none' : '0 4px 20px rgba(14,165,233,0.35)',
            transition: 'box-shadow 0.25s ease',
          }}
        >
          <Send size={14} />
          {loading ? 'Posting...' : 'Post Comment'}
        </motion.button>
      </motion.div>

      {/* Comments List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false }}
        className="custom-scroll"
        style={{
          borderRadius: 22,
          border: '1px solid rgba(14,165,233,0.15)',
          background: 'rgba(5,5,8,0.5)',
          padding: 12,
          height: 320,
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <AnimatePresence initial={false}>
            {comments.map((item, i) => (
              <motion.div
                key={item.id || i}
                layout
                initial={{
                  opacity: 0,
                  y: 18,
                  scale: 0.96,
                  filter: 'blur(6px)',
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: 'blur(0px)',
                }}
                exit={{ opacity: 0, y: -10, scale: 0.96 }}
                transition={{
                  duration: 0.55,
                  ease: smoothEase,
                  layout: { duration: 0.45, ease: smoothEase },
                }}
                style={{
                  borderRadius: 18,
                  border: item.is_pinned
                    ? '1px solid rgba(56,189,248,0.3)'
                    : '1px solid rgba(14,165,233,0.12)',
                  background: item.is_pinned
                    ? 'rgba(56,189,248,0.06)'
                    : 'rgba(14,165,233,0.04)',
                  padding: '12px 14px',
                }}
              >
                <div style={{ display: 'flex', gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(14,165,233,0.3), rgba(56,189,248,0.2))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#38bdf8',
                      flexShrink: 0,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {item.name?.charAt(0).toUpperCase()}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 4,
                        flexWrap: 'wrap',
                      }}
                    >
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          fontFamily: "'Inter', sans-serif",
                          color: 'var(--text-primary)',
                        }}
                      >
                        {item.name}
                      </p>

                      {item.is_pinned && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '2px 8px',
                            borderRadius: 999,
                            background: 'rgba(56,189,248,0.12)',
                            border: '1px solid rgba(56,189,248,0.2)',
                            fontSize: 10,
                            color: '#67e8f9',
                          }}
                        >
                          <Pin size={9} />
                          PINNED
                        </div>
                      )}
                    </div>

                    <p
                      style={{
                        fontSize: 13,
                        color: 'var(--text-secondary)',
                        fontFamily: "'Inter', sans-serif",
                        lineHeight: 1.5,
                      }}
                    >
                      {item.comment}
                    </p>

                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt="Comment"
                        style={{
                          marginTop: 10,
                          borderRadius: 12,
                          width: '100%',
                          maxHeight: 180,
                          objectFit: 'cover',
                          border: '1px solid rgba(14,165,233,0.15)',
                        }}
                      />
                    )}
                  </div>

                  <button
                    onClick={() => likeComment(item.id, item.likes)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2,
                      fontSize: 11,
                      color: 'rgba(56,189,248,0.5)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0 4px',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(56,189,248,0.5)')}
                  >
                    <Heart size={13} />
                    {item.likes || 0}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}