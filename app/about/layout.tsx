export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="text-start mx-auto p-6">
      {children}
    </section>
  );
}
