
import { useEffect, useMemo, useState } from 'react'

import {
  BookOpen,
  FileText,
  MessageCircle,
  Plus,
  Sparkles,
  Upload,
  ArrowRight,
  Brain,
  Lightbulb,
} from 'lucide-react'

import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import ChatWindow from '../components/ChatWindow'
import ChatInput from '../components/ChatInput'
import FileUpload from '../components/FileUpload'
import Toast from '../components/Toast'

const defaultMessages = []

const suggestions = [
  {
    icon: Brain,
    title: 'Explain a topic',
    text: 'Explain this topic in simple words',
  },
  {
    icon: FileText,
    title: 'Summarize notes',
    text: 'Summarize my uploaded notes',
  },
  {
    icon: Lightbulb,
    title: 'Give examples',
    text: 'Give me examples from my notes',
  },
]

export default function Home({ onLogout }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('studymate-theme') || 'light'
  )

  const [messages, setMessages] = useState(defaultMessages)
  const [documents, setDocuments] = useState([])
  const [chatId, setChatId] = useState(null)
  const [chats, setChats] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [input, setInput] = useState('')
  const [toast, setToast] = useState(null)

  const API_URL = import.meta.env.VITE_API_URL

  // Handle expired or invalid authentication
  const handleUnauthorized = () => {
    localStorage.removeItem('studymate-token')
    localStorage.removeItem('studymate-user')
    window.location.href = '/login'
  }

  // Theme
  useEffect(() => {
    document.documentElement.classList.toggle(
      'dark',
      theme === 'dark'
    )

    localStorage.setItem('studymate-theme', theme)
  }, [theme])

  // Toast timeout
  useEffect(() => {
    if (!toast) return

    const timer = setTimeout(() => {
      setToast(null)
    }, 2500)

    return () => clearTimeout(timer)
  }, [toast])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  // Load documents
  const loadDocuments = async () => {
    try {
      const response = await fetch(`${API_URL}/documents`, {
        credentials: 'include',
      })

      if (response.status === 401) {
        handleUnauthorized()
        return
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to load documents')
      }

      setDocuments(data.documents || [])
    } catch (error) {
      console.error('Load documents error:', error)
      showToast(`Could not load documents: ${error.message}`, 'warning')
    }
  }

  // Load saved chats
  const loadChats = async () => {
    try {
      const response = await fetch(`${API_URL}/chats`, {
        method: 'GET',
        credentials: 'include',
      })

      if (response.status === 401) {
        handleUnauthorized()
        return []
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to load chats')
      }

      const loadedChats = data.chats || []
      setChats(loadedChats)

      // Keep the selected chat ID valid after refreshing the list.
      setChatId((currentId) => {
        if (
          currentId &&
          loadedChats.some((chat) => chat.chat_id === currentId)
        ) {
          return currentId
        }

        return currentId
      })

      return loadedChats
    } catch (error) {
      console.error('Error loading chats:', error)
      return []
    }
  }

  // Load initial data when the page opens
  useEffect(() => {
    loadDocuments()
    loadChats()
  }, [])

  // Send a question to the RAG backend
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userQuestion = input.trim()
    setInput('')
    setIsLoading(true)

    let currentChatId = chatId

    try {
      // Create a chat if no chat is selected
      if (!currentChatId) {
        const chatResponse = await fetch(`${API_URL}/new-chat`, {
          method: 'POST',
          credentials: 'include',
        })

        if (chatResponse.status === 401) {
          handleUnauthorized()
          return
        }

        const chatData = await chatResponse.json()

        if (!chatResponse.ok) {
          throw new Error(
            chatData.detail || 'Failed to create a new chat'
          )
        }

        currentChatId = chatData.chat_id

        if (!currentChatId) {
          throw new Error('The backend did not return a chat ID')
        }

        setChatId(currentChatId)
      }

      // Display the question
      const userMessage = {
        id: `${Date.now()}-user`,
        role: 'user',
        content: userQuestion,
      }

      setMessages((previous) => [...previous, userMessage])

      // Ask the backend
      const response = await fetch(`${API_URL}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          question: userQuestion,
          chat_id: currentChatId,
        }),
      })

      if (response.status === 401) {
        handleUnauthorized()
        return
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Something went wrong')
      }

      // Display the answer and its sources
      const assistantMessage = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content: data.answer,
        sources: data.sources || [],
      }

      setMessages((previous) => [...previous, assistantMessage])

      // Refresh sidebar after the backend saves the answer
      await loadChats()
    } catch (error) {
      console.error('Ask error:', error)

      setMessages((previous) => [
        ...previous,
        {
          id: `${Date.now()}-error`,
          role: 'assistant',
          content:
            'Sorry, I could not process your question. Please try again.',
        },
      ])

      showToast(error.message || 'Failed to get answer', 'warning')
    } finally {
      setIsLoading(false)
    }
  }

  // Start a new chat
  const handleNewChat = async () => {
    try {
      // Reuse the currently selected empty chat
      const currentChat = chats.find(
        (chat) => chat.chat_id === chatId
      )

      if (
        currentChat &&
        (!currentChat.messages || currentChat.messages.length === 0)
      ) {
        setMessages([])
        setInput('')
        setIsSidebarOpen(false)
        return
      }

      const response = await fetch(`${API_URL}/new-chat`, {
        method: 'POST',
        credentials: 'include',
      })

      if (response.status === 401) {
        handleUnauthorized()
        return
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to create chat')
      }

      setChatId(data.chat_id)
      setMessages([])
      setInput('')
      setIsSidebarOpen(false)

      await loadChats()
    } catch (error) {
      console.error('New chat error:', error)
      showToast(error.message || 'Could not create chat', 'warning')
    }
  }

  // Restore a saved conversation
  const handleSelectChat = async (selectedChatId) => {
    try {
      // Use the latest list returned by the backend
      let availableChats = chats
      let selectedChat = availableChats.find(
        (chat) => chat.chat_id === selectedChatId
      )

      if (!selectedChat) {
        availableChats = await loadChats()
        selectedChat = availableChats.find(
          (chat) => chat.chat_id === selectedChatId
        )
      }

      if (!selectedChat) {
        showToast('Chat not found. Please refresh and try again.', 'warning')
        return
      }

      setChatId(selectedChat.chat_id)

      const restoredMessages = []

      ;(selectedChat.messages || []).forEach((message, index) => {
        restoredMessages.push({
          id: `${selectedChat.chat_id}-${index}-user`,
          role: 'user',
          content: message.question,
        })

        restoredMessages.push({
          id: `${selectedChat.chat_id}-${index}-assistant`,
          role: 'assistant',
          content: message.answer,
          sources: message.sources || [],
        })
      })

      setMessages(restoredMessages)
      setInput('')
      setIsSidebarOpen(false)
    } catch (error) {
      console.error('Select chat error:', error)
      showToast('Could not open this chat', 'warning')
    }
  }

  // Delete a document
  const handleDeleteDocument = async (storedFilename) => {
    try {
      if (!storedFilename) {
        throw new Error('Stored filename is missing')
      }

      const response = await fetch(
        `${API_URL}/documents/${encodeURIComponent(storedFilename)}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )

      if (response.status === 401) {
        handleUnauthorized()
        return
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to delete document')
      }

      await loadDocuments()
      showToast('Document deleted successfully', 'success')
    } catch (error) {
      console.error('Delete document error:', error)
      showToast(error.message || 'Could not delete document', 'warning')
    }
  }

  // Delete a chat
  const handleDeleteChat = async (selectedChatId) => {
    try {
      const response = await fetch(
        `${API_URL}/chats/${encodeURIComponent(selectedChatId)}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )

      if (response.status === 401) {
        handleUnauthorized()
        return
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to delete chat')
      }

      if (chatId === selectedChatId) {
        setChatId(null)
        setMessages([])
        setInput('')
      }

      await loadChats()
      showToast('Chat deleted successfully', 'success')
    } catch (error) {
      console.error('Delete chat error:', error)
      showToast(error.message || 'Could not delete chat', 'warning')
    }
  }

  // Rename a chat
  const handleRenameChat = async (selectedChatId, newTitle) => {
    try {
      const response = await fetch(
        `${API_URL}/chats/${encodeURIComponent(selectedChatId)}/rename`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: newTitle }),
        }
      )

      if (response.status === 401) {
        handleUnauthorized()
        return
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to rename chat')
      }

      await loadChats()
      showToast('Chat renamed successfully', 'success')
    } catch (error) {
      console.error('Rename chat error:', error)
      showToast(error.message || 'Could not rename chat', 'warning')
    }
  }

  const handleAddDocument = () => {
    loadDocuments()
  }

  const handleSuggestion = (text) => {
    setInput(text)
  }

  const hasMessages = messages.length > 0

  const documentCountText = useMemo(() => {
    if (documents.length === 0) return 'No documents uploaded'
    if (documents.length === 1) return '1 document available'
    return `${documents.length} documents available`
  }, [documents])

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors duration-300 dark:bg-[#070b14] dark:text-white">
      {/* Navbar */}
      
<Navbar
  isDark={theme === 'dark'}
  onToggleTheme={() =>
    setTheme((previous) =>
      previous === 'dark' ? 'light' : 'dark'
    )
  }
  onMenuToggle={() =>
    setIsSidebarOpen((previous) => !previous)
  }
  onLogout={onLogout}
/>


      {/* Main workspace */}
      <div className="mx-auto flex h-[calc(100vh-64px)] max-w-[1800px] overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden w-[280px] shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b101c] md:block">
          <Sidebar
            documents={documents}
            chats={chats}
            activeChatId={chatId}
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
            onDeleteChat={handleDeleteChat}
            onRenameChat={handleRenameChat}
            onUploadClick={() => setIsUploadOpen(true)}
            onDeleteDocument={handleDeleteDocument}
            onClose={() => setIsSidebarOpen(false)}
            isMobile={false}
            isOpen={true}
          />
        </aside>

        {/* Mobile sidebar */}
        {isSidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />

            <div className="fixed left-0 top-16 z-50 h-[calc(100vh-64px)] w-[290px] border-r border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#0b101c] md:hidden">
              <Sidebar
                documents={documents}
                chats={chats}
                activeChatId={chatId}
                onNewChat={handleNewChat}
                onSelectChat={handleSelectChat}
                onDeleteChat={handleDeleteChat}
                onRenameChat={handleRenameChat}
                onUploadClick={() => setIsUploadOpen(true)}
                onDeleteDocument={handleDeleteDocument}
                onClose={() => setIsSidebarOpen(false)}
                isMobile={true}
                isOpen={true}
              />
            </div>
          </>
        )}

        {/* Main */}
        <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-slate-50 dark:bg-[#070b14]">
          {/* Background decoration */}
          {!hasMessages && (
            <>
              <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-500/10" />
              <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl dark:bg-indigo-500/10" />
            </>
          )}

          {/* Top workspace bar */}
          <div className="relative flex h-14 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-[#0b101c]/80 sm:px-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <Sparkles size={16} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Study Session
                </p>

                <p className="hidden text-[11px] text-slate-400 sm:block">
                  {documentCountText}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsUploadOpen(true)}
              className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-600 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-400"
            >
              <Upload
                size={14}
                className="transition-transform group-hover:-translate-y-0.5"
              />
              <span className="hidden sm:inline">Upload PDF</span>
            </button>
          </div>

          {/* Chat / empty area */}
          <div className="relative min-h-0 flex-1 overflow-y-auto">
            {!hasMessages ? (
              <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
                {/* Hero icon */}
                <div className="relative mb-7">
                  <div className="absolute inset-0 rounded-[28px] bg-blue-500/20 blur-xl" />

                  <div className="relative flex h-20 w-20 items-center justify-center rounded-[26px] border border-blue-200 bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/20 dark:border-blue-500/30">
                    <BookOpen size={34} strokeWidth={1.8} />
                  </div>

                  <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-4 border-slate-50 bg-white text-blue-600 shadow-md dark:border-[#070b14] dark:bg-slate-900 dark:text-blue-400">
                    <Sparkles size={12} />
                  </div>
                </div>

                {/* Heading */}
                <div className="text-center">
                  <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
                    Your AI Study Companion
                  </p>

                  <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                    Study smarter with
                    <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                      StudyMate AI
                    </span>
                  </h1>

                  <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                    Ask questions about your notes,
                    understand difficult concepts,
                    and get answers directly from
                    your uploaded study material.
                  </p>
                </div>

                {/* Main search card */}
                <div className="mt-9 w-full max-w-3xl">
                  <div className="rounded-3xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/50 transition-shadow hover:shadow-2xl hover:shadow-blue-100/50 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20">
                    <div className="rounded-[22px] border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                      <div className="mb-3 flex items-center gap-2 px-1">
                        <MessageCircle
                          size={16}
                          className="text-blue-500"
                        />
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          Ask anything about your documents
                        </span>
                      </div>

                      <ChatInput
                        value={input}
                        onChange={setInput}
                        onSend={handleSendMessage}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <p className="mt-3 text-center text-[11px] text-slate-400 dark:text-slate-500">
                    StudyMate AI answers using your uploaded documents
                  </p>
                </div>

                {/* Suggestions */}
                <div className="mt-9 w-full max-w-3xl">
                  <div className="mb-3 flex items-center gap-2 px-1">
                    <Sparkles
                      size={14}
                      className="text-blue-500"
                    />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Try asking
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {suggestions.map((suggestion) => {
                      const Icon = suggestion.icon

                      return (
                        <button
                          key={suggestion.title}
                          type="button"
                          onClick={() =>
                            handleSuggestion(suggestion.text)
                          }
                          className="group rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/40 dark:hover:shadow-black/20"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                              <Icon size={17} />
                            </div>

                            <ArrowRight
                              size={15}
                              className="text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-blue-500"
                            />
                          </div>

                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                            {suggestion.title}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-400 dark:text-slate-500">
                            {suggestion.text}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Upload CTA */}
                {documents.length === 0 && (
                  <button
                    type="button"
                    onClick={() => setIsUploadOpen(true)}
                    className="mt-8 flex items-center gap-2 rounded-full border border-dashed border-slate-300 px-5 py-2.5 text-xs font-medium text-slate-500 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-blue-500 dark:hover:bg-blue-500/5 dark:hover:text-blue-400"
                  >
                    <Plus size={14} />
                    Upload your first PDF
                  </button>
                )}
              </div>
            ) : (
              <div className="mx-auto h-full w-full max-w-5xl">
                <ChatWindow
                  messages={messages}
                  isLoading={isLoading}
                />
              </div>
            )}
          </div>

          {/* Bottom chat input */}
          {hasMessages && (
            <div className="relative shrink-0 border-t border-slate-200 bg-white/90 px-3 py-3 backdrop-blur-xl dark:border-slate-800 dark:bg-[#0b101c]/90 sm:px-6">
              <div className="mx-auto w-full max-w-5xl">
                <ChatInput
                  value={input}
                  onChange={setInput}
                  onSend={handleSendMessage}
                  disabled={isLoading}
                />

                <div className="mt-2 text-center text-[10px] text-slate-400 dark:text-slate-600">
                  Press Enter to send • StudyMate AI
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Upload modal */}
      {isUploadOpen && (
        <FileUpload
          onClose={() => setIsUploadOpen(false)}
          onUploadSuccess={() => {
            setIsUploadOpen(false)
            handleAddDocument()
            showToast('✓ Document uploaded successfully', 'success')
          }}
        />
      )}

      {/* Toast */}
      <Toast
        toast={toast}
        onClose={() => setToast(null)}
      />
    </div>
  )
}
