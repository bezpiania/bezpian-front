import React from 'react';
import { Link } from 'react-router-dom';

const VerifyEmail = () => (
  <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '64px 24px' }}>
    <div style={{ maxWidth: 480, textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 48 }}>
        <div style={{ width: 36, height: 36, background: 'var(--carbon)', color: 'var(--voltage)', display: 'grid', placeItems: 'center', borderRadius: 9, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, letterSpacing: '-0.05em' }}>Z</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, letterSpacing: '-0.035em' }}>Zapien</div>
      </div>

      <div style={{ width: 96, height: 96, margin: '0 auto 28px', background: 'var(--bone-2)', border: '1px solid var(--rule)', borderRadius: 24, display: 'grid', placeItems: 'center', position: 'relative' }}>
        <svg style={{ width: 42, height: 42, color: 'var(--carbon)' }}><use href="#i-mail" /></svg>
        <div style={{ position: 'absolute', top: -6, right: -6, width: 24, height: 24, background: 'var(--voltage)', borderRadius: '50%', display: 'grid', placeItems: 'center', color: 'var(--carbon)', border: '3px solid var(--bone)' }}>
          <svg style={{ width: 11, height: 11 }} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
      </div>

      <div className="auth-eyebrow" style={{ justifyContent: 'center' }}>Casi listo</div>
      <h1 className="auth-title" style={{ fontSize: 38 }}>
        Revisa tu <span className="hl">correo.</span>
      </h1>
      <p className="auth-sub" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
        Te enviamos un link de verificación a <strong style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>hola@acme.cl</strong>. Haz click ahí y volvemos a estar.
      </p>

      <div style={{ background: 'var(--bone-2)', border: '1px solid var(--rule)', borderRadius: 12, padding: '18px 22px', margin: '32px 0', textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{ fontSize: 20 }}>📬</div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.5 }}>
          <strong style={{ fontFamily: 'var(--font-display)', fontWeight: 600, display: 'block', marginBottom: 4 }}>¿No te llega?</strong>
          Revisa la carpeta de spam o promociones. A veces los proveedores son medio paranoicos con los emails automáticos.
        </div>
      </div>

      <button className="btn btn-ghost" style={{ marginRight: 8 }}>Reenviar correo</button>
      <Link to="/dashboard" className="btn btn-primary">
        Ya verifiqué
        <svg><use href="#i-arrow-right" /></svg>
      </Link>

      <div style={{ marginTop: 36, fontFamily: 'var(--font-body)', fontSize: 13.5, opacity: 0.6 }}>
        ¿Email equivocado?{' '}
        <Link to="/login" style={{ borderBottom: '2px solid var(--voltage)', cursor: 'pointer' }}>
          Cámbialo acá
        </Link>
      </div>
    </div>
  </div>
);

export default VerifyEmail;
