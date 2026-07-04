import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { message } from 'antd';
import useLogin from '../../hooks/useLogin.js';
import BrainSVG from '../../components/BrainSVG.jsx';
import '../../styles/auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      message.error('Completa todos los campos');
      return;
    }

    login(
      { email, password },
      {
        onSuccess: (response) => {
          if (response?.success) {
            message.success(response.message || 'Inicio de sesión exitoso');
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('workspaceId', response.data.user.defaultWorkspaceId);
            localStorage.setItem('workspaceRole', response.data.user.workspaceRole || 'member');
            localStorage.setItem('workspacePlan', response.data.user.workspacePlan || 'free');
            if (response.data.user.scopedChatbotId) {
              localStorage.setItem('scopedChatbotId', response.data.user.scopedChatbotId);
            } else {
              localStorage.removeItem('scopedChatbotId');
            }
            navigate('/bots');
          } else {
            message.warning(response?.message || 'No se pudo iniciar sesión');
          }
        },
        onError: (error) => {
          const isNetwork = !error?.response;
          if (isNetwork) {
            message.info('Sin backend · entrando en modo demo');
            localStorage.setItem(
              'user',
              JSON.stringify({ id: 'demo', name: 'Sebastián R.', email, plan: 'PRO' })
            );
            navigate('/bots');
            return;
          }
          const errorMsg =
            error?.response?.data?.message || error?.message || 'Error al iniciar sesión';
          message.error(errorMsg);
        },
      }
    );
  };

  return (
    <div className="auth-layout">
      {/* Form Panel */}
      <div className="auth-form-panel">
        <div className="auth-form-top">
          <a href="/" className="auth-brand">
            <BrainSVG />
            <span>Øpia</span>
          </a>
          <button className="auth-back-link" onClick={() => navigate('/')}>
            Volver al sitio
          </button>
        </div>

        <div className="auth-form-shell">
          <div className="auth-form-eyebrow">
            <span className="auth-pulse-dot"></span>
            <span className="auth-eyebrow">00 · Acceder a tu cuenta</span>
          </div>

          <h1 className="auth-headline">
            Vuelve a tu<br />
            <em>Øpia.</em>
          </h1>

          <p className="auth-subheading">
            Donde lo dejaste, todo sigue vendiendo. <em>Entra y mira lo que pasó mientras no estabas.</em>
          </p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label className="auth-field-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="hola@tuempresa.cl"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-field-label" htmlFor="password">
                Contraseña
                <Link to="/recuperar">¿La olvidaste?</Link>
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="•••••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
              <button
                type="button"
                className="auth-field-reveal"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            <button
              type="submit"
              className="auth-btn-submit"
              disabled={isPending}
            >
              {isPending ? 'Conectando…' : 'Entrar a mi Øpia'}
            </button>

            <div className="auth-divider">
              <span>o continúa con</span>
            </div>

            <button type="button" className="auth-btn-social" onClick={() => { window.location.href = `${import.meta.env.VITE_API_APP}/api/auth/google`; }}>
              <svg viewBox="0 0 24 24" className="auth-icon-sm">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
              </svg>
              <span>Continuar con Google</span>
            </button>
          </form>
        </div>

        <div className="auth-form-nav">
          <div>
            <em>¿Aún no tienes cuenta?</em>
            <Link to="/signup">Crear mi Øpia gratis</Link>
          </div>
          <div>
            <Link to="/terminos">Términos</Link>
            <span className="auth-sep"></span>
            <Link to="/privacidad">Privacidad</Link>
            <span className="auth-sep"></span>
            <span>© 2026</span>
          </div>
        </div>
      </div>

      {/* Visual Panel */}
      <div className="auth-visual-panel">
        <div className="auth-visual-top">
          <span className="auth-section-num">Tu Øpia · Anoche</span>
          <div className="auth-live">
            <span className="auth-dot-live"></span>
            EN VIVO
          </div>
        </div>

        <div className="auth-visual-content">
          <div className="auth-visual-quote">
            Mientras dormías,<br />
            <em>alguien compraba.</em>
          </div>
          <div className="auth-visual-attribution">
            Reporte de la noche · 03:42 a.m.
          </div>
        </div>

        <div className="auth-visual-stats">
          <div className="auth-visual-stat">
            <div className="auth-visual-stat-value">47</div>
            <div className="auth-visual-stat-label">Conversaciones</div>
          </div>
          <div className="auth-visual-stat">
            <div className="auth-visual-stat-value peak">12</div>
            <div className="auth-visual-stat-label">Cotizaciones</div>
          </div>
          <div className="auth-visual-stat">
            <div className="auth-visual-stat-value">$840K</div>
            <div className="auth-visual-stat-label">En carrito</div>
          </div>
        </div>

        <div className="auth-visual-footer">
          <span>Santiago · CL</span>
          <span className="auth-mark">Øpia</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
