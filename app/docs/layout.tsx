export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="max-w-5xl p-6">
      {children}
    </section>
  );
}
