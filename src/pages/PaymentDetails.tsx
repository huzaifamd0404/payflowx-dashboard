import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

const PaymentDetails = () => {
  const { id } = useParams();

  // Mock payment data - in real app, fetch based on id
  const payment = {
    id: id || 'PAY-2024-001',
    status: 'completed',
    amount: '$1,234.00',
    currency: 'USD',
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main St, New York, NY 10001',
    },
    paymentMethod: {
      type: 'Credit Card',
      last4: '4242',
      brand: 'Visa',
      expiry: '12/2025',
    },
    transaction: {
      createdAt: '2024-05-20 10:30:15 AM',
      completedAt: '2024-05-20 10:30:18 AM',
      processingTime: '3.2s',
      gateway: 'Stripe',
      transactionId: 'ch_3NmQp2AbhKzLQj1i0mhLQjZ1',
    },
    billing: {
      subtotal: '$1,200.00',
      tax: '$24.00',
      processingFee: '$10.00',
      total: '$1,234.00',
    },
    timeline: [
      {
        status: 'Payment Initiated',
        timestamp: '2024-05-20 10:30:15 AM',
        description: 'Customer initiated payment',
      },
      {
        status: 'Validation Passed',
        timestamp: '2024-05-20 10:30:16 AM',
        description: 'Payment details validated successfully',
      },
      {
        status: 'Processing',
        timestamp: '2024-05-20 10:30:16 AM',
        description: 'Payment sent to bank for processing',
      },
      {
        status: 'Completed',
        timestamp: '2024-05-20 10:30:18 AM',
        description: 'Payment successfully processed',
      },
    ],
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircleIcon className="h-6 w-6 text-green-600" />;
      case 'pending':
        return <ClockIcon className="h-6 w-6 text-yellow-600" />;
      case 'processing':
        return <ArrowPathIcon className="h-6 w-6 text-blue-600 animate-spin" />;
      case 'failed':
        return <XCircleIcon className="h-6 w-6 text-red-600" />;
      default:
        return <ClockIcon className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
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

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/payments"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Payments
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">{payment.id}</h1>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
                payment.status
              )}`}
            >
              {getStatusIcon(payment.status)}
              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Created on {payment.transaction.createdAt}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="text-3xl font-bold text-gray-900">{payment.amount}</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Transaction Details */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Transaction Details
            </h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Transaction ID</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono">
                  {payment.transaction.transactionId}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Gateway</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {payment.transaction.gateway}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Processing Time</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {payment.transaction.processingTime}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Completed At</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {payment.transaction.completedAt}
                </dd>
              </div>
            </dl>
          </div>

          {/* Customer Details */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Customer Information
            </h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{payment.customer.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {payment.customer.email}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {payment.customer.phone}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {payment.customer.address}
                </dd>
              </div>
            </dl>
          </div>

          {/* Payment Method */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Payment Method
            </h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {payment.paymentMethod.type}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Brand</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {payment.paymentMethod.brand}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Card Number</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono">
                  **** **** **** {payment.paymentMethod.last4}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Expiry</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {payment.paymentMethod.expiry}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Right Column - Timeline and Billing */}
        <div className="space-y-6">
          {/* Billing Breakdown */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Billing Breakdown
            </h2>
            <dl className="space-y-3">
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500">Subtotal</dt>
                <dd className="font-medium text-gray-900">{payment.billing.subtotal}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500">Tax</dt>
                <dd className="font-medium text-gray-900">{payment.billing.tax}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500">Processing Fee</dt>
                <dd className="font-medium text-gray-900">
                  {payment.billing.processingFee}
                </dd>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3 text-base">
                <dt className="font-semibold text-gray-900">Total</dt>
                <dd className="font-bold text-gray-900">{payment.billing.total}</dd>
              </div>
            </dl>
          </div>

          {/* Timeline */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Payment Timeline
            </h2>
            <div className="space-y-4">
              {payment.timeline.map((event, index) => (
                <div key={index} className="relative">
                  {index !== payment.timeline.length - 1 && (
                    <div className="absolute left-2 top-6 h-full w-0.5 bg-gray-200" />
                  )}
                  <div className="flex gap-3">
                    <div className="relative z-10 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 mt-1">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {event.status}
                      </p>
                      <p className="text-xs text-gray-500">{event.timestamp}</p>
                      <p className="mt-1 text-xs text-gray-600">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
            <div className="space-y-2">
              <button className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Refund Payment
              </button>
              <button className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Download Receipt
              </button>
              <button className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Email Customer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
