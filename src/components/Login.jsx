import { useState } from 'react';
import './Login.css';
import { signIn } from '../api/billing.js';

const logo = `${import.meta.env.BASE_URL}assets/logo.svg`;

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const result = await signIn(email, password);
      if (typeof result?.accessToken !== 'string' || !result.accessToken.trim()) {
        throw new Error('The API response did not include an access token.');
      }
      onLogin(result.accessToken, email);
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <img className="login-logo" src={logo} alt="EDABIP" />
        <p className="login-eyebrow">BILLING PORTAL</p>
        <h1 id="login-title">Welcome back</h1>
        <p className="login-description">Sign in to manage your billing and subscription.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
          />

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="login-submit" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="login-demo">
          Local demo: <strong>demo@example.com</strong> / <strong>demo123</strong>
        </p>
      </section>
    </main>
  );
}
