import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetChatbots } from '../../../hooks/useChatbot.js';
import { setActiveBot } from '../../../hooks/useActiveBot.js';

const workspaceId = localStorage.getItem('workspaceId');

const BIZ_LABELS = {
  restaurant: '🍽️ Restaurante',
  store:      '🛍️ Tienda',
  clinic:     '🏥 Clínica',
  generic:    '🤖 General',
};

const STATUS_DOT = {
  active:  { color: 'var(--green)',  label: 'Activo'  },
  paused:  { color: '#F59E0B',       label: 'Pausado' },
  draft:   { color: 'var(--mist)',   label: 'Borrador'},
};

const BotCard = ({ bot, onSelect }) => {
  const status = STATUS_DOT[bot.status] || STATUS_DOT.draft;
  const color  = bot.widget?.color  || '#667eea';
  const avatar = bot.widget?.avatar || '🤖';

  return (
    <div
      onClick={() => onSelect(bot)}
      style={{
        background: 'var(--bone)',
        border: '1px solid var(--rule)',
        borderRadius: 16,
        padding: 28,
        cursor: 'pointer',
        transition: 'box-shadow 0.2s, transform 0.15s',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: color, display: 'grid', placeItems: 'center',
            fontSize: 26, flexShrink: 0,
            boxShadow: `0 4px 12px ${color}44`,
          }}>
            {avatar}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, lineHeight: 1.2 }}>
              {bot.name}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.5, marginTop: 3, letterSpacing: '0.08em' }}>
              {BIZ_LABELS[bot.businessType] || BIZ_LABELS.generic}
            </div>
          </div>
        </div>
        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: status.color }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.6, letterSpacing: '0.08em' }}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Description */}
      {bot.personality?.customPrompt && (
        <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 13, opacity: 0.6, lineHeight: 1.45, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {bot.personality.customPrompt.split('\n')[0].replace(/[*#━]/g, '').trim()}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 4 }}>
        {[
          { val: bot.stats?.totalConversations || 0, label: 'Chats' },
          { val: bot.stats?.totalLeads         || 0, label: 'Leads' },
          { val: bot.stats?.totalAppointments  || 0, label: 'Citas' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--bone-2)', borderRadius: 8, padding: '10px 8px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20 }}>{s.val}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, opacity: 0.5, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ marginTop: 4, padding: '10px 16px', background: 'var(--carbon)', color: 'var(--bone)', borderRadius: 8, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, textAlign: 'center' }}>
        Abrir dashboard →
      </div>
    </div>
  );
};

const BotSelector = () => {
  const navigate  = useNavigate();
  const { data, isLoading } = useGetChatbots(workspaceId);
  const bots = data?.data || [];

  const handleSelect = (bot) => {
    setActiveBot(bot);
    navigate('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bone)', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ maxWidth: 900, margin: '0 auto', marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              Tus <em style={{ fontStyle: 'italic' }}>chatbots.</em>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 15, opacity: 0.55, marginTop: 8 }}>
              Elige el chatbot que quieres gestionar.
            </p>
          </div>
          <button
            onClick={() => navigate('/chatbots/nuevo')}
            className="btn btn-primary"
            style={{ gap: 8 }}
          >
            <svg style={{ width: 16, height: 16 }}><use href="#i-plus" /></svg>
            Nuevo chatbot
          </button>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 60, opacity: 0.4, fontFamily: 'var(--font-mono)', fontSize: 13 }}>
            Cargando chatbots...
          </div>
        ) : bots.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80 }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🤖</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, marginBottom: 8 }}>
              Aún no tienes chatbots
            </div>
            <p style={{ fontFamily: 'var(--font-body)', opacity: 0.55, marginBottom: 24 }}>
              Crea tu primer chatbot y empieza a automatizar.
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/chatbots/nuevo')}>
              Crear mi primer chatbot
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 20 }}>
            {bots.map(bot => (
              <BotCard key={bot._id} bot={bot} onSelect={handleSelect} />
            ))}
            {/* Create new card */}
            <div
              onClick={() => navigate('/chatbots/nuevo')}
              style={{
                border: '2px dashed var(--rule)',
                borderRadius: 16,
                padding: 28,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                minHeight: 220,
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--carbon)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--rule)'}
            >
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--bone-2)', display: 'grid', placeItems: 'center' }}>
                <svg style={{ width: 24, height: 24 }}><use href="#i-plus" /></svg>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15 }}>Nuevo chatbot</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.4, textAlign: 'center' }}>
                Restaurante, tienda, clínica y más
              </div>
            </div>
          </div>
        )}
      </div>

      {/* IconSprite needed for icons */}
      <div style={{ position: 'fixed', width: 0, height: 0, overflow: 'hidden' }}>
        <svg><use href="#i-plus" /></svg>
      </div>
    </div>
  );
};

export default BotSelector;
