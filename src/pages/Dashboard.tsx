import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CreditCardIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      try {
        setLoading(false);
        toast.success('Dashboard loaded successfully!', { autoClose: 2000 });
      } catch {
        setError('Failed to load dashboard data');
        toast.error('Failed to load dashboard data', { autoClose: 3000 });
        setLoading(false);
      }
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  const stats = [
    {
      name: 'Total Revenue',
      value: '$145,231',
      change: '+12.5%',
      trend: 'up',
      icon: CreditCardIcon,
    },
    {
      name: 'Successful Payments',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: CheckCircleIcon,
    },
    {
      name: 'Pending Transactions',
      value: '23',
      change: '-4.3%',
      trend: 'down',
      icon: ClockIcon,
    },
    {
      name: 'Failed Payments',
      value: '12',
      change: '-15.1%',
      trend: 'down',
      icon: XCircleIcon,
    },
  ];

  const recentTransactions = [
    {
      id: 'TXN-001',
      customer: 'John Doe',
      amount: '$1,234.00',
      status: 'completed',
      time: '2 mins ago',
    },
    {
      id: 'TXN-002',
      customer: 'Jane Smith',
      amount: '$567.00',
      status: 'completed',
      time: '5 mins ago',
    },
    {
      id: 'TXN-003',
      customer: 'Bob Johnson',
      amount: '$890.00',
      status: 'pending',
      time: '12 mins ago',
    },
    {
      id: 'TXN-004',
      customer: 'Alice Brown',
      amount: '$2,345.00',
      status: 'completed',
      time: '18 mins ago',
    },
    {
      id: 'TXN-005',
      customer: 'Charlie Wilson',
      amount: '$456.00',
      status: 'failed',
      time: '25 mins ago',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <ErrorState title="Error Loading Dashboard" message={error} onAction={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's what's happening with your payments today.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-lg bg-gray-200"></div>
                <div className="h-6 w-12 rounded bg-gray-200"></div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-4 w-20 rounded bg-gray-200"></div>
                <div className="h-8 w-32 rounded bg-gray-200"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      {!loading && (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-blue-50 p-3">
                <stat.icon className="h-6 w-6 text-blue-600" />
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.trend === 'up' ? (
                  <ArrowTrendingUpIcon className="h-4 w-4" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4" />
                )}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Recent Transactions */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Transactions
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {recentTransactions.length === 0 ? (
                <tr>
                  <td className="px-6 py-12 text-center" colSpan={5}>
                    <EmptyState
                      title="No transactions yet"
                      message="Recent transactions will appear here once new payments are processed."
                      icon={ClockIcon}
                    />
                  </td>
                </tr>
              ) : (
                recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {transaction.id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    {transaction.customer}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                    {transaction.amount}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                        transaction.status
                      )}`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {transaction.time}
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
