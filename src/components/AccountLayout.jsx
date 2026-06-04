import React from 'react';
import { useNavigate } from 'react-router-dom';
import { clearActiveBot } from '../hooks/useActiveBot.js';

/**
 * AccountLayout — layout para páginas de cuenta (Equipo, Plan, Perfil).
 * Sin sidebar de chatbot. Tiene header mínimo con botón volver a /bots.
 */
const AccountLayout = ({ children }) => {
  const navigate = useNavigate();

  let user = null;
  try { user = JSON.parse(localStorage.getItem('user') || 'null'); } catch {}
  const userName    = user?.name  || 'Usuario';
  const userInitial = (userName[0] || 'U').toUpperCase();

  const handleLogout = () => {
    ['user','accessToken','refreshToken','workspaceId','workspaceRole'].forEach(k => localStorage.removeItem(k));
    clearActiveBot();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bone)' }}>
      {/* Top bar */}
      <div style={{ borderBottom: '1px solid var(--rule)', padding: '12px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bone)' }}>
        <button
          onClick={() => navigate('/bots')}
          className="btn btn-ghost btn-sm"
          style={{ gap: 6 }}
        >
          <svg style={{ width: 14, height: 14 }}><use href="#i-arrow-left" /></svg>
          Mis chatbots
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'var(--bone-2)', border: '1px solid var(--rule)', borderRadius: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--carbon)', color: 'var(--voltage)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12 }}>
            {userInitial}
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.6 }}>{userName}</span>
          <button onClick={handleLogout} title="Cerrar sesión"
            style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.4, padding: 2, display: 'flex', alignItems: 'center' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.4'}
          >
            <svg style={{ width: 14, height: 14 }}><use href="#i-logout" /></svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px' }}>
        {children}
      </main>
    </div>
  );
};

export default AccountLayout;
