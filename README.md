# Billing Page (React + Vite)

React version of the EDABIP Billing page. The original `Billing.css` is used unchanged.

## Run
```
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in /dist
```

## Structure
```
src/
  Billing.jsx            page + state (search, plan, default card, refresh, export)
  Billing.css            your original stylesheet
  data/billingData.js    all demo data (swap for API calls)
  components/            TopNav, PageHeader, StatCards, UsageOverview,
                         BillingHistory, PaymentMethods, PricingPlans, Icons
public/assets/logo.svg   placeholder logo - replace with your own
```
