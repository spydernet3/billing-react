export default function UsageOverview({ items }) {
  return (
    <section className="usage-section">
      <h3 className="section-heading">Usage Overview (Current Period)</h3>
      <div className="usage-grid">
        {items.map((item) => {
          const pct =
            Number.isFinite(item.percentageUsed) && item.percentageUsed >= 0
              ? Math.round(item.percentageUsed)
              : item.limit > 0
                ? Math.round((item.used / item.limit) * 100)
                : 0;
          const barWidth = Math.min(pct, 100);
          return (
            <div className="usage-card" key={item.id}>
              <div className="usage-header">
                <span className="usage-title">{item.title}</span>
                <span className="usage-pct">{pct}%</span>
              </div>
              <div className="usage-amount">{item.amount}</div>
              <div
                className="progress-bar"
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={item.title}
              >
                <div className="progress-fill" style={{ width: `${barWidth}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
