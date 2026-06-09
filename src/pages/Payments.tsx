import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  } from '@heroicons/react/24/outline';

const Payments = () => {
  const [filterStatus, setFilterStatus] = useState<'all' | PaymentStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const payments = [
    {
      id: 'PAY-2024-001',
      customer: 'John Doe',
      email: 'john@example.com',
      amount: '$1,234.00',
      status: 'completed',
      method: 'Credit Card',
      date: '2024-05-20 10:30 AM',
    },
    {
      id: 'PAY-2024-002',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      amount: '$567.00',
      status: 'completed',
      method: 'Debit Card',
      date: '2024-05-20 10:25 AM',
    },
    {
      id: 'PAY-2024-003',
      customer: 'Bob Johnson',
      email: 'bob@example.com',
      amount: '$890.00',
      status: 'pending',
      method: 'Bank Transfer',
      date: '2024-05-20 10:18 AM',
    },
    {
      id: 'PAY-2024-004',
      customer: 'Alice Brown',
      email: 'alice@example.com',
      amount: '$2,345.00',
      status: 'completed',
      method: 'Credit Card',
      date: '2024-05-20 10:12 AM',
    },
    {
      id: 'PAY-2024-005',
      customer: 'Charlie Wilson',
      email: 'charlie@example.com',
      amount: '$456.00',
      status: 'failed',
      method: 'Credit Card',
      date: '2024-05-20 10:05 AM',
    },
    {
      id: 'PAY-2024-006',
      customer: 'Diana Prince',
      email: 'diana@example.com',
      amount: '$3,210.00',
      status: 'completed',
      method: 'Bank Transfer',
      date: '2024-05-20 09:58 AM',
    },
    {
      id: 'PAY-2024-007',
      customer: 'Ethan Hunt',
      email: 'ethan@example.com',
      amount: '$789.00',
      status: 'processing',
      method: 'Debit Card',
      date: '2024-05-20 09:45 AM',
    },
    {
      id: 'PAY-2024-008',
      customer: 'Fiona Green',
      email: 'fiona@example.com',
      amount: '$1,567.00',
      status: 'completed',
      method: 'Credit Card',
      date: '2024-05-20 09:32 AM',
    },
  ];

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

  const filteredPayments = useMemo(
    () =>
      payments.filter((payment) => {
        const matchesStatus =
          filterStatus === 'all' || payment.status === filterStatus;
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          payment.paymentReference.toLowerCase().includes(query) ||
          payment.customerId.toLowerCase().includes(query) ||
          payment.merchantId.toLowerCase().includes(query);

        return matchesStatus && matchesSearch;
      }),
    [filterStatus, payments, searchQuery]
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track all payment transactions from the API
          </p>
        </div>
        <button
          onClick={loadPayments}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID, customer, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-3">
          <FunnelIcon className="h-5 w-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | PaymentStatus)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="FAILED">FAILED</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="RETRYING">RETRYING</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
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
                    Currency
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
                    <tr key={payment.paymentReference} className="hover:bg-gray-50">
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
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                        {payment.currency}
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

        {error && (
          <div className="border-t border-red-200 bg-red-50 px-6 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredPayments.length}</span> of{' '}
            <span className="font-medium">{payments.length}</span> payments
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Previous
            </button>
            <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
