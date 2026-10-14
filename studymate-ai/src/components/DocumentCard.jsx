import { FileText, Trash2, ExternalLink } from 'lucide-react'

export default function DocumentCard({ document, onDelete }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-4 flex justify-center rounded-xl bg-slate-100 p-4 text-slate-600 dark:bg-slate-700 dark:text-slate-200">
        <FileText size={28} />
      </div>

      <div className="flex-1">
        <h3 className="truncate text-base font-semibold text-slate-800 dark:text-slate-100">{document.name}</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{document.size}</p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 pt-3 text-sm">
        <button type="button" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
          <ExternalLink size={14} />
          Open
        </button>
        <button
          type="button"
          onClick={() => onDelete(document.stored_filename)}
          className="inline-flex items-center gap-1 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  )
}
