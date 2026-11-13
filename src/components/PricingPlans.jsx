function PlanCard({ plan, isCurrent, onSelect, busy }) {
  return (
    <div className={`plan-card${isCurrent ? ' featured-plan' : ''}`}>
      {isCurrent && <div className="featured-badge">Current Plan</div>}
      <h4 className="plan-type">{plan.name}</h4>
      <div className="plan-price">
        <span className="plan-cur">$</span>
        <span className="plan-val">{plan.price}</span>
        <span className="plan-term">/month</span>
      </div>
      <p className="plan-desc">{plan.description}</p>
      <div className="plan-divider">
        <span>WHAT YOU WILL GET</span>
      </div>
      <ul className="features-list">
        {plan.features.map((f) => (
          <li key={f}>
            <span className="check">✓</span> {f}
          </li>
        ))}
      </ul>

      {isCurrent ? (
        <button type="button" className="btn-plan-active" disabled>
          Active Plan
        </button>
      ) : (
        <button
          type="button"
          className="btn-plan-action"
          disabled={busy}
          onClick={() => onSelect(plan.id).catch(() => {})}
        >
          Select Plan
        </button>
      )}
    </div>
  );
}

export default function PricingPlans({ plans, currentPlanId, onSelect, busy }) {
  return (
    <section className="pricing-panel">
      <div className="pricing-header-center">
        <h2 className="pricing-title">Choose the Right Plan for Your Business</h2>
        <p className="pricing-subtitle">
          Scale your team and power your business with transparent, predictable pricing.
        </p>
      </div>

      <div className="plans-grid">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isCurrent={plan.id === currentPlanId}
            onSelect={onSelect}
            busy={busy}
          />
        ))}
      </div>
    </section>
  );
}
