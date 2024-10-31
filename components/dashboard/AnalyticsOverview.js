import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function AnalyticsOverview({ data, isPro }) {
  const days = data.length;
  const totalClicks = parseInt(data.reduce((acc, curr) => acc + curr.clicks, 0));
  const averageClicksPerDay = parseInt(totalClicks / days);

  return (
    <div className="bg-white shadow sm:rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Analytics Overview</h2>
      {isPro ? (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="clicks" fill="#3498DB" />
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-2 text-sm text-gray-600">Clicks over the last 30 days</p>
        </>
      ) : (
        <div>
          <p className="text-sm text-gray-600 mb-2">Basic analytics information:</p>
          <ul className="list-disc list-inside text-sm text-gray-600">
            <li>Total clicks: {totalClicks}</li>
            <li>Average clicks per day: {averageClicksPerDay}</li>
          </ul>
          <p className="mt-4 text-sm text-gray-600">
            <Link href="/dashboard/settings/subscription" rel='button' className='text-secondary'>Upgrade to pro</Link>
            &nbsp;for detailed analytics and charts</p>
        </div>
      )}
    </div>
  );
}