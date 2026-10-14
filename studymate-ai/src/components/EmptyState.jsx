export default function EmptyState({ onSuggestionClick }) {
  const suggestions = [
    // 'What is MapReduce?',
    // 'Explain the 5 Vs of Big Data',
    // 'What is OLAP?',
  ]

  return (
    <div className="flex h-full items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl text-center">
        <div className="mb-5 text-5xl">📚</div>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">Welcome to StudyMate AI</h2>
        <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-slate-600 dark:text-slate-300">
          Chat with your college notes and understand topics faster.
        </p>

        <div className="mt-8">
          <p className="mb-4 text-sm font-medium text-slate-500 dark:text-slate-400">Try asking:</p>
          <div className="space-y-3">
            {suggestions.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => onSuggestionClick(prompt)}
                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:bg-slate-700"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
