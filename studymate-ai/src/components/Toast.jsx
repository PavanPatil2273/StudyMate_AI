import { CheckCircle, AlertTriangle, X } from 'lucide-react'

export default function Toast({ toast, onClose }) {
  if (!toast) return null

  const baseClasses = 'fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm'

  const toneClasses =
    toast.type === 'warning'
      ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-100'
      : 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-100'

  return (
    <div className={`${baseClasses} ${toneClasses}`} role="status" aria-live="polite">
      <div className="flex items-center gap-2">
        {toast.type === 'warning' ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="ml-2 rounded-full p-1 transition hover:bg-black/5 dark:hover:bg-white/10"
        aria-label="Close notification"
      >
        <X size={14} />
      </button>
    </div>
  )
}
