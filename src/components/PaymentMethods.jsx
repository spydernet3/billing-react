const logo = `${import.meta.env.BASE_URL}assets/logo.svg`;

function BrandLogo({ brand }) {
  if (brand === 'visa') return <span className="card-logo visa-text">VISA</span>;
  return (
    <span className="mastercard-circles">
      <span className="circle-red" />
      <span className="circle-orange" />
    </span>
  );
}

export default function PaymentMethods({ methods, defaultId, onSetDefault, onAdd }) {
  return (
    <article className="panel-card">
      <div className="panel-top-bar">
        <h3 className="panel-heading">Payment Method</h3>
        <div className="payment-brand-badge">
          <img src={logo} alt="Badge" />
        </div>
      </div>

      <div className="cards-stack">
        {methods.map((m) => {
          const isDefault = m.id === defaultId;
          return (
            <div className={`payment-card-row${isDefault ? ' selected' : ''}`} key={m.id}>
              <div className="card-left">
                <span className={`radio-dot${isDefault ? ' active' : ''}`} />
                <BrandLogo brand={m.brand} />
                <div className="card-text">
                  <span className="card-name">
                    {m.label} ending in {m.last4}
                  </span>
                  <span className="card-sub">Expires {m.expires}</span>
                </div>
              </div>
              {isDefault ? (
                <span className="card-status-badge">Default</span>
              ) : (
                <button type="button" className="btn-set-default" onClick={() => onSetDefault(m.id)}>
                  Set Default
                </button>
              )}
            </div>
          );
        })}
      </div>

      <button type="button" className="btn-add-method" onClick={onAdd}>
        + Add New Payment Method
      </button>
    </article>
  );
}
