import DocumentCard from './DocumentCard'

export default function DocumentList({ documents, onDelete }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
      {documents.map((document) => (
        <DocumentCard key={document.id} document={document} onDelete={onDelete} />
      ))}
    </div>
  )
}
