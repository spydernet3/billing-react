export default function BillingHistory({ history }) {
  const stats = [
    { label: 'Total Paid', value: history.totalPaid },
    { label: 'Total Invoiced', value: history.totalInvoiced },
    { label: 'Outstanding Amount', value: history.outstanding },
  ];

  return (
    <article className="panel-card">
      <h3 className="panel-heading">Billing History</h3>
      <div className="history-content-wrap">
        <div className="history-stats">
          {stats.map((s) => (
            <div className="history-item" key={s.label}>
              <span className="history-label">{s.label}</span>
              <strong className="history-value">{s.value}</strong>
            </div>
          ))}
        </div>

        <div className="chart-container" aria-hidden="true">
          {history.bars.map((bar, i) => (
            <div className="bar-slot" key={i}>
              <div className={`chart-bar bar-${bar.tone}`} style={{ height: `${bar.height}%` }} />
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
