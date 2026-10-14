
import { useEffect, useState } from 'react'
import { Search, FileText } from 'lucide-react'
import DocumentList from '../components/DocumentList'
import Toast from '../components/Toast'
import Navbar from '../components/Navbar'

export default function Documents() {
  const [documents, setDocuments] = useState([])
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState(null)
  const [deletingFilename, setDeletingFilename] = useState(null)

  const [theme, setTheme] = useState(
    () => localStorage.getItem('studymate-theme') || 'light'
  )

  const API_URL = import.meta.env.VITE_API_URL

  // Handle expired or invalid login
  const handleUnauthorized = () => {
    localStorage.removeItem('studymate-token')
    localStorage.removeItem('studymate-user')
    window.location.href = '/login'
  }

  // Show toast message
  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  // Apply saved theme
  useEffect(() => {
    document.documentElement.classList.toggle(
      'dark',
      theme === 'dark'
    )

    localStorage.setItem('studymate-theme', theme)
  }, [theme])

  // Load documents from FastAPI
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
        throw new Error(
          data.detail || 'Failed to load documents'
        )
      }

      const backendDocuments = (data.documents || []).map(
        (document, index) => ({
          id: `${document.stored_filename || document.name}-${index}`,
          name: document.name,
          stored_filename: document.stored_filename,
          size: `${document.size} MB`,
        })
      )

      setDocuments(backendDocuments)
    } catch (error) {
      console.error('Load documents error:', error)

      showToast(
        `Could not load documents: ${error.message}`,
        'warning'
      )
    }
  }

  // Load documents when page opens
  useEffect(() => {
    loadDocuments()
  }, [])

  // Search documents
  const filteredDocuments = documents.filter((document) =>
    document.name.toLowerCase().includes(search.toLowerCase())
  )

  // Delete document using its unique stored filename
  const handleDeleteDocument = async (storedFilename) => {
    if (!storedFilename) {
      showToast('Stored filename is missing', 'warning')
      return
    }

    // Prevent duplicate deletion of the same document
    if (deletingFilename === storedFilename) {
      return
    }

    setDeletingFilename(storedFilename)

    try {
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
        throw new Error(data.detail || 'Delete failed')
      }

      // Remove the deleted document from the UI
      setDocuments((previousDocuments) =>
        previousDocuments.filter(
          (document) =>
            document.stored_filename !== storedFilename
        )
      )

      showToast('Document deleted successfully', 'success')
    } catch (error) {
      console.error('Delete document error:', error)

      showToast(
        error.message || 'Could not delete document',
        'warning'
      )
    } finally {
      setDeletingFilename(null)
    }
  }

  return (
    <>
      {/* NAVBAR */}
      <Navbar
        isDark={theme === 'dark'}
        onToggleTheme={() =>
          setTheme((previous) =>
            previous === 'dark' ? 'light' : 'dark'
          )
        }
        onMenuToggle={() => {}}
      />

      {/* DOCUMENTS PAGE */}
      <div className="min-h-[calc(100vh-64px)] bg-slate-100 px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              My Documents
            </h1>
          </div>

          {/* SEARCH */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <Search
                size={18}
                className="text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search documents..."
                className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* DOCUMENTS */}
          {filteredDocuments.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <FileText
                  className="text-slate-500"
                  size={28}
                />
              </div>

              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                No documents found
              </h2>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {search
                  ? 'Try a different search name.'
                  : 'Upload a PDF to get started.'}
              </p>
            </div>
          ) : (
            <DocumentList
              documents={filteredDocuments}
              onDelete={handleDeleteDocument}
            />
          )}
        </div>

        {/* TOAST */}
        <Toast
          toast={toast}
          onClose={() => setToast(null)}
        />
      </div>
    </>
  )
}
