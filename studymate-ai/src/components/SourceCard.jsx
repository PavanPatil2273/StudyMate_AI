export default function SourceCard({ source }) {
  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800/90">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
        <span>📄</span>
        <span>{source.file}</span>
      </div>
      <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">Page {source.page}</p>
      <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">"{source.snippet}"</p>
    </div>
  )
}
