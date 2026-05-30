import React from 'react';
import { Link } from 'react-router-dom';
import { Spin, Empty } from 'antd';
import AppLayout from '../../../components/AppLayout.jsx';
import { useGetChatbots } from '../../../hooks/useChatbot.js';

const BotsList = () => {
  const workspaceId = localStorage.getItem('workspaceId');
  const { data: response, isLoading, error } = useGetChatbots(workspaceId);
  const BOTS = response?.data || [];

  if (isLoading) {
    return (
      <AppLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Spin size="large" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <h3>Error al cargar chatbots</h3>
          <p>{error?.response?.data?.message || error?.message}</p>
        </div>
      </AppLayout>
    );
  }

const DEMO_BOTS = [
  {
    id: 'zapi',
    name: 'Zapi',
    org: 'Tienda Acme',
    desc: 'Ropa urbana hecha en Chile. Conoce el catálogo, cotiza y agenda.',
    emoji: '🛍️',
    avatarBg: 'var(--voltage)',
    avatarColor: 'var(--carbon)',
    status: 'green',
    statusLabel: 'Activo',
    stats: { chats: 847, quotes: 23, conv: '14%' },
    tags: [
      { label: 'Cotizaciones', tone: 'voltage' },
      { label: 'Agenda', tone: 'muted' },
      { label: 'Leads', tone: 'muted' },
    ],
  },
  {
    id: 'pikante',
    name: 'Pikante',
    org: 'Salsas Acme',
    desc: 'Salsas artesanales y mariposas. Recetas, pedidos y delivery.',
    emoji: '🌶️',
    avatarBg: '#FF4D1F',
    avatarColor: 'var(--bone)',
    status: 'green',
    statusLabel: 'Activo',
    stats: { chats: 312, quotes: 9, conv: '22%' },
    tags: [
      { label: 'Cotizaciones', tone: 'voltage' },
      { label: 'Leads', tone: 'voltage' },
    ],
  },
  {
    id: 'edu',
    name: 'Edu',
    org: 'Cursos Acme',
    desc: 'Cursos online de marketing. Captura leads y agenda demos.',
    emoji: '📚',
    avatarBg: 'var(--mist)',
    avatarColor: 'var(--carbon)',
    status: 'amber',
    statusLabel: 'Pausado',
    paused: true,
    stats: { chats: 128, quotes: '—', conv: '8%' },
    tags: [
      { label: 'Leads', tone: 'voltage' },
      { label: 'Agenda', tone: 'voltage' },
    ],
  },
];

  return (
    <AppLayout>
    <div className="page-head with-halo">
      <div>
        <div className="page-eyebrow">
          <span>Chatbots</span>
          <span className="dot"></span>
          <span>3 activos · 2/3 plan Pro</span>
        </div>
        <h1 className="page-title">
          Tus <em>Zapiens.</em>
        </h1>
        <p className="page-sub">
          Crea, pausa o configura tus chatbots. Cada uno vive en un sitio distinto y aprende de su propio catálogo.
        </p>
      </div>
      <div className="page-actions">
        <Link to="/chatbots/nuevo" className="btn btn-voltage">
          <svg><use href="#i-plus" /></svg>
          Crear chatbot
        </Link>
      </div>
    </div>

    <div className="page-body">
      {BOTS.length === 0 ? (
        <div className="grid-3">
          <Link to="/chatbots/nuevo" className="bot-card empty" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
            <div style={{ width: 56, height: 56, background: 'var(--voltage)', borderRadius: '50%', display: 'grid', placeItems: 'center', color: 'var(--carbon)' }}>
              <svg style={{ width: 24, height: 24 }}><use href="#i-plus" /></svg>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em', marginBottom: 4 }}>
                Crear tu primer Zapien
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 13, opacity: 0.7, lineHeight: 1.4, maxWidth: '24ch' }}>
                Tu primer chatbot que vende. <em>Sin developers necesarios.</em>
              </div>
            </div>
          </Link>
        </div>
      ) : (
      <div className="grid-3">
        {BOTS.map((b) => (
          <div key={b._id} className={'bot-card' + (b.status === 'paused' ? ' paused' : '')}>
            <div className="bot-card-head">
              <div className="bot-card-avatar" style={{ background: b.widget?.color || '#DCFF1E', color: '#15140F' }}>
                {b.widget?.avatar || '🤖'}
              </div>
              <span className={'pill ' + (b.status === 'active' ? 'green' : b.status === 'paused' ? 'amber' : 'muted')}>
                {b.status === 'active' ? 'Activo' : b.status === 'paused' ? 'Pausado' : 'Borrador'}
              </span>
            </div>
            <div>
              <div className="bot-card-name">
                {b.name}
              </div>
              <div className="bot-card-desc">{b.personality?.customPrompt || 'Sin descripción'}</div>
            </div>
            <div className="bot-card-stats">
              <div className="bot-card-stat">
                <div className="bot-card-stat-val">{b.stats?.totalConversations || 0}</div>
                <div className="bot-card-stat-label">Chats</div>
              </div>
              <div className="bot-card-stat">
                <div className="bot-card-stat-val">{b.stats?.totalQuotes || 0}</div>
                <div className="bot-card-stat-label">Cotiz.</div>
              </div>
              <div className="bot-card-stat">
                <div className="bot-card-stat-val">0<span>%</span></div>
                <div className="bot-card-stat-label">Conv.</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {b.features?.chat && <span className="pill voltage">Chat</span>}
              {b.features?.quotes && <span className="pill voltage">Cotizaciones</span>}
              {b.features?.appointments && <span className="pill voltage">Agenda</span>}
              {b.features?.leadCapture && <span className="pill voltage">Leads</span>}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              {b.status === 'paused' ? (
                <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                  <svg><use href="#i-play" /></svg>Reactivar
                </button>
              ) : (
                <Link to={`/chatbots/${b._id}`} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                  Abrir
                </Link>
              )}
              <button className="btn btn-ghost btn-sm">
                <svg><use href="#i-dots" /></svg>
              </button>
            </div>
          </div>
        ))}
        <Link to="/chatbots/nuevo" className="bot-card empty" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
          <div style={{ width: 56, height: 56, background: 'var(--voltage)', borderRadius: '50%', display: 'grid', placeItems: 'center', color: 'var(--carbon)' }}>
            <svg style={{ width: 24, height: 24 }}><use href="#i-plus" /></svg>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em', marginBottom: 4 }}>
              Crear otro Zapien
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 13, opacity: 0.7, lineHeight: 1.4, maxWidth: '24ch' }}>
              Cada bot para un negocio distinto.
            </div>
          </div>
        </Link>
      </div>
      )}
    </div>
  </AppLayout>
  );
};

export default BotsList;
