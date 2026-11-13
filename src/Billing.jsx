import { useCallback, useEffect, useMemo, useState } from 'react';
import './Billing.css';

import {
  addPaymentMethod,
  changeSubscriptionPlan,
  deletePaymentMethod,
  getBillingDashboard,
  setPrimaryPaymentMethod,
} from './api/billing.js';
import TopNav from './components/TopNav.jsx';
import PageHeader from './components/PageHeader.jsx';
import StatCards from './components/StatCards.jsx';
import UsageOverview from './components/UsageOverview.jsx';
import BillingHistory from './components/BillingHistory.jsx';
import PaymentMethods from './components/PaymentMethods.jsx';
import PricingPlans from './components/PricingPlans.jsx';

const CUSTOMER_ID = import.meta.env.VITE_CUSTOMER_ID || '103';
const categories = ['All Categories', 'Invoices', 'Subscriptions'];
const currency = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' });
const number = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });
const date = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

function formatCurrency(value) {
  return currency.format(Number(value) || 0);
}

function formatDate(value) {
  return value ? date.format(new Date(`${value.slice(0, 10)}T00:00:00`)) : '—';
}

function formatPlan(plan) {
  return {
    ...plan,
    description: `${plan.support || 'Standard'} support for your organization.`,
    features: [
      `Up to ${plan.userLimit} Users`,
      `${number.format(plan.storageLimitGb)} GB Storage`,
      `${number.format(plan.reportsPerMonth)} Reports / Month`,
      `${number.format(plan.activeDashboardLimit)} Active Dashboards`,
      `${number.format(plan.dataProcessingLimitGb)} GB Data Processing`,
      plan.support,
    ].filter(Boolean),
  };
}

function formatUsageMetric(metric, index) {
  const metricName = metric.metric || `Metric ${index + 1}`;
  const usesGb = /storage|data processing/i.test(metricName);
  const unit = usesGb ? ' GB' : '';
  return {
    id: `${metricName}-${index}`,
    title: metricName,
    used: Number(metric.used),
    limit: Number(metric.limit),
    percentageUsed: Number(metric.percentageUsed),
    amount: `${number.format(metric.used)}${unit} / ${number.format(metric.limit)}${unit}`,
  };
}

function formatPaymentMethod(method) {
  const brand = method.brand || 'Card';
  return {
    ...method,
    label: brand,
    last4: method.lastFour,
    expires: `${String(method.expiryMonth).padStart(2, '0')}/${String(method.expiryYear).slice(-2)}`,
  };
}

function formatDashboard(data) {
  const subscription = data.subscription;
  const plans = data.plans.filter((plan) => plan.active).map(formatPlan);
  const currentPlan = plans.find((plan) => plan.id === subscription?.planId) || null;
  const monthlyTotals = data.monthlyTotals;
  const maxMonthlyTotal = Math.max(...monthlyTotals.map((month) => Number(month.total)), 0);
  const lastPaidInvoice =
    data.invoices.find(
      (invoice) =>
        invoice.paidOn &&
        invoice.paidOn === subscription?.lastPaymentAt?.slice(0, 10)
    ) || data.invoices.find((invoice) => invoice.status?.toLowerCase() === 'paid');

  return {
    plans,
    currentPlan,
    currentPlanId: subscription?.planId ?? null,
    summary: {
      period: subscription
        ? `${formatDate(subscription.currentPeriodStart)} - ${formatDate(subscription.currentPeriodEnd)}`
        : 'No active subscription',
      renewal: subscription?.billingCycle
        ? `${subscription.billingCycle.charAt(0)}${subscription.billingCycle.slice(1).toLowerCase()}`
        : 'No renewal',
      amountDue: formatCurrency(subscription?.amountDue),
      dueDate: subscription?.currentPeriodEnd
        ? `Period ends ${formatDate(subscription.currentPeriodEnd)}`
        : 'No active period',
      lastPayment: lastPaidInvoice ? formatCurrency(lastPaidInvoice.amount) : '—',
      lastPaymentDate: subscription?.lastPaymentAt
        ? `Paid on ${formatDate(subscription.lastPaymentAt)}`
        : 'No payments yet',
    },
    usage: (data.usage.metrics || []).map(formatUsageMetric),
    history: {
      totalPaid: formatCurrency(data.invoiceSummary.totalPaid),
      totalInvoiced: number.format(data.invoiceSummary.totalInvoices),
      outstanding: formatCurrency(data.invoiceSummary.outstandingAmount),
      invoices: data.invoices.map((invoice) => ({
        ...invoice,
        period: `${formatDate(invoice.periodStart)} - ${formatDate(invoice.periodEnd)}`,
        amount: formatCurrency(invoice.amount),
      })),
      bars: monthlyTotals.map((month, index) => {
        const total = Number(month.total);
        return {
          height: maxMonthlyTotal ? Math.max(4, (total / maxMonthlyTotal) * 100) : 4,
          tone: total === 0 ? 'muted' : index === monthlyTotals.length - 1 ? 'accent' : 'primary',
        };
      }),
    },
    methods: data.paymentMethods.map(formatPaymentMethod),
  };
}

