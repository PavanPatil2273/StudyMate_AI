import { useEffect, useRef } from 'react'
import ChatMessage from './ChatMessage'
import LoadingMessage from './LoadingMessage'
import SourceCard from './SourceCard'

export default function ChatWindow({ messages, isLoading }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [messages, isLoading])

  return (
    <div className="flex h-full flex-col overflow-y-auto px-3 pb-4 pt-4 sm:px-4 lg:px-6">
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          No messages yet.
        </div>
      ) : (
        messages.map((message) => (
          <div key={message.id}>
            <ChatMessage message={message} />

            {message.sources && message.sources.length > 0 && (
              <div className="px-2 pb-2 sm:px-4">
                <h4 className="mb-2 ml-12 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Sources
                </h4>

                <div className="ml-12 space-y-3">
                  {message.sources.map((source, index) => (
                    <SourceCard
                      key={`${source.file}-${index}`}
                      source={source}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))
      )}

      {isLoading && <LoadingMessage />}

      {/* Auto-scroll target */}
      <div ref={bottomRef} />
    </div>
  )
}