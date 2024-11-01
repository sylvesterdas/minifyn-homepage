import { PLANS } from '@/constants/plans';
import { Check } from 'lucide-react';
import { useTranslation } from 'next-i18next';

export default function PlanSelector({ selectedPlan, onPlanSelect }) {
  const { t } = useTranslation('auth');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(PLANS).map(([planId, plan]) => (
        <div
          key={planId}
          onClick={() => onPlanSelect(planId)}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
            selectedPlan === planId
              ? 'border-secondary bg-blue-50'
              : 'border-gray-200'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold text-lg">{plan.name}</h3>
              <p className="text-lg font-semibold">
                {plan.price === 0 ? t('free') : `₹${plan.price}${t('monthly')}`}
              </p>
            </div>
            {selectedPlan === planId && (
              <Check className="text-secondary" size={24} />
            )}
          </div>
          <ul className="space-y-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <Check size={16} className="text-green-500 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}