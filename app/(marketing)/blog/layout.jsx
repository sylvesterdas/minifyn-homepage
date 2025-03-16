export default function BlogLayout({ children }) {
  return <div className="flex flex-row flex-1">
      <main className="w-full">{children}</main>
    </div>
}