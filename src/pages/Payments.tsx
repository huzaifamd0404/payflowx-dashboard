import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  ArrowPathIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import { paymentApi } from '../services/api';
import type { PaymentListItem, PaymentStatus } from '../types';
import { formatCurrency, formatDate } from '../utils/helpers';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';

const STATUS_FILTERS: Array<'all' | PaymentStatus> = [
  'all',
  'SUCCESS',
  'FAILED',
  'PROCESSING',
  'RETRYING',
];

const Payments = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<PaymentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | PaymentStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadPayments = async (showToast = false) => {
    setLoading(true);
    setError(null);

    try {
      const data = await paymentApi.getPayments();
      setPayments(data);

      if (showToast) {
        toast.success(`Loaded ${data.length} payments`, { autoClose: 2200 });
      }
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err)
        ? (err.response?.data?.message as string) ||
          err.message ||
          'Failed to fetch payments. Please try again.'
        : 'Failed to fetch payments. Please try again.';

      setError(errorMessage);
      toast.error(errorMessage, { autoClose: 3500 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initialLoad = async () => {
      try {
        const data = await paymentApi.getPayments();
        if (isMounted) {
          setPayments(data);
        }
      } catch (err: unknown) {
        const errorMessage = axios.isAxiosError(err)
          ? (err.response?.data?.message as string) ||
            err.message ||
            'Failed to fetch payments. Please try again.'
          : 'Failed to fetch payments. Please try again.';

        if (isMounted) {
          setError(errorMessage);
        }
        toast.error(errorMessage, { autoClose: 3500 });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void initialLoad();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredPayments = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesStatus =
        filterStatus === 'all' || payment.status === filterStatus;

      if (!normalizedQuery) {
        return matchesStatus;
      }

      const matchesQuery =
        payment.paymentReference.toLowerCase().includes(normalizedQuery) ||
        payment.customerId.toLowerCase().includes(normalizedQuery) ||
        payment.merchantId.toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesQuery;
    });
  }, [filterStatus, payments, searchQuery]);

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'RETRYING':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const hasFilters = filterStatus !== 'all' || searchQuery.trim().length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Payments</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track all payment transactions from the API
          </p>
        </div>
        <button
          onClick={() => loadPayments(true)}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by reference, customer, or merchant..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex w-full items-center gap-2 md:w-auto">
          <FunnelIcon className="h-5 w-5 flex-shrink-0 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(event) =>
              setFilterStatus(event.target.value as 'all' | PaymentStatus)
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 md:w-auto"
          >
            {STATUS_FILTERS.map((status) => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Status' : status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error ? <ErrorState title="Unable to load payments" message={error} onAction={() => loadPayments(true)} /> : null}

      {loading ? (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Reference', 'Customer', 'Merchant', 'Amount', 'Status', 'Created'].map(
                    (header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    {Array.from({ length: 6 }).map((__, cellIndex) => (
                      <td key={cellIndex} className="px-6 py-4">
                        <div className="h-4 rounded bg-gray-200" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {!loading && !error && filteredPayments.length === 0 ? (
        <EmptyState
          title={hasFilters ? 'No matching payments' : 'No payments yet'}
          message={
            hasFilters
              ? 'Try adjusting your filters or search term to find payments.'
              : 'Payments will appear here once transactions are created.'
          }
          icon={PlusCircleIcon}
          actionLabel={hasFilters ? 'Clear filters' : 'Create Payment'}
          onAction={() => {
            if (hasFilters) {
              setFilterStatus('all');
              setSearchQuery('');
              return;
            }

            navigate('/create-payment');
          }}
        />
      ) : null}

      {!loading && !error && filteredPayments.length > 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Payment Reference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Customer ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Merchant ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Created Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredPayments.map((payment) => (
                  <tr
                    key={payment.paymentReference}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      navigate(`/payments/${payment.paymentReference}`);
                    }}
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {payment.paymentReference}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      {payment.customerId}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      {payment.merchantId}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                      {formatCurrency(payment.amount, payment.currency)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                          payment.status
                        )}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatDate(payment.createdAt, true)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 p-4 md:hidden">
            {filteredPayments.map((payment) => (
              <Link
                key={payment.paymentReference}
                to={`/payments/${payment.paymentReference}`}
                className="block rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-gray-900">
                    {payment.paymentReference}
                  </p>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(
                      payment.status
                    )}`}
                  >
                    {payment.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">Customer: {payment.customerId}</p>
                <p className="text-sm text-gray-600">Merchant: {payment.merchantId}</p>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(payment.amount, payment.currency)}
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(payment.createdAt, true)}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2 border-t border-gray-200 px-4 py-3 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
            <p>
              Showing <span className="font-medium">{filteredPayments.length}</span> of{' '}
              <span className="font-medium">{payments.length}</span> payments
            </p>
            <div className="flex gap-2">
              <button className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50">
                Previous
              </button>
              <button className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Payments;
