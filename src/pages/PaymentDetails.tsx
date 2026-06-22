import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  CreditCardIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { paymentApi } from '../services/api';
import { formatCurrency, formatDate } from '../utils/helpers';
import ErrorState from '../components/ui/ErrorState';
import LoadingState from '../components/ui/LoadingState';

interface PaymentDetailData {
  paymentReference: string;
  amount: number;
  currency: string;
  customerId: string;
  merchantId: string;
  status: string;
  failureReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

const PaymentDetails = () => {
  const { id } = useParams();
  const [payment, setPayment] = useState<PaymentDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPayment = async () => {
    if (!id) {
      setError('Invalid payment reference.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await paymentApi.getPaymentById(id);
      setPayment(data as unknown as PaymentDetailData);
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.status === 404
          ? 'Payment not found for this reference.'
          : (err.response?.data?.message as string) ||
            err.message ||
            'Failed to load payment details. Please try again.'
        : 'Failed to load payment details. Please try again.';

      setError(errorMessage);
      toast.error(errorMessage, { autoClose: 3500 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPayment();
  }, [id]);

  const statusConfig = useMemo(() => {
    const normalizedStatus = payment?.status?.toUpperCase() || 'UNKNOWN';

    switch (normalizedStatus) {
      case 'SUCCESS':
      case 'COMPLETED':
        return {
          badgeClass: 'bg-green-100 text-green-800',
          icon: <CheckCircleIcon className="h-5 w-5 text-green-600" />,
        };
      case 'FAILED':
        return {
          badgeClass: 'bg-red-100 text-red-800',
          icon: <XCircleIcon className="h-5 w-5 text-red-600" />,
        };
      case 'PROCESSING':
      case 'PENDING':
        return {
          badgeClass: 'bg-blue-100 text-blue-800',
          icon: <ClockIcon className="h-5 w-5 text-blue-600" />,
        };
      default:
        return {
          badgeClass: 'bg-gray-100 text-gray-800',
          icon: <ClockIcon className="h-5 w-5 text-gray-600" />,
        };
    }
  }, [payment?.status]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Link
          to="/payments"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Payments
        </Link>
        <LoadingState
          title="Loading payment details"
          message="We are fetching the latest transaction information for this reference."
          fullHeight
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Link
          to="/payments"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Payments
        </Link>
        <ErrorState title="Unable to load payment details" message={error} onAction={loadPayment} />
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="space-y-6">
        <Link
          to="/payments"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Payments
        </Link>
        <ErrorState
          title="Payment unavailable"
          message="No payment details were returned for this reference."
          onAction={loadPayment}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/payments"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Payments
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {payment.paymentReference}
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${statusConfig.badgeClass}`}
            >
              {statusConfig.icon}
              {payment.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Created {payment.createdAt ? formatDate(payment.createdAt, true) : 'N/A'}
          </p>
        </div>
        <div className="rounded-lg bg-gray-100 px-4 py-3 sm:text-right">
          <p className="text-xs text-gray-500">Amount</p>
          <p className="text-xl font-bold text-gray-900 sm:text-2xl">
            {formatCurrency(payment.amount, payment.currency)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900">Transaction Summary</h2>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Payment Reference</dt>
                <dd className="mt-1 break-all text-sm font-semibold text-gray-900">
                  {payment.paymentReference}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Current Status</dt>
                <dd className="mt-1 text-sm text-gray-900">{payment.status}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Customer ID</dt>
                <dd className="mt-1 text-sm text-gray-900">{payment.customerId}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Merchant ID</dt>
                <dd className="mt-1 text-sm text-gray-900">{payment.merchantId}</dd>
              </div>
            </dl>
          </div>

          {payment.failureReason ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-5 sm:p-6">
              <h2 className="text-base font-semibold text-red-900">Failure Reason</h2>
              <p className="mt-2 text-sm text-red-700">{payment.failureReason}</p>
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900">Timeline</h2>
            <div className="mt-4 space-y-3">
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="flex items-center gap-2 text-sm font-medium text-gray-900">
                  <CalendarIcon className="h-4 w-4 text-gray-500" />
                  Created
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  {payment.createdAt ? formatDate(payment.createdAt, true) : 'Unavailable'}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="flex items-center gap-2 text-sm font-medium text-gray-900">
                  <ClockIcon className="h-4 w-4 text-gray-500" />
                  Last Updated
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  {payment.updatedAt ? formatDate(payment.updatedAt, true) : 'Unavailable'}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="flex items-center gap-2 text-sm font-medium text-gray-900">
                  <CreditCardIcon className="h-4 w-4 text-gray-500" />
                  Currency
                </p>
                <p className="mt-1 text-xs text-gray-600">{payment.currency}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900">Actions</h2>
            <div className="mt-4 space-y-2">
              <Link
                to="/payments"
                className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Back to list
              </Link>
              <Link
                to="/payment-search"
                className="block w-full rounded-lg border border-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-blue-600 hover:bg-blue-50"
              >
                Search another payment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
