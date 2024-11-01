import { format } from 'date-fns';
import { Receipt, CheckCircle } from 'lucide-react';

export default function SubscriptionHistory({ transactions }) {
  if (!transactions?.length) return null;

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-primary">Payment History</h2>
        <p className="text-sm text-gray-500 mt-1">Recent subscription payments</p>
      </div>
      
      <div className="divide-y">
        {transactions.map((transaction) => (
          <div 
            key={transaction.id} 
            className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                transaction.is_current ? 'bg-green-50' : 'bg-blue-50'
              }`}>
                {transaction.is_current ? (
                  <CheckCircle className="text-green-500" size={20} />
                ) : (
                  <Receipt className="text-secondary" size={20} />
                )}
              </div>
              <div>
                <p className="font-medium flex items-center gap-2">
                  Pro Plan
                  {transaction.is_current && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  {format(new Date(transaction.created_at), 'PPP')}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                Paid
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}