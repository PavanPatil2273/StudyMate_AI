
import {
  FileText,
  Plus,
  Upload,
  X,
  Trash2,
  MessageCircle,
  Pencil,
} from 'lucide-react'

export default function Sidebar({
  documents,
  chats = [],
  activeChatId,
  onNewChat,
  onSelectChat,
  onUploadClick,
  onDeleteDocument,
  onDeleteChat,
  onRenameChat,
  onClose,
  isMobile,
  isOpen,
}) {
  return (
    <>
      {/* MOBILE OVERLAY */}
      {isMobile && isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-900/40 sm:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={[
          'flex h-full flex-col border-r border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900',
          isMobile
            ? 'fixed inset-y-0 left-0 z-40 w-[82%] max-w-xs transform transition-transform duration-200'
            : 'w-full max-w-[320px]',
          isMobile && !isOpen
            ? '-translate-x-full'
            : 'translate-x-0',
        ].join(' ')}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-700">
          <button
            type="button"
            onClick={onNewChat}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            <Plus size={18} />
            New Chat
          </button>

          {isMobile && (
            <button
              type="button"
              onClick={onClose}
              className="ml-2 rounded-lg p-2 text-slate-600 dark:text-slate-200"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* CHAT HISTORY */}
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Chat History
          </div>

          {chats.length === 0 ? (
            <div className="mb-6 rounded-xl border border-dashed border-slate-300 p-4 text-center dark:border-slate-700">
              <MessageCircle
                size={24}
                className="mx-auto mb-2 text-slate-400"
              />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No previous chats
              </p>
            </div>
          ) : (
            <div className="mb-6 space-y-2">
              {chats.map((chat) => (
                <div
                  key={chat.chat_id}
                  className={[
                    'flex items-center gap-1 rounded-xl transition',
                    activeChatId === chat.chat_id
                      ? 'bg-blue-100 dark:bg-blue-500/20'
                      : 'hover:bg-slate-200 dark:hover:bg-slate-800',
                  ].join(' ')}
                >
                  {/* SELECT CHAT */}
                  <button
                    type="button"
                    onClick={() =>
                      onSelectChat?.(chat.chat_id)
                    }
                    className={[
                      'flex min-w-0 flex-1 items-center gap-2 rounded-xl px-3 py-3 text-left text-sm',
                      activeChatId === chat.chat_id
                        ? 'text-blue-700 dark:text-blue-300'
                        : 'text-slate-700 dark:text-slate-200',
                    ].join(' ')}
                    title={chat.title || 'New Chat'}
                  >
                    <MessageCircle
                      size={16}
                      className="shrink-0"
                    />

                    <span className="truncate">
                      {chat.title || 'New Chat'}
                    </span>
                  </button>

                  {/* RENAME CHAT */}
                  <button
                    type="button"
                    title="Rename chat"
                    aria-label="Rename chat"
                    onClick={(e) => {
                      e.stopPropagation()

                      const newTitle = window.prompt(
                        'Enter new chat title:',
                        chat.title || 'New Chat'
                      )

                      if (
                        newTitle &&
                        newTitle.trim()
                      ) {
                        onRenameChat?.(
                          chat.chat_id,
                          newTitle.trim()
                        )
                      }
                    }}
                    className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-300 hover:text-blue-600 dark:hover:bg-slate-700 dark:hover:text-blue-400"
                  >
                    <Pencil size={16} />
                  </button>

                  {/* DELETE CHAT */}
                  <button
                    type="button"
                    title="Delete chat"
                    aria-label="Delete chat"
                    onClick={(e) => {
                      e.stopPropagation()

                      const confirmed = window.confirm(
                        'Are you sure you want to delete this chat?'
                      )

                      if (confirmed) {
                        onDeleteChat?.(chat.chat_id)
                      }
                    }}
                    className="mr-1 shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* DOCUMENTS */}
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Documents
          </div>

          {documents.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center dark:border-slate-700">
              <FileText
                size={28}
                className="mx-auto mb-2 text-slate-400"
              />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No documents uploaded
              </p>
            </div>
          )}

          {/* DOCUMENT LIST */}
          <div className="space-y-2">
            {documents.map((document) => (
              <div
                key={
                  document.stored_filename ||
                  document.name
                }
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <FileText
                    size={15}
                    className="shrink-0 text-slate-500 dark:text-slate-400"
                  />

                  <div className="min-w-0">
                    <p className="truncate">
                      {document.name}
                    </p>

                    {document.size !== undefined && (
                      <p className="text-xs text-slate-400">
                        {document.size} MB
                      </p>
                    )}
                  </div>
                </div>

                {/* DELETE DOCUMENT */}
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()

                    onDeleteDocument?.(
                      document.stored_filename
                    )
                  }}
                  className="ml-2 shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                  aria-label={`Delete ${document.name}`}
                  title={`Delete ${document.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* UPLOAD BUTTON */}
        <div className="border-t border-slate-200 p-4 dark:border-slate-700">
          <button
            type="button"
            onClick={onUploadClick}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:bg-slate-700"
          >
            <Upload size={16} />
            Upload File
          </button>
        </div>
      </aside>
    </>
  )
}
