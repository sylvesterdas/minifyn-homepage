export type Post = {
  id: string
  title: string
  excerpt: string
  tags: string[]
  readTime: string
  date: string
  slug: string
}

export async function getPosts(): Promise<Post[]> {
  return [
    {
      id: '1',
      title: "Optimizing JavaScript Bundle Size",
      excerpt: "Learn effective techniques to reduce your JavaScript bundle size and improve loading performance",
      tags: ["Performance", "JavaScript"],
      readTime: "5 min",
      date: "Feb 8, 2024",
      slug: "optimizing-javascript-bundle-size"
    },
    {
      id: '2',
      title: "Understanding Web Vitals",
      excerpt: "A deep dive into Core Web Vitals and how they impact your site's performance score",
      tags: ["SEO", "Performance"],
      readTime: "7 min",
      date: "Feb 7, 2024",
      slug: "understanding-web-vitals"
    },
    {
      id: '3',
      title: "CSS Best Practices",
      excerpt: "Modern CSS techniques to write maintainable and efficient stylesheets",
      tags: ["CSS", "Frontend"],
      readTime: "4 min",
      date: "Feb 6, 2024",
      slug: "css-best-practices"
    }
  ]
}