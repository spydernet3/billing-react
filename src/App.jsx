import { useEffect, useState } from 'react';
import Billing from './Billing.jsx';
import Login from './components/Login.jsx';
import { TOKEN_STORAGE_KEY } from './api/http.js';

export default function App() {
  const [accessToken, setAccessToken] = useState(
    () => sessionStorage.getItem(TOKEN_STORAGE_KEY)
  );

  useEffect(() => {
    const handleUnauthorized = () => {
      sessionStorage.removeItem('edabip_user_email');
      setAccessToken(null);
    };
    window.addEventListener('api:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('api:unauthorized', handleUnauthorized);
  }, []);

  const handleLogin = (token, email) => {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    sessionStorage.setItem('edabip_user_email', email);
    setAccessToken(token);
  };

  const handleSignOut = () => {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem('edabip_user_email');
    setAccessToken(null);
  };

  if (!accessToken) {
    return <Login onLogin={handleLogin} />;
  }

  return <Billing userEmail={sessionStorage.getItem('edabip_user_email') || ''} onSignOut={handleSignOut} />;
}
