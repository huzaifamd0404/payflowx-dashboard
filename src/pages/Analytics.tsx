import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  CreditCardIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { paymentApi } from '../services/api';
import type { PaymentListItem } from '../types';
import { formatCurrency } from '../utils/helpers';
import ErrorState from '../components/ui/ErrorState';
import LoadingState from '../components/ui/LoadingState';

const STATUS_COLORS: Record<string, string> = {
  SUCCESS: '#22c55e',
  FAILED: '#ef4444',
  PROCESSING: '#3b82f6',
  RETRYING: '#f59e0b',
};

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payments, setPayments] = useState<PaymentListItem[]>([]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentApi.getPayments();
      setPayments(data);
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message as string) || err.message || 'Failed to load analytics data.'
        : 'Failed to load analytics data.';
      setError(message);
      toast.error(message, { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      try {
        const data = await paymentApi.getPayments();
        if (isMounted) setPayments(data);
      } catch (err: unknown) {
        const message = axios.isAxiosError(err)
          ? (err.response?.data?.message as string) || err.message || 'Failed to load analytics data.'
          : 'Failed to load analytics data.';
        if (isMounted) setError(message);
        toast.error(message, { autoClose: 3000 });
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    void run();
    return () => { isMounted = false; };
  }, []);

  // --- Derived data ---
  const total = payments.length;
  const successPayments  = payments.filter((p) => p.status === 'SUCCESS');
  const failedPayments   = payments.filter((p) => p.status === 'FAILED');
  const pendingPayments  = payments.filter((p) => p.status === 'PROCESSING' || p.status === 'RETRYING');
  const totalRevenue     = successPayments.reduce((acc, p) => acc + p.amount, 0);
  const avgTransaction   = total > 0 ? successPayments.reduce((acc, p) => acc + p.amount, 0) / (successPayments.length || 1) : 0;
  const successRate      = total > 0 ? ((successPayments.length / total) * 100).toFixed(1) : '0.0';

  // Status breakdown for Pie chart
  const pieData = [
    { name: 'Success',    value: successPayments.length,  color: STATUS_COLORS.SUCCESS },
    { name: 'Failed',     value: failedPayments.length,   color: STATUS_COLORS.FAILED },
    { name: 'Processing', value: payments.filter((p) => p.status === 'PROCESSING').length, color: STATUS_COLORS.PROCESSING },
    { name: 'Retrying',   value: payments.filter((p) => p.status === 'RETRYING').length,   color: STATUS_COLORS.RETRYING },
  ].filter((d) => d.value > 0);

  // Daily volume — last 7 days
  const last7: { date: string; Success: number; Failed: number; Pending: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const dayStr = d.toISOString().slice(0, 10);
    const dayPayments = payments.filter((p) => p.createdAt.slice(0, 10) === dayStr);
    last7.push({
      date: label,
      Success:  dayPayments.filter((p) => p.status === 'SUCCESS').length,
      Failed:   dayPayments.filter((p) => p.status === 'FAILED').length,
      Pending:  dayPayments.filter((p) => p.status === 'PROCESSING' || p.status === 'RETRYING').length,
    });
  }

  // Revenue by currency
  const currencyMap: Record<string, number> = {};
  successPayments.forEach((p) => {
    currencyMap[p.currency] = (currencyMap[p.currency] ?? 0) + p.amount;
  });
  const currencyData = Object.entries(currencyMap).map(([currency, amount]) => ({
    currency,
    amount: parseFloat(amount.toFixed(2)),
  }));

  // Success rate trend — last 7 days as line chart
  const rateTrend = last7.map((d) => {
    const dayTotal = d.Success + d.Failed + d.Pending;
    return {
      date: d.date,
      rate: dayTotal > 0 ? parseFloat(((d.Success / dayTotal) * 100).toFixed(1)) : 0,
    };
  });

  const summaryStats = [
    {
      name: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      icon: CreditCardIcon,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      name: 'Success Rate',
      value: `${successRate}%`,
      icon: ArrowTrendingUpIcon,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      name: 'Total Transactions',
      value: total.toLocaleString(),
      icon: CheckCircleIcon,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      name: 'Avg. Transaction',
      value: formatCurrency(avgTransaction),
      icon: XCircleIcon,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];

  if (error) {
    return (
      <div className="space-y-6">
        <ErrorState title="Error Loading Analytics" message={error} onAction={loadData} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingState message="Loading analytics data..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Payment performance overview based on all transactions.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {summaryStats.map((stat) => (
          <div
            key={stat.name}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className={`rounded-lg p-3 ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Status Distribution bar */}
      {total > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Status Distribution</h2>
          <div className="flex h-4 w-full overflow-hidden rounded-full">
            {successPayments.length > 0 && (
              <div
                style={{ width: `${(successPayments.length / total) * 100}%`, backgroundColor: STATUS_COLORS.SUCCESS }}
                title={`Success: ${successPayments.length}`}
              />
            )}
            {pendingPayments.length > 0 && (
              <div
                style={{ width: `${(pendingPayments.length / total) * 100}%`, backgroundColor: STATUS_COLORS.PROCESSING }}
                title={`Pending: ${pendingPayments.length}`}
              />
            )}
            {failedPayments.length > 0 && (
              <div
                style={{ width: `${(failedPayments.length / total) * 100}%`, backgroundColor: STATUS_COLORS.FAILED }}
                title={`Failed: ${failedPayments.length}`}
              />
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-4">
            {[
              { label: 'Success',    count: successPayments.length, color: STATUS_COLORS.SUCCESS },
              { label: 'Pending',    count: pendingPayments.length, color: STATUS_COLORS.PROCESSING },
              { label: 'Failed',     count: failedPayments.length,  color: STATUS_COLORS.FAILED },
            ].map(({ label, count, color }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                {label}: <span className="font-semibold text-gray-900">{count}</span>
                <span className="text-gray-400">({total > 0 ? ((count / total) * 100).toFixed(1) : 0}%)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Daily Volume Bar Chart */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Daily Payment Volume (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={last7} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Success"  fill={STATUS_COLORS.SUCCESS}    radius={[3, 3, 0, 0]} />
              <Bar dataKey="Failed"   fill={STATUS_COLORS.FAILED}     radius={[3, 3, 0, 0]} />
              <Bar dataKey="Pending"  fill={STATUS_COLORS.PROCESSING} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Pie Chart */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Payment Status Breakdown</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }: { name?: string; percent?: number }) =>
                    `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: unknown) => [Number(value ?? 0), 'Payments']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-64 items-center justify-center text-sm text-gray-400">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Success Rate Trend Line Chart */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Success Rate Trend (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={rateTrend} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: unknown) => [`${Number(v ?? 0)}%`, 'Success Rate']} />
              <Line
                type="monotone"
                dataKey="rate"
                stroke={STATUS_COLORS.SUCCESS}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Currency */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Revenue by Currency</h2>
          {currencyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={currencyData}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="currency" type="category" tick={{ fontSize: 12 }} width={40} />
                <Tooltip formatter={(v: unknown) => [formatCurrency(Number(v ?? 0)), 'Revenue']} />
                <Bar dataKey="amount" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-56 items-center justify-center text-sm text-gray-400">
              No revenue data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
