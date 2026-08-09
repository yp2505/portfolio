'use client'

import { useState } from 'react'

export default function useComments() {
  const [comments, setComments] = useState<unknown[]>([
    {
      id: 1,
      name: "Guest",
      comment: "Looks great! We can connect Notion later.",
      likes: 10,
      created_at: new Date().toISOString()
    }
  ])
  const [loading, setLoading] = useState(false)

  const addComment = async ({
    name,
    comment,
  }: {
    name: string
    comment: string
  }) => {
    if (!name.trim()) return
    if (!comment.trim()) return

    setLoading(true)
    setTimeout(() => {
      const newComment = {
        id: Date.now(),
        name,
        comment,
        likes: 0,
        created_at: new Date().toISOString()
      }
      setComments((prev) => [newComment, ...prev])
      setLoading(false)
    }, 500)
  }

  const likeComment = async (
    id: number,
    currentLikes: number
  ) => {
    const liked = localStorage.getItem(`liked-${id}`)

    if (liked) return

    localStorage.setItem(`liked-${id}`, 'true')

    setComments((prev) =>
      prev.map((item: unknown) =>
        (item as { id: number }).id === id
          ? { ...(item as { id: number; likes: number }), likes: currentLikes + 1 }
          : item
      )
    )
  }

  return {
    comments,
    loading,
    addComment,
    likeComment,
  }
}