import { Calendar, Zap, AlertCircle } from 'lucide-react';
import { PLANS, getPlanLimits } from '@/constants/plans';
import { format } from 'date-fns';

export default function CurrentPlanStatus({ subscription }) {
  if (!subscription) {
    const freeLimits = getPlanLimits('free');
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold text-primary">Current Plan</h2>
            <p className="text-sm text-gray-500 mt-1">{PLANS.free.displayName}</p>
          </div>
          <div className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
            {PLANS.free.name}
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
        </div>
      </div>
    );
  }

  const planId = subscription.plan_name;
  const plan = PLANS[planId];
  const limits = getPlanLimits(planId);
  const isExpiring = subscription.current_period_end ? new Date(subscription.current_period_end) <= new Date() : false;
  const daysLeft = subscription.current_period_end ? Math.ceil((new Date(subscription.current_period_end) - new Date()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold text-primary">Current Plan</h2>
          <p className="text-sm text-gray-500 mt-1">Your subscription details</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm ${
          subscription.status === 'active' 
            ? 'bg-blue-100 text-blue-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {plan.displayName}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start gap-3">
          <Zap className="text-secondary" size={24} />
          <div>
            <p className="font-medium">Usage Limits</p>
            <p className="text-sm text-gray-600">
              {subscription.used_urls || 0} / {limits.urls_per_day} URLs today
            </p>
          </div>
        </div>

        {subscription.current_period_start && (
          <div className="flex items-start gap-3">
            <Calendar className="text-secondary" size={24} />
            <div>
              <p className="font-medium">Billing Period</p>
              <p className="text-sm text-gray-600">
                {format(new Date(subscription.current_period_start), 'MMM d, yyyy')} - 
                {format(new Date(subscription.current_period_end), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
        )}

        {isExpiring && subscription.status === 'active' && (
          <div className="flex items-start gap-3">
            <AlertCircle className="text-coral" size={24} />
            <div>
              <p className="font-medium text-coral">Expiring Soon</p>
              <p className="text-sm text-gray-600">
                {daysLeft <= 0 
                  ? 'Expires today'
                  : `${daysLeft} days remaining`
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}