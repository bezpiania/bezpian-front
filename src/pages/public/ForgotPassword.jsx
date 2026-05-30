import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { message } from 'antd';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return message.warning('Ingresa tu email');
    message.success('Si la cuenta existe, te llegará un link en breve');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '64px 24px' }}>
      <div style={{ maxWidth: 460, width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 48 }}>
          <div style={{ width: 36, height: 36, background: 'var(--carbon)', color: 'var(--voltage)', display: 'grid', placeItems: 'center', borderRadius: 9, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, letterSpacing: '-0.05em' }}>Z</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, letterSpacing: '-0.035em' }}>Zapien</div>
        </div>

        <div className="auth-eyebrow" style={{ textAlign: 'center', justifyContent: 'center' }}>¿Olvidaste la clave?</div>
        <h1 className="auth-title" style={{ fontSize: 38, textAlign: 'center' }}>
          Te pasa a <em>todos.</em>
        </h1>
        <p className="auth-sub" style={{ textAlign: 'center', margin: '0 auto 32px' }}>
          Pon tu email y te mandamos un link para crear una nueva. Sin preguntas raras.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <div className="field-label">Email de tu cuenta</div>
            <input
              type="email"
              className="input"
              placeholder="tu@empresa.cl"
              style={{ padding: '14px 16px', fontSize: 16 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 15, justifyContent: 'center', fontSize: 15 }}>
            Enviar link de recuperación
            <svg><use href="#i-send" /></svg>
          </button>

          <div className="auth-meta">
            ¿Te acordaste? <Link to="/login">Volver al login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
