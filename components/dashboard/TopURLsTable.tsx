"use client";
import { Card } from "@heroui/card"

export default function TopURLsTable() {
  const urls = [
    { url: 'example.com/blog', clicks: 245, created: '2024-02-20' },
    { url: 'example.com/docs', clicks: 189, created: '2024-02-19' },
    { url: 'example.com/api', clicks: 156, created: '2024-02-21' },
  ]

  return (
    <Card className="p-6 bg-slate-900/70 border-slate-800/50">
      <h2 className="text-xl font-bold text-white mb-4">Top URLs</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-slate-400">
              <th className="pb-4">URL</th>
              <th className="pb-4">Clicks</th>
              <th className="pb-4">Created</th>
            </tr>
          </thead>
          <tbody className="text-slate-300">
            {urls.map((url, i) => (
              <tr key={i}>
                <td className="py-2">{url.url}</td>
                <td className="py-2">{url.clicks}</td>
                <td className="py-2">{url.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}