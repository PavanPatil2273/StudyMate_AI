import { useRef, useState } from 'react'
import { Upload, X, FileText } from 'lucide-react'

export default function FileUpload({
  onClose,
  onUploadSuccess,
  onAddDocument,
  showToast,
}) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  const fileInputRef = useRef(null)

  // Handle expired / invalid JWT
  const handleUnauthorized = () => {
    localStorage.removeItem('studymate-token')
    localStorage.removeItem('studymate-user')

    window.location.href = '/login'
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]

    if (!file) return

    if (file.type !== 'application/pdf') {
      showToast?.(
        'Please select a PDF file',
        'warning'
      )
      return
    }

    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (isUploading) return

    if (!selectedFile) {
      showToast?.(
        'Please select a PDF first',
        'warning'
      )
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()

      formData.append(
        'file',
        selectedFile
      )

      const token =
        localStorage.getItem(
          'studymate-token'
        )

      const response = await fetch(
  `${import.meta.env.VITE_API_URL}/upload`,
  {
    method: 'POST',

    // Send HTTP-only authentication cookie
    credentials: 'include',

    // Do NOT set Content-Type manually.
    // Browser automatically sets multipart/form-data.
    body: formData,
  }
)

      // JWT expired or invalid
      if (response.status === 401) {
        handleUnauthorized()
        return
      }

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail ||
          'Upload failed'
        )
      }

      console.log(
        'Backend response:',
        data
      )

      // Support existing document callback
      onAddDocument?.({
        name: data.filename,
        size: selectedFile.size,
      })

      // Notify Home that upload succeeded
      onUploadSuccess?.(data)

      showToast?.(
        `${data.filename} uploaded successfully`,
        'success'
      )

      setSelectedFile(null)

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

    } catch (error) {
      console.error(
        'Upload error:',
        error
      )

      showToast?.(
        `Upload failed: ${error.message}`,
        'warning'
      )

    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    if (isUploading) return

    onClose?.()

    setSelectedFile(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={handleClose}
    >

      {/* POPUP BOX */}
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        {/* HEADER */}
        <div className="mb-5 flex items-center justify-between">

          <div>
            { <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Upload PDF
            </h2> }

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Choose a PDF file to add to your notes
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isUploading}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>

        </div>

        {/* FILE SELECT AREA */}
        <div
          onClick={() =>
            fileInputRef.current?.click()
          }
          className="cursor-pointer rounded-xl border-2 border-dashed border-slate-300 p-8 text-center transition hover:border-blue-500 hover:bg-blue-50 dark:border-slate-600 dark:hover:border-blue-500 dark:hover:bg-slate-800"
        >

          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
            <Upload size={26} />
          </div>

          <p className="font-semibold text-slate-700 dark:text-slate-200">
            Click to choose PDF
          </p>

          <p className="mt-1 text-xs text-slate-400">
            PDF files only
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />

        </div>

        {/* SELECTED FILE */}
        {selectedFile && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <FileText size={20} />
            </div>

            <div className="min-w-0 flex-1">

              <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
                {selectedFile.name}
              </p>

              <p className="text-xs text-slate-400">
                {(
                  selectedFile.size /
                  1024 /
                  1024
                ).toFixed(2)} MB
              </p>

            </div>

          </div>
        )}

        {/* BUTTONS */}
        <div className="mt-6 flex gap-3">

          <button
            type="button"
            onClick={handleClose}
            disabled={isUploading}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleUpload}
            disabled={
              !selectedFile ||
              isUploading
            }
            className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
          >
            {isUploading
              ? 'Uploading...'
              : 'Upload PDF'}
          </button>

        </div>

      </div>

    </div>
  )
}