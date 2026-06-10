import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { message } from 'antd';
import api from '../../apis/app.js';
import BrainSVG from '../../components/BrainSVG.jsx';
import '../../styles/auth.css';

const ROLE_LABELS = { admin: 'Administrador', member: 'Operador', owner: 'Owner' };

const AcceptInvite = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('signup'); // 'signup' | 'login'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) { setError('Token de invitación no encontrado'); setLoading(false); return; }
    api.get(`/api/invitations/${token}`)
      .then(data => {
        setInvitation(data.data);
        setForm(f => ({ ...f, email: data.data.email }));
      })
      .catch(() => setError('Invitación inválida o expirada'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.password || (mode === 'signup' && !form.name)) {
      message.error('Completa todos los campos'); return;
    }
    setSubmitting(true);
    try {
      let accessToken;

      if (mode === 'signup') {
        const res = await api.post('/api/auth/signup', { name: form.name, email: form.email, password: form.password });
        if (!res.success) { message.error(res.message || 'Error al crear cuenta'); setSubmitting(false); return; }
        accessToken = res.data.accessToken;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      } else {
        const res = await api.post('/api/auth/login', { email: form.email, password: form.password });
        if (!res.success) { message.error(res.message || 'Email o contraseña incorrectos'); setSubmitting(false); return; }
        accessToken = res.data.accessToken;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }

      // Accept invitation
      const acceptRes = await api.post(`/api/invitations/${token}/accept`);
      if (acceptRes.success) {
        localStorage.setItem('workspaceId', acceptRes.workspaceId);
        localStorage.setItem('workspaceRole', acceptRes.role || 'member');
        message.success(`¡Bienvenido a ${invitation.workspaceName}!`);
        navigate('/bots');
      } else {
        message.error(acceptRes.message || 'Error al aceptar invitación');
      }
    } catch (err) {
      message.error(err?.response?.data?.message || 'Error inesperado');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="auth-layout" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, opacity: 0.5 }}>Verificando invitación...</div>
    </div>
  );

  if (error) return (
    <div className="auth-layout" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, marginBottom: 8 }}>{error}</div>
        <Link to="/login" style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>Ir al inicio →</Link>
      </div>
    </div>
  );

  return (
    <div className="auth-layout">
      <div className="auth-form-panel">
        <div className="auth-form-top">
          <a href="/" className="auth-brand"><BrainSVG /><span>Bezpian</span></a>
        </div>

        <div className="auth-form-shell">
          <div className="auth-form-eyebrow">
            <span className="auth-pulse-dot"></span>
            <span className="auth-eyebrow">Invitación · {invitation.workspaceName}</span>
          </div>

          <h1 className="auth-headline">
            Únete a<br /><em>{invitation.workspaceName}.</em>
          </h1>

          <p className="auth-subheading">
            Fuiste invitado como <strong>{ROLE_LABELS[invitation.role] || invitation.role}</strong>.
            {mode === 'signup' ? ' Crea tu cuenta para entrar.' : ' Inicia sesión para aceptar.'}
          </p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {mode === 'signup' && (
              <div className="auth-field">
                <label className="auth-field-label">Tu nombre</label>
                <input type="text" placeholder="María González" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
            )}

            <div className="auth-field">
              <label className="auth-field-label">Email</label>
              <input type="email" value={form.email} readOnly
                style={{ opacity: 0.7, cursor: 'not-allowed', background: 'var(--bone-2)' }} />
            </div>

            <div className="auth-field">
              <label className="auth-field-label">Contraseña</label>
              <input type="password" placeholder="•••••••••" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength="8" />
            </div>

            <button type="submit" className="auth-btn-submit" disabled={submitting}>
              {submitting ? 'Procesando...' : mode === 'signup' ? 'Crear cuenta y unirme →' : 'Iniciar sesión y unirme →'}
            </button>
          </form>

          <div style={{ marginTop: 20, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, opacity: 0.6 }}>
            {mode === 'signup' ? (
              <>¿Ya tienes cuenta? <button onClick={() => setMode('login')} style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit', fontSize: 'inherit' }}>Iniciar sesión</button></>
            ) : (
              <>¿No tienes cuenta? <button onClick={() => setMode('signup')} style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit', fontSize: 'inherit' }}>Crear una</button></>
            )}
          </div>
        </div>
      </div>

      <div className="auth-visual-panel">
        <div className="auth-visual-top">
          <span className="auth-section-num">{invitation.workspaceName}</span>
        </div>
        <div className="auth-visual-content">
          <div className="auth-visual-quote">
            Tu equipo<br /><em>te espera.</em>
          </div>
        </div>
        <div className="auth-visual-footer">
          <span>Invitación válida por 7 días</span>
          <span className="auth-mark">Bezpian</span>
        </div>
      </div>
    </div>
  );
};

export default AcceptInvite;
