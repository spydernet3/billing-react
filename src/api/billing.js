import { apiRequest } from './http.js';

const customerQuery = (customerId) => `customerId=${encodeURIComponent(customerId)}`;

export function getBillingDashboard(customerId, options = {}) {
  const query = customerQuery(customerId);
  const requests = [
    apiRequest('/api/plans?page=0&size=100&sort=price,asc', options),
    apiRequest(`/api/subscription?${query}`, options),
    apiRequest(`/api/usage?${query}`, options),
    apiRequest(`/api/invoices?${query}&page=0&size=100&sort=periodStart,desc`, options),
    apiRequest(`/api/invoices/summary?${query}`, options),
    apiRequest(`/api/invoices/monthly-totals?${query}`, options),
    apiRequest(`/api/payment-methods?${query}`, options),
  ];

  return Promise.all(requests).then(
    ([plans, subscription, usage, invoices, invoiceSummary, monthlyTotals, paymentMethods]) => ({
      plans: plans.items,
      subscription,
      usage,
      invoices: invoices.items,
      invoiceSummary,
      monthlyTotals,
      paymentMethods,
    })
  );
}

export function signIn(email, password) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });
}

export function changeSubscriptionPlan(subscriptionId, planId) {
  return apiRequest(`/api/subscription/${subscriptionId}/plan`, {
    method: 'PUT',
    body: { planId },
  });
}

export function setPrimaryPaymentMethod(methodId, customerId) {
  return apiRequest(`/api/payment-methods/${methodId}/primary?${customerQuery(customerId)}`, {
    method: 'PUT',
  });
}

export function addPaymentMethod(customerId, paymentMethod) {
  return apiRequest(`/api/payment-methods?${customerQuery(customerId)}`, {
    method: 'POST',
    body: paymentMethod,
  });
}

export function deletePaymentMethod(methodId, customerId) {
  return apiRequest(`/api/payment-methods/${methodId}?${customerQuery(customerId)}`, {
    method: 'DELETE',
  });
}