export default function Billing({ userEmail, onSignOut }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [refreshing, setRefreshing] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');
  const [action, setAction] = useState('');

  const loadDashboard = useCallback(async (options = {}) => {
    const data = await getBillingDashboard(CUSTOMER_ID, options);
    setDashboard(formatDashboard(data));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadDashboard({ signal: controller.signal })
      .catch((loadError) => {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setRefreshing(false);
        }
      });
    return () => controller.abort();
  }, [loadDashboard]);

  const currentPlan = dashboard?.currentPlan ?? null;
  const q = search.trim().toLowerCase();
  const visibleUsage = useMemo(() => {
    const usage = dashboard?.usage || [];
    return q ? usage.filter((item) => item.title.toLowerCase().includes(q)) : usage;
  }, [dashboard, q]);
  const visibleMethods = useMemo(() => {
    const methods = dashboard?.methods || [];
    return q
      ? methods.filter((method) => `${method.label} ${method.last4}`.toLowerCase().includes(q))
      : methods;
  }, [dashboard, q]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setError('');
    try {
      await loadDashboard();
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setRefreshing(false);
    }
  };

  const runAction = async (actionName, callback) => {
    setAction(actionName);
    setError('');
    try {
      await callback();
      await loadDashboard();
    } catch (actionError) {
      setError(actionError.message);
      throw actionError;
    } finally {
      setAction('');
    }
  };

  const handleSelectPlan = async (planId) => {
    if (!dashboard?.subscription) {
      setError('There is no active subscription to change. Contact support to create one.');
      return;
    }
    await runAction('plan', () => changeSubscriptionPlan(dashboard.subscription.id, planId));
  };

  const handleSetDefault = (methodId) =>
    runAction('payment', () => setPrimaryPaymentMethod(methodId, CUSTOMER_ID));

  const handleAddPaymentMethod = (paymentMethod) =>
    runAction('payment', () => addPaymentMethod(CUSTOMER_ID, paymentMethod));

  const handleDeletePaymentMethod = (methodId) =>
    runAction('payment', () => deletePaymentMethod(methodId, CUSTOMER_ID));

  const handleExport = () => {
    if (!dashboard) return;
    const rows = [
      ['Field', 'Value'],
      ['Current Plan', currentPlan ? currentPlan.name : 'None'],
      ['Period', dashboard.summary.period],
      ['Amount Due', dashboard.summary.amountDue],
      ['Last Payment', dashboard.summary.lastPayment],
      ['Total Paid', dashboard.history.totalPaid],
      ['Outstanding', dashboard.history.outstanding],
      ...dashboard.usage.map((item) => [item.title, item.amount]),
    ];
    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'billing-summary.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="billing-page" id="billing-module">
      <TopNav
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        categories={categories}
      />

      <PageHeader
        userName={userEmail ? userEmail.split('@')[0] : 'Customer'}
        hasActivePlan={Boolean(currentPlan)}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onExport={handleExport}
        onSignOut={onSignOut}
      />

      {error && (
        <p className="billing-feedback billing-error" role="alert">
          {error}
        </p>
      )}
      {refreshing && !dashboard && (
        <p className="billing-feedback">Loading billing information...</p>
      )}

      {dashboard && (
        <>
          <StatCards currentPlan={currentPlan} summary={dashboard.summary} />

          <UsageOverview items={visibleUsage} />

          <section className="split-section">
            <BillingHistory history={dashboard.history} />
            <PaymentMethods
              methods={visibleMethods}
              defaultId={dashboard.methods.find((method) => method.primary)?.id}
              busy={Boolean(action)}
              onSetDefault={handleSetDefault}
              onAdd={handleAddPaymentMethod}
              onDelete={handleDeletePaymentMethod}
            />
          </section>

          <PricingPlans
            plans={dashboard.plans}
            currentPlanId={dashboard.currentPlanId}
            busy={Boolean(action)}
            onSelect={handleSelectPlan}
          />
        </>
      )}
    </main>
  );
}
