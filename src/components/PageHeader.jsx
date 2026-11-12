import { RefreshIcon, DownloadIcon } from './Icons.jsx';

export default function PageHeader({ userName, hasActivePlan, refreshing, onRefresh, onExport }) {
  return (
    <section className="page-header">
      <div className="header-left">
        <h1 className="main-title">Billing</h1>
        <div className="welcome-row">
          <h2>Welcome Back, {userName}!</h2>
          {hasActivePlan && <span className="status-badge-outline">Active Plan</span>}
        </div>
        <p className="tagline">
          Stay updated with real-time usage metrics and manage your account seamlessly.
        </p>
      </div>

      <div className="header-actions">
        <button type="button" className="btn-refresh" onClick={onRefresh} disabled={refreshing}>
          <RefreshIcon />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
        <button type="button" className="btn-export" onClick={onExport}>
          <DownloadIcon />
          Export
        </button>
      </div>
    </section>
  );
}
