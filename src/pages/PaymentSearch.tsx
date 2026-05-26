import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { paymentApi } from '../services/api';

interface PaymentData {
  paymentReference: string;
  amount: number;
  currency: string;
  customerId: string;
  merchantId: string;
  status: string;
  failureReason?: string;
  createdAt?: string;
}

const PaymentSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case 'processing':
        return <ArrowPathIcon className="h-5 w-5 text-blue-600 animate-spin" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Please enter a payment reference');
      return;
    }

    setLoading(true);
    setError(null);
    setPaymentData(null);

    try {
      const result = await paymentApi.getPaymentByReference(searchQuery.trim());
      setPaymentData(result as PaymentData);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Payment not found. Please check the payment reference and try again.');
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to fetch payment details. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setPaymentData(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payment Search</h1>
        <p className="mt-1 text-sm text-gray-500">
          Search for a payment by its reference number
        </p>
      </div>

      {/* Search Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label
              htmlFor="paymentReference"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Payment Reference
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="paymentReference"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., PAY-2024-001 or transaction reference"
                className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <MagnifyingGlassIcon className="h-5 w-5" />
                  Search Payment
                </>
              )}
            </button>
            {(paymentData || error) && (
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <ExclamationCircleIcon className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-red-900 mb-1">
                Search Failed
              </h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Details */}
      {paymentData && (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Payment Details
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Reference: {paymentData.paymentReference}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(paymentData.status)}
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
                    paymentData.status
                  )}`}
                >
                  {paymentData.status.charAt(0).toUpperCase() + paymentData.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Payment Reference */}
              <div className="rounded-lg bg-gray-50 p-4">
                <dt className="text-sm font-medium text-gray-500 mb-2">
                  Payment Reference
                </dt>
                <dd className="text-base font-mono font-semibold text-gray-900">
                  {paymentData.paymentReference}
                </dd>
              </div>

              {/* Amount */}
              <div className="rounded-lg bg-gray-50 p-4">
                <dt className="text-sm font-medium text-gray-500 mb-2">
                  Amount
                </dt>
                <dd className="text-base font-semibold text-gray-900">
                  {paymentData.currency} {paymentData.amount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </dd>
              </div>

              {/* Currency */}
              <div className="rounded-lg bg-gray-50 p-4">
                <dt className="text-sm font-medium text-gray-500 mb-2">
                  Currency
                </dt>
                <dd className="text-base font-medium text-gray-900">
                  {paymentData.currency}
                </dd>
              </div>

              {/* Customer ID */}
              <div className="rounded-lg bg-gray-50 p-4">
                <dt className="text-sm font-medium text-gray-500 mb-2">
                  Customer ID
                </dt>
                <dd className="text-base font-medium text-gray-900">
                  {paymentData.customerId}
                </dd>
              </div>

              {/* Merchant ID */}
              <div className="rounded-lg bg-gray-50 p-4">
                <dt className="text-sm font-medium text-gray-500 mb-2">
                  Merchant ID
                </dt>
                <dd className="text-base font-medium text-gray-900">
                  {paymentData.merchantId}
                </dd>
              </div>

              {/* Status */}
              <div className="rounded-lg bg-gray-50 p-4">
                <dt className="text-sm font-medium text-gray-500 mb-2">
                  Status
                </dt>
                <dd>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
                      paymentData.status
                    )}`}
                  >
                    {getStatusIcon(paymentData.status)}
                    {paymentData.status.charAt(0).toUpperCase() + paymentData.status.slice(1)}
                  </span>
                </dd>
              </div>

              {/* Created At */}
              {paymentData.createdAt && (
                <div className="rounded-lg bg-gray-50 p-4">
                  <dt className="text-sm font-medium text-gray-500 mb-2">
                    Created At
                  </dt>
                  <dd className="text-base font-medium text-gray-900">
                    {new Date(paymentData.createdAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </dd>
                </div>
              )}
            </div>

            {/* Failure Reason */}
            {paymentData.failureReason && (
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <XCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <dt className="text-sm font-semibold text-red-900 mb-1">
                      Failure Reason
                    </dt>
                    <dd className="text-sm text-red-700">
                      {paymentData.failureReason}
                    </dd>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <Link
                to={`/payments/${paymentData.paymentReference}`}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                View Full Details
              </Link>
              <button
                onClick={handleReset}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Search Another
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!paymentData && !error && !loading && (
        <div className="rounded-lg border border-gray-200 bg-white p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-gray-100 p-4 mb-4">
              <MagnifyingGlassIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Search for a Payment
            </h3>
            <p className="text-sm text-gray-500 max-w-sm">
              Enter a payment reference in the search box above to view detailed
              payment information including status, amount, and failure reasons if
              applicable.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSearch;
