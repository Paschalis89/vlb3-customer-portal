import { Activity, Eye, EyeOff, LockKeyhole, Mail, Waves } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { appConfig } from '../config/app';
import { brandingConfig } from '../config/branding';
import { DEMO_LOGIN } from '../demo/auth';
import { useAuth } from '../hooks/useAuth';

interface LocationState {
  from?: {
    pathname?: string;
  };
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isSubmitting } = useAuth();
  const [email, setEmail] = useState(appConfig.demoMode ? DEMO_LOGIN.email : '');
  const [password, setPassword] = useState(appConfig.demoMode ? DEMO_LOGIN.password : '');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const state = location.state as LocationState | null;
  const destination = state?.from?.pathname ?? '/';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      await login({ email, password });
      navigate(destination, { replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Accesso non riuscito.');
    }
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-card__brand">
          <div className="login-card__brand-icon" aria-hidden="true">
            <Activity size={23} />
          </div>
          <div>
            <strong>{brandingConfig.appName}</strong>
            <span>Customer Portal</span>
          </div>
        </div>

        <div className="login-card__heading">
          <span>Accesso clienti</span>
          <h1 id="login-title">Bentornato</h1>
          <p>Accedi per controllare impianti, allarmi e stato delle pompe.</p>
        </div>

        {appConfig.demoMode ? (
          <div className="login-demo-note">
            <Waves size={18} />
            <div>
              <strong>Demo mode attivo</strong>
              <span>Le credenziali demo sono gia inserite.</span>
            </div>
          </div>
        ) : null}

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label className="form-field">
            <span>Email</span>
            <div className="form-field__control">
              <Mail size={18} aria-hidden="true" />
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nome@azienda.it"
                required
                disabled={isSubmitting}
              />
            </div>
          </label>

          <label className="form-field">
            <span>Password</span>
            <div className="form-field__control">
              <LockKeyhole size={18} aria-hidden="true" />
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                required
                disabled={isSubmitting}
              />
              <button
                className="form-field__icon-button"
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <button className="login-forgot" type="button" disabled={isSubmitting}>
            Password dimenticata?
          </button>

          {error ? (
            <div className="form-error" role="alert">
              {error}
            </div>
          ) : null}

          <button className="button button--primary button--full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>

        {appConfig.demoMode ? (
          <div className="demo-credentials">
            <span>Demo</span>
            <code>{DEMO_LOGIN.email}</code>
            <code>{DEMO_LOGIN.password}</code>
          </div>
        ) : null}
      </section>
    </main>
  );
}
