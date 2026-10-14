import { SendHorizonal } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export default function ChatInput({ value, onChange, onSend, disabled = false }) {
  const textareaRef = useRef(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`
    }
  }, [value])

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (!disabled && value.trim()) {
        onSend()
      }
    }
  }

  return (
    <div className="border-t border-slate-200 bg-white/90 p-3 dark:border-slate-700 dark:bg-slate-900/95">
      <div className="mx-auto flex max-w-5xl items-end gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-sm dark:border-slate-600 dark:bg-slate-800">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about your notes..."
          className="max-h-[180px] min-h-[52px] flex-1 resize-none border-0 bg-transparent px-3 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
        />

        <button
          type="button"
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:bg-blue-600 dark:hover:bg-blue-500 dark:disabled:bg-slate-700"
          aria-label="Send message"
        >
          <SendHorizonal size={18} />
        </button>
      </div>
    </div>
  )
}
