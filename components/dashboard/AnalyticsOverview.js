import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Clock } from 'lucide-react';

export default function AnalyticsOverview({ data, isPro }) {
  const days = data.length;
  const totalClicks = parseInt(data.reduce((acc, curr) => acc + curr.clicks, 0));
  const averageClicksPerDay = days === 0 ? 0 : parseInt(totalClicks / days);

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
          <ul className="list-disc list-inside text-sm text-gray-600 mb-4">
            <li>Total clicks: {totalClicks}</li>
            <li>Average clicks per day: {averageClicksPerDay}</li>
          </ul>
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-100">
            <Clock className="w-4 h-4 text-blue-500" />
            <p>
              <span className="font-medium">Pro Plan Coming Soon:</span>
              {' '}Detailed analytics with charts and advanced insights
            </p>
          </div>
        </div>
      )}
    </div>
  );
}