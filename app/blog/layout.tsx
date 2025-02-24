export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="flex flex-row flex-1">
      <main className="w-full">{children}</main>
    </div>
}