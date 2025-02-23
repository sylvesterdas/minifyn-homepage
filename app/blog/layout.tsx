import { Sidebar } from '@/components/sidebar'

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="flex flex-row flex-1">
      <Sidebar className={"max-md:hidden"} onPress={undefined} />
      <main className="w-full">{children}</main>
    </div>
}