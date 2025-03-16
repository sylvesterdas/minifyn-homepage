import NextLink from "next/link";
import { ArrowUpRight, Link, Clock, Globe } from "lucide-react";
import { Card } from "@heroui/card";

import ClicksChart from "@/components/dashboard/ClicksChart";
import TopURLsTable from "@/components/dashboard/TopURLsTable";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex gap-4 items-center">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <NextLink
            className="bg-slate-400 px-2 rounded-full hover:bg-slate-500"
            href="/dashboard/api-key"
          >
            API Keys
          </NextLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            change="+12%"
            icon={<Link />}
            title="Total URLs"
            value="124"
          />
          <MetricCard
            change="+5%"
            icon={<Globe />}
            title="Active URLs"
            value="89"
          />
          <MetricCard
            change="-2%"
            icon={<Clock />}
            title="Expiring Soon"
            value="15"
          />
          <MetricCard
            change="+18%"
            icon={<ArrowUpRight />}
            title="Total Clicks"
            value="1,234"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ClicksChart />
          <TopURLsTable />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, change, icon }) {
  const isPositive = change.startsWith("+");

  return (
    <Card className="p-6 bg-slate-900/70 border-slate-800/50">
      <div className="flex justify-between items-start">
        <div className="text-slate-400">{title}</div>
        <div className="p-2 bg-slate-800/50 rounded-lg">{icon}</div>
      </div>
      <div className="mt-4 text-2xl font-bold text-white">{value}</div>
      <div
        className={`mt-2 text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}
      >
        {change} from last week
      </div>
    </Card>
  );
}
