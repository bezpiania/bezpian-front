import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetChatbots } from '../../../hooks/useChatbot.js';
import { setActiveBot, clearActiveBot } from '../../../hooks/useActiveBot.js';
import IconSprite from '../../../components/IconSprite.jsx';

const BIZ_LABELS = {
  restaurant: '🍽️ Restaurante',
  store:      '🛍️ Tienda',
  clinic:     '🏥 Clínica',
  generic:    '🤖 General',
};

const STATUS_DOT = {
  active:  { color: 'var(--green)', label: 'Activo'   },
  paused:  { color: '#F59E0B',      label: 'Pausado'  },
  draft:   { color: 'var(--mist)',  label: 'Borrador' },
};

const BotCard = ({ bot, onOpen, onConfig }) => {
  const status = STATUS_DOT[bot.status] || STATUS_DOT.draft;
  const color  = bot.widget?.color  || '#667eea';
  const avatar = bot.widget?.avatar || '🤖';

  return (
    <div style={{
      background: 'var(--bone)',
      border: '1px solid var(--rule)',
      borderRadius: 16,
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 13, background: color, display: 'grid', placeItems: 'center', fontSize: 24, flexShrink: 0, boxShadow: `0 3px 10px ${color}44` }}>
            {avatar}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17 }}>{bot.name}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.45, marginTop: 2, letterSpacing: '0.06em' }}>
              {BIZ_LABELS[bot.businessType] || BIZ_LABELS.generic}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: status.color }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, opacity: 0.5, letterSpacing: '0.08em' }}>{status.label}</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {[
          { val: bot.stats?.totalConversations || 0, label: 'Chats' },
          { val: bot.stats?.totalLeads         || 0, label: 'Leads' },
          { val: bot.stats?.totalAppointments  || 0, label: 'Citas' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--bone-2)', borderRadius: 8, padding: '8px 6px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>{s.val}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, opacity: 0.45, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 1 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <button
          onClick={() => onOpen(bot)}
          style={{ flex: 1, padding: '10px 14px', background: 'var(--carbon)', color: 'var(--bone)', border: 'none', borderRadius: 10, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'opacity .15s' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          Abrir dashboard →
        </button>
        <button
          onClick={() => onConfig(bot)}
          title="Configurar bot"
          style={{ width: 40, padding: '10px', background: 'var(--bone-2)', border: '1px solid var(--rule)', borderRadius: 10, cursor: 'pointer', display: 'grid', placeItems: 'center', transition: 'background .15s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bone-3)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--bone-2)'}
        >
          <svg style={{ width: 16, height: 16 }}><use href="#i-settings" /></svg>
        </button>
      </div>
    </div>
  );
};

const AccountLink = ({ icon, label, onClick }) => (
  <button onClick={onClick} style={{
    display: 'flex', alignItems: 'center', gap: 10,
    background: 'none', border: '1px solid var(--rule)', borderRadius: 10,
    padding: '10px 16px', cursor: 'pointer', fontFamily: 'var(--font-body)',
    fontSize: 14, color: 'var(--carbon)', transition: 'background .15s',
  }}
    onMouseEnter={e => e.currentTarget.style.background = 'var(--bone-2)'}
    onMouseLeave={e => e.currentTarget.style.background = 'none'}
  >
    <svg style={{ width: 16, height: 16, opacity: 0.6 }}><use href={icon} /></svg>
    {label}
  </button>
);

const BotSelector = () => {
  const navigate    = useNavigate();
  const workspaceId = localStorage.getItem('workspaceId');
  const { data, isLoading } = useGetChatbots(workspaceId);
  const bots = data?.data || [];

  let user = null;
  try { user = JSON.parse(localStorage.getItem('user') || 'null'); } catch {}
  const userName    = user?.name  || 'Usuario';
  const userEmail   = user?.email || '';
  const userInitial = (userName[0] || 'U').toUpperCase();
  const role        = localStorage.getItem('workspaceRole') || 'member';
  const isAdmin     = role === 'admin' || role === 'owner';

  const handleOpen = (bot) => {
    setActiveBot(bot);
    navigate('/dashboard');
  };

  const handleConfig = (bot) => {
    setActiveBot(bot);
    navigate(`/chatbots/${bot._id}`);
  };

  const handleLogout = () => {
    ['user','accessToken','refreshToken','workspaceId','workspaceRole'].forEach(k => localStorage.removeItem(k));
    clearActiveBot();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bone)' }}>

      {/* Top bar */}
      <div style={{ borderBottom: '1px solid var(--rule)', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em' }}>
          Bezpian <span className="pill-pro" style={{ fontSize: 9, verticalAlign: 'middle' }}>PRO</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isAdmin && <>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/equipo')}>
              <svg style={{ width: 14, height: 14 }}><use href="#i-team" /></svg>Equipo
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/plan')}>
              <svg style={{ width: 14, height: 14 }}><use href="#i-card" /></svg>Plan
            </button>
          </>}
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/perfil')}>
            <svg style={{ width: 14, height: 14 }}><use href="#i-settings" /></svg>Configuración
          </button>
          <div style={{ width: 1, height: 20, background: 'var(--rule)', margin: '0 4px' }} />
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
      </div>

      {/* Content */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px' }}>

        {/* Page title + new bot */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              Tus <em style={{ fontStyle: 'italic' }}>chatbots</em>
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 14, opacity: 0.5, marginTop: 6 }}>
              Abre un bot para ver su operación o usa ⚙️ para configurarlo.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/chatbots/nuevo')} style={{ gap: 8 }}>
            <svg style={{ width: 15, height: 15 }}><use href="#i-plus" /></svg>
            Nuevo chatbot
          </button>
        </div>

        {/* Bots grid */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 60, opacity: 0.4, fontFamily: 'var(--font-mono)', fontSize: 12 }}>Cargando chatbots...</div>
        ) : bots.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80 }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🤖</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, marginBottom: 8 }}>Aún no tienes chatbots</div>
            <p style={{ fontFamily: 'var(--font-body)', opacity: 0.55, marginBottom: 24 }}>Crea tu primer chatbot y empieza a automatizar.</p>
            <button className="btn btn-primary" onClick={() => navigate('/chatbots/nuevo')}>Crear mi primer chatbot</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
            {bots.map(bot => (
              <BotCard key={bot._id} bot={bot} onOpen={handleOpen} onConfig={handleConfig} />
            ))}
            {/* New bot card */}
            <div onClick={() => navigate('/chatbots/nuevo')} style={{
              border: '2px dashed var(--rule)', borderRadius: 16, padding: 24,
              cursor: 'pointer', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 10, minHeight: 200,
              transition: 'border-color .2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--carbon)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--rule)'}
            >
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--bone-2)', display: 'grid', placeItems: 'center' }}>
                <svg style={{ width: 22, height: 22, opacity: 0.5 }}><use href="#i-plus" /></svg>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14 }}>Nuevo chatbot</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, opacity: 0.4, textAlign: 'center' }}>Restaurante, tienda, clínica y más</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BotSelector;
