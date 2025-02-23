export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="max-w-5xl text-center mx-auto p-6">
      {children}
    </section>
  );
}
