import { Bot, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'

  // Convert HTML <br> tags into normal line breaks
  const formattedText = message.content
    ?.replace(/<br\s*\/?>/gi, '\n')

  return (
    <div
      className={`flex ${
        isUser ? 'justify-end' : 'justify-start'
      } px-2 py-2`}
    >
      <div
        className={`flex max-w-[82%] items-start gap-3 ${
          isUser ? 'flex-row-reverse' : ''
        }`}
      >
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
            isUser
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
          }`}
        >
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        <div
          className={`rounded-2xl px-4 py-3 shadow-sm ${
            isUser
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
              : 'border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
          }`}
        >
          <div className="text-sm leading-7">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {formattedText}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}