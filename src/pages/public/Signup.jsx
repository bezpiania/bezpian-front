import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { message } from 'antd';
import useSignup from '../../hooks/useSignup.js';
import BrainSVG from '../../components/BrainSVG.jsx';
import '../../styles/auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Plan: se puede elegir en el registro (o venir preseleccionado por ?plan=).
  const initialPlan = ['basico', 'pro', 'enterprise'].includes(searchParams.get('plan')) ? searchParams.get('plan') : 'basico';
  const [plan, setPlan] = useState(initialPlan);
  const { mutate: signup, isPending } = useSignup();

  const PLAN_OPTIONS = [
    { key: 'basico',     label: 'Básico',  price: '$50.000',      desc: '1 chatbot · 100 conv.' },
    { key: 'pro',        label: 'Pro',     price: '$85.000',      desc: '1 chatbot · 500 conv.' },
    { key: 'enterprise', label: 'Empresa', price: '$60.000',  desc: 'hasta 4 bots · +$15.000 bot extra · marca blanca' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      message.error('Completa todos los campos');
      return;
    }

    if (formData.password.length < 8) {
      message.error('La contraseña debe tener mínimo 8 caracteres');
      return;
    }

    if (!agreeTerms) {
      message.error('Debes aceptar los términos y política de privacidad');
      return;
    }

    signup(
      { email: formData.email, password: formData.password, name: formData.name, plan },
      {
        onSuccess: (response) => {
          if (response?.success) {
            message.success('Cuenta creada exitosamente');
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('workspaceId', response.data.user.defaultWorkspaceId);
            navigate('/bots');
          } else {
            message.error(response?.message || 'Error al crear cuenta');
          }
        },
        onError: (error) => {
          const errorMsg =
            error?.response?.data?.message || error?.message || 'Error al registrarse';
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
            <span className="auth-eyebrow">00 · Crear cuenta</span>
          </div>

          <h1 className="auth-headline">
            Crea tu<br />
            <em>Øpia.</em>
          </h1>

          <p className="auth-subheading">
            Cinco minutos, cero developers. Tu bot empieza a vender <em>esta noche.</em>
          </p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label className="auth-field-label">Elige tu plan</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {PLAN_OPTIONS.map(opt => {
                  const active = plan === opt.key;
                  return (
                    <button
                      type="button"
                      key={opt.key}
                      onClick={() => setPlan(opt.key)}
                      style={{
                        textAlign: 'left', cursor: 'pointer', borderRadius: 12, padding: '10px 12px',
                        border: active ? '2px solid #15140F' : '1px solid #d8d5cc',
                        background: active ? '#15140F' : 'transparent',
                        color: active ? '#DCFF1E' : '#15140F', transition: 'all .12s',
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{opt.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, margin: '2px 0' }}>{opt.price}</div>
                      <div style={{ fontSize: 10, opacity: active ? 0.8 : 0.55, lineHeight: 1.3 }}>{opt.desc}</div>
                    </button>
                  );
                })}
              </div>
              <p style={{ fontSize: 11, opacity: 0.55, marginTop: 6 }}>7 días de prueba gratis · sin tarjeta · pagas después</p>
            </div>

            <div className="auth-field">
              <label className="auth-field-label" htmlFor="name">
                Tu nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="María González"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

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
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-field-label" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="•••••••••••"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="8"
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

            <div className="auth-field-row">
              <label className="auth-checkbox">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <span className="auth-box"></span>
                <span>
                  Acepto los <a href="#terms">Términos</a> y la{' '}
                  <a href="#privacy">Política de privacidad</a>
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="auth-btn-submit"
              disabled={!agreeTerms || isPending}
            >
              {isPending ? 'Creando cuenta…' : 'Crear mi Øpia'}
            </button>

            <div className="auth-divider">
              <span>o regístrate con</span>
            </div>

            <button type="button" className="auth-btn-social" onClick={() => { window.location.href = `${import.meta.env.VITE_API_APP}/api/auth/google`; }}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
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
            <em>¿Ya tienes cuenta?</em>
            <Link to="/login">Iniciar sesión →</Link>
          </div>
          <div>
            <span>Términos</span>
            <span className="auth-sep"></span>
            <span>Privacidad</span>
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

export default Signup;
