import { Bot } from 'lucide-react'

export default function LoadingMessage() {
  return (
    <div className="flex justify-start px-2 py-2">
      <div className="flex max-w-[82%] items-start gap-3">

        {/* AI Icon */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
          <Bot size={16} />
        </div>

        {/* Loading bubble */}
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">

          <div className="flex items-center gap-2">

            <span className="text-sm text-slate-500 dark:text-slate-300">
              StudyMate AI is thinking
            </span>

            <span className="flex gap-1">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500" />
            </span>

          </div>

        </div>
      </div>
    </div>
  )
}