import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CreditCardIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { paymentApi } from '../services/api';
import type { PaymentListItem } from '../types';
import { formatCurrency, formatDate, getStatusColor } from '../utils/helpers';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payments, setPayments] = useState<PaymentListItem[]>([]);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentApi.getPayments();
      setPayments(data);
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message as string) || err.message || 'Failed to load dashboard data.'
        : 'Failed to load dashboard data.';
      setError(message);
      toast.error(message, { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initialLoad = async () => {
      try {
        const data = await paymentApi.getPayments();
        if (isMounted) setPayments(data);
      } catch (err: unknown) {
        const message = axios.isAxiosError(err)
          ? (err.response?.data?.message as string) || err.message || 'Failed to load dashboard data.'
          : 'Failed to load dashboard data.';
        if (isMounted) setError(message);
        toast.error(message, { autoClose: 3000 });
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void initialLoad();
    return () => { isMounted = false; };
  }, []);

  const successPayments = payments.filter((p) => p.status === 'SUCCESS');
  const failedPayments  = payments.filter((p) => p.status === 'FAILED');
  const pendingPayments = payments.filter((p) => p.status === 'PROCESSING' || p.status === 'RETRYING');
  const totalRevenue    = successPayments.reduce((acc, p) => acc + p.amount, 0);

  const stats = [
    {
      name: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      icon: CreditCardIcon,
      trend: 'up' as const,
    },
    {
      name: 'Successful Payments',
      value: successPayments.length.toLocaleString(),
      icon: CheckCircleIcon,
      trend: 'up' as const,
    },
    {
      name: 'Pending Transactions',
      value: pendingPayments.length.toLocaleString(),
      icon: ClockIcon,
      trend: 'down' as const,
    },
    {
      name: 'Failed Payments',
      value: failedPayments.length.toLocaleString(),
      icon: XCircleIcon,
      trend: 'down' as const,
    },
  ];

  const recentTransactions = [...payments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (error) {
    return (
      <div className="space-y-6">
        <ErrorState title="Error Loading Dashboard" message={error} onAction={loadDashboard} />
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
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Customer ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 w-32 rounded bg-gray-200"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 rounded bg-gray-200"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-20 rounded bg-gray-200"></div></td>
                    <td className="px-6 py-4"><div className="h-5 w-20 rounded-full bg-gray-200"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 rounded bg-gray-200"></div></td>
                  </tr>
                ))
              ) : recentTransactions.length === 0 ? (
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
                <tr key={transaction.paymentReference} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {transaction.paymentReference}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    {transaction.customerId}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                    {formatCurrency(transaction.amount, transaction.currency)}
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
                    {formatDate(transaction.createdAt)}
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
