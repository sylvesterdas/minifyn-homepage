'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { Card } from "@heroui/card"

export default function ClicksChart() {
  const data = [
    { date: '2024-02-18', clicks: 120 },
    { date: '2024-02-19', clicks: 150 },
    { date: '2024-02-20', clicks: 180 },
    { date: '2024-02-21', clicks: 190 },
    { date: '2024-02-22', clicks: 210 },
    { date: '2024-02-23', clicks: 240 },
    { date: '2024-02-24', clicks: 280 },
  ]

  return (
    <Card className="p-6 bg-slate-900/70 border-slate-800/50">
      <h2 className="text-xl font-bold text-white mb-4">Click Analytics</h2>
      <div className="h-80">
        <LineChart data={data} height={300} width={500}>
          <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip />
          <Line dataKey="clicks" stroke="#3B82F6" type="monotone" />
        </LineChart>
      </div>
    </Card>
  )
}