import axios from 'axios';
import type {
  CreatePaymentRequest,
  CreatePaymentResponse,
  Payment,
  PaymentDetails,
  PaymentListItem,
  PaymentSearchResponse,
} from '../types';

// API Base URL - update this when backend is ready
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

const mockPaymentsStore = new Map<string, PaymentSearchResponse>();

const generatePaymentReference = (): string => {
  const random = Math.floor(10000 + Math.random() * 90000);
  return `PAY${random}`;
};

const normalizeAcceptedPaymentResponse = (
  data: any,
  fallbackReference?: string
): CreatePaymentResponse => {
  const paymentReference =
    data?.paymentReference || data?.reference || fallbackReference || generatePaymentReference();

  return {
    paymentReference,
    status: 'PROCESSING',
  };
};

const scheduleMockBackgroundProcessing = (paymentReference: string): void => {
  const processingDelayMs = Math.floor(3000 + Math.random() * 4000);

  setTimeout(() => {
    const existing = mockPaymentsStore.get(paymentReference);
    if (!existing || existing.status !== 'PROCESSING') {
      return;
    }

    const isSuccess = Math.random() < 0.85;
    mockPaymentsStore.set(paymentReference, {
      ...existing,
      status: isSuccess ? 'SUCCESS' : 'FAILED',
      failureReason: isSuccess ? undefined : 'Transaction declined by issuer',
    });
  }, processingDelayMs);
};

// Request interceptor for adding auth tokens
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Payment API endpoints
export const paymentApi = {
  // Get all payments with optional filters
  getPayments: async (filters?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaymentListItem[]> => {
    const { data } = await apiClient.get('/payments', { params: filters });
    if (Array.isArray(data)) {
      return data;
    }

    return data?.data || data?.items || [];
  },

  // Get payment by ID
  getPaymentById: async (id: string): Promise<PaymentDetails> => {
    const { data } = await apiClient.get(`/payments/${id}`);
    return data;
  },

  // Get payment by reference
  getPaymentByReference: async (reference: string): Promise<PaymentSearchResponse> => {
    try {
      const { data } = await apiClient.get(`/payments/${reference}`);
      return data;
    } catch (error: any) {
      if (error?.response?.status === 404 && mockPaymentsStore.has(reference)) {
        return mockPaymentsStore.get(reference)!;
      }
      throw error;
    }
  },

  // Create new payment with async processing semantics
  createPayment: async (
    paymentData: CreatePaymentRequest
  ): Promise<CreatePaymentResponse> => {
    try {
      const { data } = await apiClient.post('/payments', paymentData, {
        headers: {
          Prefer: 'respond-async',
        },
      });

      const accepted = normalizeAcceptedPaymentResponse(data);

      mockPaymentsStore.set(accepted.paymentReference, {
        paymentReference: accepted.paymentReference,
        amount: paymentData.amount,
        currency: paymentData.currency,
        customerId: paymentData.customerId,
        merchantId: paymentData.merchantId,
        status: accepted.status,
        createdAt: new Date().toISOString(),
      });

      scheduleMockBackgroundProcessing(accepted.paymentReference);
      return accepted;
    } catch {
      const paymentReference = generatePaymentReference();

      mockPaymentsStore.set(paymentReference, {
        paymentReference,
        amount: paymentData.amount,
        currency: paymentData.currency,
        customerId: paymentData.customerId,
        merchantId: paymentData.merchantId,
        status: 'PROCESSING',
        createdAt: new Date().toISOString(),
      });

      scheduleMockBackgroundProcessing(paymentReference);

      return {
        paymentReference,
        status: 'PROCESSING',
      };
    }
  },

  // Update payment status
  updatePaymentStatus: async (
    id: string,
    status: Payment['status']
  ): Promise<Payment> => {
    const { data } = await apiClient.patch(`/payments/${id}/status`, { status });
    return data;
  },

  // Refund payment
  refundPayment: async (id: string, amount?: string): Promise<Payment> => {
    const { data } = await apiClient.post(`/payments/${id}/refund`, { amount });
    return data;
  },
};

// Dashboard API endpoints
export const dashboardApi = {
  // Get dashboard statistics
  getStats: async () => {
    const { data } = await apiClient.get('/dashboard/stats');
    return data;
  },

  // Get recent transactions
  getRecentTransactions: async (limit: number = 10) => {
    const { data } = await apiClient.get('/dashboard/transactions', {
      params: { limit },
    });
    return data;
  },
};

export default apiClient;
