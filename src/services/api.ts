import axios from 'axios';
import { Payment, PaymentDetails } from '../types';

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
  }): Promise<Payment[]> => {
    const { data } = await apiClient.get('/payments', { params: filters });
    return data;
  },

  // Get payment by ID
  getPaymentById: async (id: string): Promise<PaymentDetails> => {
    const { data } = await apiClient.get(`/payments/${id}`);
    return data;
  },

  // Get payment by reference
  getPaymentByReference: async (reference: string): Promise<any> => {
    const { data } = await apiClient.get(`/payments/${reference}`);
    return data;
  },

  // Create new payment
  createPayment: async (paymentData: {
    customerId: string;
    merchantId: string;
    amount: number;
    currency: string;
  }): Promise<any> => {
    const { data } = await apiClient.post('/payments', paymentData);
    return data;
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

export default apiClient;
