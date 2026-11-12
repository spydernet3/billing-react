// All demo data lives here. Replace with API calls when you connect a backend.

export const user = { name: 'Alin' };

export const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    description:
      'Ideal for startups and small teams exploring cloud solutions with essential tools.',
    features: ['Up to 5 Users', '10 GB Storage', '100 Reports / Month', 'Standard Support'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 79,
    description: 'For growing teams needing more power, storage, and smarter collaboration.',
    features: [
      'Up to 20 Users',
      '100 GB Storage',
      '1,000 Reports / Month',
      '24/7 Priority Support',
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 199,
    description:
      'For large organizations requiring top-tier security, high throughput, and dedicated support.',
    features: [
      'Up to 200 Users',
      '2 TB Storage',
      '5,000 Reports / Month',
      '24/7 Dedicated Support',
    ],
  },
];

export const billingSummary = {
  period: 'May 1 - May 31, 2025',
  renewal: 'Auto-Renewing',
  amountDue: '$2,450.00',
  dueDate: 'Due on May 7, 2025',
  lastPayment: '$2,450.00',
  lastPaymentDate: 'Paid on Apr 22, 2025',
};

export const usage = [
  { id: 'users', title: 'Active Users', used: 86, limit: 200, amount: '86 / 200' },
  { id: 'storage', title: 'Storage Usage', used: 1.2, limit: 2, amount: '1.2 TB / 2 TB' },
  { id: 'reports', title: 'Reports Generated', used: 1245, limit: 5000, amount: '1,245 / 5,000' },
  { id: 'dashboards', title: 'Active Dashboards', used: 48, limit: 100, amount: '48 / 100' },
  { id: 'data', title: 'Data Processing', used: 2.5, limit: 5, amount: '2.5 TB / 5 TB' },
];

export const history = {
  totalPaid: '$29,450.00',
  totalInvoiced: '516',
  outstanding: '$0.00',
  bars: [
    { height: 45, tone: 'muted' },
    { height: 70, tone: 'muted' },
    { height: 98, tone: 'primary' },
    { height: 65, tone: 'primary' },
    { height: 50, tone: 'muted' },
    { height: 58, tone: 'accent' },
  ],
};

export const initialPaymentMethods = [
  { id: 'visa-4242', brand: 'visa', label: 'Visa', last4: '4242', expires: '04/28' },
  { id: 'mc-8831', brand: 'mastercard', label: 'Mastercard', last4: '8831', expires: '11/26' },
  { id: 'mc-9012', brand: 'mastercard', label: 'Mastercard', last4: '9012', expires: '08/29' },
];

export const categories = ['All Categories', 'Invoices', 'Subscriptions'];
