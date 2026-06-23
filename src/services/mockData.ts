import type { PaymentListItem, PaymentSearchResponse } from '../types';

const now = new Date();
const daysAgo = (n: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

const _mockPayments: PaymentListItem[] = [
  { paymentReference: 'PAY-001', customerId: 'CUST-101', merchantId: 'MERCH-01', amount: 250.00, currency: 'USD', status: 'SUCCESS',    createdAt: daysAgo(0) },
  { paymentReference: 'PAY-002', customerId: 'CUST-102', merchantId: 'MERCH-01', amount: 89.99,  currency: 'USD', status: 'FAILED',     createdAt: daysAgo(0) },
  { paymentReference: 'PAY-003', customerId: 'CUST-103', merchantId: 'MERCH-02', amount: 450.00, currency: 'EUR', status: 'SUCCESS',    createdAt: daysAgo(1) },
  { paymentReference: 'PAY-004', customerId: 'CUST-104', merchantId: 'MERCH-02', amount: 120.50, currency: 'USD', status: 'PROCESSING', createdAt: daysAgo(1) },
  { paymentReference: 'PAY-005', customerId: 'CUST-105', merchantId: 'MERCH-03', amount: 75.00,  currency: 'GBP', status: 'SUCCESS',    createdAt: daysAgo(1) },
  { paymentReference: 'PAY-006', customerId: 'CUST-106', merchantId: 'MERCH-01', amount: 320.00, currency: 'USD', status: 'RETRYING',   createdAt: daysAgo(2) },
  { paymentReference: 'PAY-007', customerId: 'CUST-107', merchantId: 'MERCH-03', amount: 99.00,  currency: 'USD', status: 'SUCCESS',    createdAt: daysAgo(2) },
  { paymentReference: 'PAY-008', customerId: 'CUST-108', merchantId: 'MERCH-02', amount: 540.75, currency: 'EUR', status: 'FAILED',     createdAt: daysAgo(2) },
  { paymentReference: 'PAY-009', customerId: 'CUST-109', merchantId: 'MERCH-01', amount: 180.00, currency: 'USD', status: 'SUCCESS',    createdAt: daysAgo(3) },
  { paymentReference: 'PAY-010', customerId: 'CUST-110', merchantId: 'MERCH-03', amount: 60.00,  currency: 'GBP', status: 'SUCCESS',    createdAt: daysAgo(3) },
  { paymentReference: 'PAY-011', customerId: 'CUST-111', merchantId: 'MERCH-02', amount: 210.00, currency: 'USD', status: 'PROCESSING', createdAt: daysAgo(3) },
  { paymentReference: 'PAY-012', customerId: 'CUST-112', merchantId: 'MERCH-01', amount: 399.99, currency: 'USD', status: 'SUCCESS',    createdAt: daysAgo(4) },
  { paymentReference: 'PAY-013', customerId: 'CUST-113', merchantId: 'MERCH-03', amount: 150.00, currency: 'EUR', status: 'FAILED',     createdAt: daysAgo(4) },
  { paymentReference: 'PAY-014', customerId: 'CUST-114', merchantId: 'MERCH-02', amount: 88.50,  currency: 'USD', status: 'SUCCESS',    createdAt: daysAgo(5) },
  { paymentReference: 'PAY-015', customerId: 'CUST-115', merchantId: 'MERCH-01', amount: 720.00, currency: 'USD', status: 'SUCCESS',    createdAt: daysAgo(5) },
  { paymentReference: 'PAY-016', customerId: 'CUST-116', merchantId: 'MERCH-03', amount: 45.00,  currency: 'GBP', status: 'RETRYING',   createdAt: daysAgo(5) },
  { paymentReference: 'PAY-017', customerId: 'CUST-117', merchantId: 'MERCH-02', amount: 310.00, currency: 'EUR', status: 'SUCCESS',    createdAt: daysAgo(6) },
  { paymentReference: 'PAY-018', customerId: 'CUST-118', merchantId: 'MERCH-01', amount: 55.00,  currency: 'USD', status: 'FAILED',     createdAt: daysAgo(6) },
  { paymentReference: 'PAY-019', customerId: 'CUST-119', merchantId: 'MERCH-03', amount: 490.00, currency: 'USD', status: 'SUCCESS',    createdAt: daysAgo(6) },
  { paymentReference: 'PAY-020', customerId: 'CUST-120', merchantId: 'MERCH-02', amount: 135.25, currency: 'USD', status: 'SUCCESS',    createdAt: daysAgo(6) },
];

// Returns the live mock store (newest first)
export const getMockPayments = (): PaymentListItem[] => [..._mockPayments];

export const addMockPayment = (payment: PaymentListItem): void => {
  _mockPayments.unshift(payment); // newest at the top
};

// Keep named export for any direct imports
export const MOCK_PAYMENTS = _mockPayments;

export const MOCK_PAYMENT_DETAIL: PaymentSearchResponse = {
  paymentReference: 'PAY-001',
  customerId: 'CUST-101',
  merchantId: 'MERCH-01',
  amount: 250.00,
  currency: 'USD',
  status: 'SUCCESS',
  createdAt: daysAgo(0),
};
