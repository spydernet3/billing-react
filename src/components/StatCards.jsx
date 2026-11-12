import { BriefcaseIcon, CalendarIcon, DollarIcon, CheckCircleIcon } from './Icons.jsx';

function StatCard({ icon, title, value, pill, pillTone }) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <div className="stat-icon">{icon}</div>
        <span className="stat-title">{title}</span>
      </div>
      <div className="stat-value">{value}</div>
      <span className={`pill pill-${pillTone}`}>{pill}</span>
    </article>
  );
}

export default function StatCards({ currentPlan, summary }) {
  return (
    <section className="stats-grid">
      <StatCard
        icon={<BriefcaseIcon />}
        title="Current Plan"
        value={currentPlan ? currentPlan.name : 'No plan'}
        pill={currentPlan ? 'Active Plan' : 'Inactive'}
        pillTone={currentPlan ? 'green' : 'orange'}
      />
      <StatCard
        icon={<CalendarIcon />}
        title="Current Period"
        value={summary.period}
        pill={summary.renewal}
        pillTone="green"
      />
      <StatCard
        icon={<DollarIcon />}
        title="Amount Due"
        value={summary.amountDue}
        pill={summary.dueDate}
        pillTone="orange"
      />
      <StatCard
        icon={<CheckCircleIcon />}
        title="Last Payment"
        value={summary.lastPayment}
        pill={summary.lastPaymentDate}
        pillTone="green"
      />
    </section>
  );
}
