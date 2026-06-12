import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCardIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { paymentApi } from '../services/api';
import type { CreatePaymentResponse } from '../types';

interface FormData {
  customerId: string;
  merchantId: string;
  amount: string;
  currency: string;
}

interface FormErrors {
  customerId?: string;
  merchantId?: string;
  amount?: string;
  currency?: string;
}

const CreatePayment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    customerId: '',
    merchantId: '',
    amount: '',
    currency: 'USD',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<CreatePaymentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD'];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.customerId.trim()) {
      newErrors.customerId = 'Customer ID is required';
    } else if (formData.customerId.length < 3) {
      newErrors.customerId = 'Customer ID must be at least 3 characters';
    }

    if (!formData.merchantId.trim()) {
      newErrors.merchantId = 'Merchant ID is required';
    } else if (formData.merchantId.length < 3) {
      newErrors.merchantId = 'Merchant ID must be at least 3 characters';
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else {
      const amountValue = parseFloat(formData.amount);
      if (isNaN(amountValue) || amountValue <= 0) {
        newErrors.amount = 'Amount must be a positive number';
      } else if (amountValue > 1000000) {
        newErrors.amount = 'Amount cannot exceed 1,000,000';
      }
    }

    if (!formData.currency) {
      newErrors.currency = 'Currency is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResponse(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        customerId: formData.customerId,
        merchantId: formData.merchantId,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
      };

      const result = await paymentApi.createPayment(payload);
      setResponse(result as CreatePaymentResponse);
      
      // Reset form
      setFormData({
        customerId: '',
        merchantId: '',
        amount: '',
        currency: 'USD',
      });
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to create payment. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewPayment = () => {
    if (response?.paymentReference) {
      navigate(`/payments/${response.paymentReference}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Payment</h1>
        <p className="mt-1 text-sm text-gray-500">
          Initiate a new payment transaction
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Payment Form */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-3">
              <CreditCardIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Payment Details
              </h2>
              <p className="text-sm text-gray-500">
                Enter the payment information
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Customer ID */}
            <div>
              <label
                htmlFor="customerId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Customer ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="customerId"
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                placeholder="e.g., CUST-12345"
                className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                  errors.customerId
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
              />
              {errors.customerId && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <ExclamationCircleIcon className="h-4 w-4" />
                  {errors.customerId}
                </p>
              )}
            </div>

            {/* Merchant ID */}
            <div>
              <label
                htmlFor="merchantId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Merchant ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="merchantId"
                name="merchantId"
                value={formData.merchantId}
                onChange={handleChange}
                placeholder="e.g., MERCH-67890"
                className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                  errors.merchantId
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
              />
              {errors.merchantId && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <ExclamationCircleIcon className="h-4 w-4" />
                  {errors.merchantId}
                </p>
              )}
            </div>

            {/* Amount and Currency */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    errors.amount
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <ExclamationCircleIcon className="h-4 w-4" />
                    {errors.amount}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="currency"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Currency <span className="text-red-500">*</span>
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    errors.currency
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                >
                  {currencies.map((curr) => (
                    <option key={curr} value={curr}>
                      {curr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCardIcon className="h-5 w-5" />
                  Create Payment
                </>
              )}
            </button>
          </form>
        </div>

        {/* Response Panel */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Payment Response
          </h2>

          {!response && !error && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-gray-100 p-4 mb-4">
                <CreditCardIcon className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">
                Submit the form to create a payment and see the response here
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <ExclamationCircleIcon className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-red-900 mb-1">
                    Payment Failed
                  </h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {response && (
            <div className="space-y-4">
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 mb-4">
                <div className="flex items-center gap-3">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  <div>
                    <h3 className="text-sm font-semibold text-green-900">
                      Payment Accepted
                    </h3>
                    <p className="text-xs text-green-700 mt-0.5">
                      Request was accepted and is being processed in the background
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-lg bg-gray-50 p-4">
                  <dt className="text-xs font-medium text-gray-500 mb-1">
                    Payment Reference
                  </dt>
                  <dd className="text-sm font-mono font-semibold text-gray-900">
                    {response.paymentReference}
                  </dd>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <dt className="text-xs font-medium text-gray-500 mb-1">
                      Status
                    </dt>
                    <dd>
                      <span className="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold bg-blue-100 text-blue-800">
                        {response.status}
                      </span>
                    </dd>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <dt className="text-xs font-medium text-gray-500 mb-1">
                      Next Step
                    </dt>
                    <dd className="text-sm font-semibold text-gray-900">
                      Check status using this reference
                    </dd>
                  </div>
                </div>
              </div>

              <button
                onClick={handleViewPayment}
                className="w-full rounded-lg border border-blue-600 bg-white px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                View Payment Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePayment;
