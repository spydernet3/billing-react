import { useMemo, useState } from 'react';
import './Billing.css';

import TopNav from './components/TopNav.jsx';
import PageHeader from './components/PageHeader.jsx';
import StatCards from './components/StatCards.jsx';
import UsageOverview from './components/UsageOverview.jsx';
import BillingHistory from './components/BillingHistory.jsx';
import PaymentMethods from './components/PaymentMethods.jsx';
import PricingPlans from './components/PricingPlans.jsx';

import {
  user,
  plans,
  billingSummary,
  usage,
  history,
  initialPaymentMethods,
  categories,
} from './data/billingData.js';

export default function Billing() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState('enterprise');
  const [methods] = useState(initialPaymentMethods);
  const [defaultMethodId, setDefaultMethodId] = useState(initialPaymentMethods[0].id);

  const currentPlan = useMemo(
    () => plans.find((p) => p.id === currentPlanId) ?? null,
    [currentPlanId]
  );

  // Search filters the usage cards and the payment methods by text.
  const q = search.trim().toLowerCase();
  const visibleUsage = q ? usage.filter((u) => u.title.toLowerCase().includes(q)) : usage;
  const visibleMethods = q
    ? methods.filter((m) => `${m.label} ${m.last4}`.toLowerCase().includes(q))
    : methods;

  const handleRefresh = () => {
    setRefreshing(true);
    // Replace with a real data fetch when you connect an API.
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleExport = () => {
    const rows = [
      ['Field', 'Value'],
      ['Current Plan', currentPlan ? currentPlan.name : 'None'],
      ['Period', billingSummary.period],
      ['Amount Due', billingSummary.amountDue],
      ['Last Payment', billingSummary.lastPayment],
      ['Total Paid', history.totalPaid],
      ['Outstanding', history.outstanding],
      ...usage.map((u) => [u.title, u.amount]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'billing-summary.csv';
    a.click();
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
        userName={user.name}
        hasActivePlan={Boolean(currentPlan)}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onExport={handleExport}
      />

      <StatCards currentPlan={currentPlan} summary={billingSummary} />

      <UsageOverview items={visibleUsage} />

      <section className="split-section">
        <BillingHistory history={history} />
        <PaymentMethods
          methods={visibleMethods}
          defaultId={defaultMethodId}
          onSetDefault={setDefaultMethodId}
          onAdd={() => {
            /* TODO: open an "Add payment method" modal / call your payments API */
          }}
        />
      </section>

      <PricingPlans
        plans={plans}
        currentPlanId={currentPlanId}
        onSelect={setCurrentPlanId}
        onDeactivate={() => setCurrentPlanId(null)}
      />
    </main>
  );
}
