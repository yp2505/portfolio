import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const systemPrompt = `You are the AI assistant for Yug Patel, a Data Engineer and Machine Learning Engineer. 
Your ONLY purpose is to answer questions about Yug, his portfolio, his skills (Python, TensorFlow, PyTorch, Spark, SQL, scikit-learn), his experience, and his projects.
If the user asks anything unrelated to Yug Patel, politely decline and steer the conversation back to Yug.
Keep your responses friendly, professional, and concise. Do not use markdown formatting like **bold** unless necessary.

User's question: ${message}`

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt }
            ]
          }
        ]
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Gemini API Error:', data)
      return NextResponse.json({ error: 'Error generating response' }, { status: 500 })
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that."

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
