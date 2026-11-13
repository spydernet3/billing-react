import { useState } from 'react';

const logo = `${import.meta.env.BASE_URL}assets/logo.svg`;

function BrandLogo({ brand }) {
  if (brand.toLowerCase() === 'visa') return <span className="card-logo visa-text">VISA</span>;
  if (brand.toLowerCase() !== 'mastercard') return <span className="card-logo">{brand}</span>;
  return (
    <span className="mastercard-circles">
      <span className="circle-red" />
      <span className="circle-orange" />
    </span>
  );
}

export default function PaymentMethods({
  methods,
  defaultId,
  busy,
  onSetDefault,
  onAdd,
  onDelete,
}) {
  const [adding, setAdding] = useState(false);
  const [formError, setFormError] = useState('');
  const [brand, setBrand] = useState('Visa');
  const [lastFour, setLastFour] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [makePrimary, setMakePrimary] = useState(false);

  const handleAdd = async (event) => {
    event.preventDefault();
    setFormError('');
    try {
      await onAdd({
        brand,
        lastFour,
        expiryMonth: Number(expiryMonth),
        expiryYear: Number(expiryYear),
        makePrimary,
      });
      setAdding(false);
      setLastFour('');
      setExpiryMonth('');
      setExpiryYear('');
      setMakePrimary(false);
    } catch (error) {
      setFormError(error.message);
    }
  };

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
                <div className="payment-actions">
                  <button
                    type="button"
                    className="btn-set-default"
                    disabled={busy}
                    onClick={() => onSetDefault(m.id).catch(() => {})}
                  >
                    Set Default
                  </button>
                  <button
                    type="button"
                    className="btn-remove-method"
                    disabled={busy}
                    onClick={() => {
                      if (window.confirm(`Remove the ${m.label} ending in ${m.last4}?`)) {
                        onDelete(m.id).catch(() => {});
                      }
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button type="button" className="btn-add-method" onClick={() => setAdding(true)}>
        + Add New Payment Method
      </button>

      {adding && (
        <div className="payment-dialog-backdrop">
          <form className="payment-dialog" onSubmit={handleAdd}>
            <h4>Add payment method</h4>
            <label htmlFor="payment-brand">Card brand</label>
            <select
              id="payment-brand"
              value={brand}
              onChange={(event) => setBrand(event.target.value)}
            >
              <option>Visa</option>
              <option>Mastercard</option>
              <option>American Express</option>
              <option>Discover</option>
            </select>

            <label htmlFor="payment-last-four">Last four digits</label>
            <input
              id="payment-last-four"
              inputMode="numeric"
              pattern="[0-9]{4}"
              maxLength={4}
              value={lastFour}
              onChange={(event) => setLastFour(event.target.value)}
              required
            />

            <div className="payment-expiry-fields">
              <div>
                <label htmlFor="payment-expiry-month">Expiry month</label>
                <select
                  id="payment-expiry-month"
                  value={expiryMonth}
                  onChange={(event) => setExpiryMonth(event.target.value)}
                  required
                >
                  <option value="">Month</option>
                  {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
                    <option key={month} value={month}>
                      {String(month).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="payment-expiry-year">Expiry year</label>
                <input
                  id="payment-expiry-year"
                  type="number"
                  min={new Date().getFullYear()}
                  max={new Date().getFullYear() + 30}
                  value={expiryYear}
                  onChange={(event) => setExpiryYear(event.target.value)}
                  required
                />
              </div>
            </div>

            <label className="payment-primary-choice">
              <input
                type="checkbox"
                checked={makePrimary}
                onChange={(event) => setMakePrimary(event.target.checked)}
              />
              Make this the default payment method
            </label>

            {formError && (
              <p className="billing-error" role="alert">
                {formError}
              </p>
            )}
            <div className="payment-dialog-actions">
              <button type="button" className="btn-set-default" onClick={() => setAdding(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-plan-action" disabled={busy}>
                {busy ? 'Saving...' : 'Add method'}
              </button>
            </div>
            <p className="payment-security-note">
              Only the card brand, last four digits, and expiry are sent. Never enter a full card
              number or security code.
            </p>
          </form>
        </div>
      )}
    </article>
  );
}
