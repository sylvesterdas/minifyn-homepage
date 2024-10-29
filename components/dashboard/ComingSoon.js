export default function ComingSoon({ title, description }) {
  return (
    <div className="text-center py-12">
      <div className="rounded-lg bg-white p-8 shadow-sm">
        <div className="mb-4 text-5xl">🚧</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">{title}</h2>
        <p className="text-gray-600 mb-6">{description}</p>
        <div className="inline-flex items-center justify-center px-4 py-2 bg-secondary/10 text-secondary rounded-lg">
          Coming Soon
        </div>
      </div>
    </div>
  );
}