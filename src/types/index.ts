// Payment Types
export interface Payment {
  id: string;
  customer: string;
  email: string;
  amount: string;
  status: 'completed' | 'pending' | 'processing' | 'failed';
  method: string;
  date: string;
}

export interface PaymentDetails extends Payment {
  currency: string;
  customer: CustomerInfo;
  paymentMethod: PaymentMethodInfo;
  transaction: TransactionInfo;
  billing: BillingInfo;
  timeline: TimelineEvent[];
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface PaymentMethodInfo {
  type: string;
  last4: string;
  brand: string;
  expiry: string;
}

export interface TransactionInfo {
  createdAt: string;
  completedAt: string;
  processingTime: string;
  gateway: string;
  transactionId: string;
}

export interface BillingInfo {
  subtotal: string;
  tax: string;
  processingFee: string;
  total: string;
}

export interface TimelineEvent {
  status: string;
  timestamp: string;
  description: string;
}

// Dashboard Types
export interface DashboardStats {
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface Transaction {
  id: string;
  customer: string;
  amount: string;
  status: 'completed' | 'pending' | 'failed';
  time: string;
}
