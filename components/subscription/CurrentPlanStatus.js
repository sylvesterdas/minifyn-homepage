import { Calendar, Zap, Clock } from 'lucide-react';
import { PLANS, getPlanLimits } from '@/constants/plans';
import { format } from 'date-fns';

export default function CurrentPlanStatus({ subscription }) {
  // Always show free plan for now
  const freeLimits = getPlanLimits('free');
  
  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold text-primary">Current Plan</h2>
          <p className="text-sm text-gray-500 mt-1">{PLANS.free.displayName}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
            {PLANS.free.name}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start gap-3">
          <Zap className="text-secondary" size={24} />
          <div>
            <p className="font-medium">Usage Limits</p>
            <p className="text-sm text-gray-600">
              {subscription?.used_urls || 0} / {freeLimits.urls_per_day} URLs today
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Clock className="text-blue-500" size={24} />
          <div>
            <p className="font-medium">Pro Plan</p>
            <p className="text-sm text-gray-600">
              Coming soon with increased limits
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}