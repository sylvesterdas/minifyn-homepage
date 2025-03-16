export default function LoadingState() {
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="h-8 w-48 bg-slate-800 rounded animate-pulse mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1,2,3].map(i => (
          <div key={i} className="h-32 bg-slate-800 rounded animate-pulse" />
        ))}
      </div>
    </div>
  )
}