'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, Check, Trash2 } from 'lucide-react'
import { useControlCenter } from './useControlCenter'

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export default function CalendarCard() {
  const { calendarNotes, saveCalendarNote, deleteCalendarNote } = useControlCenter()
  const today = new Date()

  const [currentDate, setCurrentDate] = useState(today)
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null)
  const [noteInput, setNoteInput] = useState('')

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() // 0-indexed

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
    setSelectedDateKey(null)
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
    setSelectedDateKey(null)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDateKey(null)
  }

  // Days in month calculation
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const monthName = currentDate.toLocaleString('default', { month: 'long' })

  // Date selection handler
  const handleDateClick = (day: number) => {
    const formattedMonth = String(month + 1).padStart(2, '0')
    const formattedDay = String(day).padStart(2, '0')
    const key = `${year}-${formattedMonth}-${formattedDay}`

    setSelectedDateKey(key)
    setNoteInput(calendarNotes[key] || '')
  }

  const handleSaveNote = () => {
    if (selectedDateKey) {
      if (noteInput.trim()) {
        saveCalendarNote(selectedDateKey, noteInput.trim())
      } else {
        deleteCalendarNote(selectedDateKey)
      }
      setSelectedDateKey(null)
    }
  }

  const handleDeleteNote = () => {
    if (selectedDateKey) {
      deleteCalendarNote(selectedDateKey)
      setSelectedDateKey(null)
    }
  }

  // Build grid days
  const calendarCells = []
  // Empty leading cells
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push(<div key={`empty-${i}`} style={{ height: 26 }} />)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const formattedMonth = String(month + 1).padStart(2, '0')
    const formattedDay = String(day).padStart(2, '0')
    const dateKey = `${year}-${formattedMonth}-${formattedDay}`

    const isToday =
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day

    const hasNote = Boolean(calendarNotes[dateKey])
    const isSelected = selectedDateKey === dateKey

    calendarCells.push(
      <button
        key={`day-${day}`}
        type="button"
        onClick={() => handleDateClick(day)}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 28,
          width: 28,
          margin: '0 auto',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: isSelected
            ? '#007aff'
            : isToday
            ? 'rgba(0, 122, 255, 0.25)'
            : 'transparent',
          color: isSelected
            ? '#ffffff'
            : isToday
            ? '#38bdf8'
            : '#ffffff',
          fontWeight: isToday || isSelected ? 700 : 500,
          fontSize: 12,
          cursor: 'pointer',
          padding: 0,
          transition: 'all 0.15s ease',
        }}
        title={hasNote ? `${dateKey}: ${calendarNotes[dateKey]}` : dateKey}
      >
        <span>{day}</span>
        {hasNote && !isSelected && (
          <span
            style={{
              position: 'absolute',
              bottom: 2,
              width: 3.5,
              height: 3.5,
              borderRadius: '50%',
              backgroundColor: '#ff9f0a',
            }}
          />
        )}
      </button>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: 8,
      }}
    >
      {/* Month Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '2px 4px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>
            {monthName} {year}
          </span>
          <button
            type="button"
            onClick={goToToday}
            style={{
              background: 'none',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 6,
              padding: '1px 6px',
              fontSize: 10,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.75)',
              cursor: 'pointer',
            }}
          >
            Today
          </button>
        </div>

        <div style={{ display: 'flex', gap: 2 }}>
          <button
            type="button"
            onClick={prevMonth}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.8)',
              padding: 4,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.8)',
              padding: 4,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekdays Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          textAlign: 'center',
          fontSize: 10,
          fontWeight: 600,
          color: 'rgba(255, 255, 255, 0.4)',
        }}
      >
        {DAYS_OF_WEEK.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          rowGap: 2,
        }}
      >
        {calendarCells}
      </div>

      {/* Inline Date Note Editor Popup */}
      <AnimatePresence>
        {selectedDateKey && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            style={{
              marginTop: 4,
              padding: 8,
              borderRadius: 10,
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 11,
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 600,
              }}
            >
              <span>Note for {selectedDateKey}</span>
              <button
                type="button"
                onClick={() => setSelectedDateKey(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  padding: 2,
                }}
              >
                <X size={12} />
              </button>
            </div>

            <input
              type="text"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="e.g. Portfolio launch, Interview..."
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveNote()
                if (e.key === 'Escape') setSelectedDateKey(null)
              }}
              style={{
                width: '100%',
                padding: '6px 8px',
                borderRadius: 6,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                fontSize: 12,
                outline: 'none',
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
              {calendarNotes[selectedDateKey] && (
                <button
                  type="button"
                  onClick={handleDeleteNote}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    padding: '3px 8px',
                    borderRadius: 5,
                    backgroundColor: 'rgba(255, 69, 58, 0.2)',
                    border: '1px solid rgba(255, 69, 58, 0.4)',
                    color: '#ff453a',
                    fontSize: 11,
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 size={11} />
                  <span>Delete</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleSaveNote}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  padding: '3px 8px',
                  borderRadius: 5,
                  backgroundColor: '#007aff',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Check size={11} />
                <span>Save</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
