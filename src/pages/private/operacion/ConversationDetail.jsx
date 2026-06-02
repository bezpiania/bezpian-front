import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppLayout from '../../../components/AppLayout.jsx';
import Conversations from '../../../services/Conversations.js';

/* Burbujas de chat */
const BotBubble = ({ children, label = '🤖 Zapi · Bot' }) => (
  <div style={{ alignSelf: 'flex-start', maxWidth: '75%', background: 'var(--bone)', border: '1px solid var(--rule)', borderRadius: '14px 14px 14px 4px', padding: '12px 16px' }}>
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.55, marginBottom: 4 }}>{label}</div>
    <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.5 }}>{children}</div>
  </div>
);
const ClientBubble = ({ children, label = 'Cliente' }) => (
  <div style={{ alignSelf: 'flex-end', maxWidth: '75%', background: 'var(--carbon)', color: 'var(--bone)', borderRadius: '14px 14px 4px 14px', padding: '12px 16px' }}>
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.55, marginBottom: 4 }}>{label}</div>
    <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.5 }}>{children}</div>
  </div>
);
const VoltageBubble = ({ children, label }) => (
  <div style={{ alignSelf: 'flex-start', maxWidth: '75%', background: 'var(--voltage)', borderRadius: '14px 14px 14px 4px', padding: '12px 16px' }}>
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 4, color: 'var(--carbon)' }}>{label}</div>
    <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.5, color: 'var(--carbon)' }}>{children}</div>
  </div>
);
const TimeDivider = ({ children }) => (
  <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.4 }}>{children}</div>
);

const ConversationDetail = () => {
  const { id } = useParams();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadConversation();
  }, [id]);

  const loadConversation = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Loading conversation:', id);

      const convResponse = await Conversations.get(id);
      console.log('Conversation response:', convResponse);

      if (convResponse?.success) {
        setConversation(convResponse.data);
      } else {
        throw new Error(convResponse?.message || 'Error al obtener conversación');
      }

      const messagesResponse = await Conversations.getMessages(id);
      console.log('Messages response:', messagesResponse);

      if (messagesResponse?.success) {
        setMessages(messagesResponse.data || []);
      } else {
        throw new Error(messagesResponse?.message || 'Error al obtener mensajes');
      }
    } catch (err) {
      console.error('Error loading conversation:', err);
      setError(err?.response?.data?.message || err.message || 'Error al cargar conversación');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div style={{ padding: 32, textAlign: 'center' }}>
          <p>Cargando conversación...</p>
        </div>
      </AppLayout>
    );
  }

  if (error || !conversation) {
    return (
      <AppLayout>
        <div style={{ padding: 32, textAlign: 'center' }}>
          <p>Error al cargar conversación</p>
        </div>
      </AppLayout>
    );
  }

  const visitor = conversation.visitorMetadata || {};
  const clientName = visitor.name || conversation.visitorId || 'Cliente';
  const clientInitials = clientName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'CL';
  const firstMessage = messages[0];
  const lastMessage = messages[messages.length - 1];

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusPill = (status) => {
    const statusMap = {
      open: { label: 'Abierta', className: 'amber' },
      closed: { label: 'Cerrada', className: 'bone' },
      archived: { label: 'Archivada', className: 'bone' }
    };
    const pill = statusMap[status] || statusMap.open;
    return <span className={`pill ${pill.className}`}>{pill.label}</span>;
  };

  const getOutcomePill = (outcome) => {
    if (!outcome) return null;
    const outcomeMap = {
      quote: { label: 'Cotización generada', className: 'voltage' },
      lead: { label: 'Lead capturado', className: 'voltage' },
      appointment: { label: 'Cita agendada', className: 'voltage' }
    };
    const pill = outcomeMap[outcome];
    if (!pill) return null;
    return <span className={`pill ${pill.className}`}>{pill.label}</span>;
  };

  const lastNamePart = clientName.split(' ').slice(1).join(' ') || '';

  return (
  <AppLayout>
    <div className="page-head" style={{ paddingBottom: 16 }}>
      <div>
        <div className="page-eyebrow">
          <Link to="/conversaciones" style={{ cursor: 'pointer', borderBottom: '1px solid var(--rule-strong)' }}>Conversaciones</Link>
          <span className="dot"></span>
          <span>#{conversation._id?.slice(-4) || id?.slice(-4)} · {clientName}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
          <h1 className="page-title" style={{ fontSize: 28 }}>
            {clientName.split(' ')[0]} {lastNamePart && <em>{lastNamePart}</em>}
          </h1>
          {getStatusPill(conversation.status)}
          {getOutcomePill(conversation.outcome)}
        </div>
      </div>
      <div className="page-actions">
        <button className="btn btn-ghost btn-sm"><svg><use href="#i-mail" /></svg>Email cliente</button>
        <button className="btn btn-ghost btn-sm">Marcar spam</button>
        <button className="btn btn-primary btn-sm">Cerrar chat</button>
      </div>
    </div>

    <div className="page-body" style={{ paddingTop: 8 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, minHeight: 600 }}>
        {/* Chat thread */}
        <div style={{ background: 'var(--bone-2)', border: '1px solid var(--rule)', borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--rule)', display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.6 }}>
            <svg style={{ width: 14, height: 14 }}><use href="#i-clock" /></svg>
            {formatDate(firstMessage?.createdAt)} · {formatTime(firstMessage?.createdAt)} — {formatTime(lastMessage?.createdAt)} · {messages.length} mensajes
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <TimeDivider>— Inicio · {formatTime(firstMessage?.createdAt)} —</TimeDivider>

            {messages.map((msg, idx) => {
              const isBot = msg.role === 'assistant';
              const label = isBot ? '🤖 Zapi · Bot' : `${clientName} · Cliente`;

              if (msg.messageType === 'quote_generated') {
                return (
                  <VoltageBubble key={idx} label="🤖 Zapi · Cotización generada">
                    {msg.content}
                  </VoltageBubble>
                );
              }

              if (isBot) {
                return (
                  <BotBubble key={idx} label={label}>
                    {msg.content}
                  </BotBubble>
                );
              } else {
                return (
                  <ClientBubble key={idx} label={label}>
                    {msg.content}
                  </ClientBubble>
                );
              }
            })}

            <TimeDivider>— {formatTime(lastMessage?.createdAt)} · Última actividad —</TimeDivider>
          </div>

          <div style={{ padding: '14px 18px', background: 'var(--bone)', borderTop: '1px solid var(--rule)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <input className="input" style={{ flex: 1, background: 'var(--bone-2)', padding: '11px 14px', fontSize: 14 }} placeholder="Escribe como humano (toma el control del chat)…" />
            <button className="btn btn-primary btn-sm">
              <svg><use href="#i-send" /></svg>
            </button>
          </div>
        </div>

        {/* Side panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>
          <div className="card" style={{ padding: 18 }}>
            <div className="section-num" style={{ marginBottom: 8 }}>Cliente</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 44, height: 44, background: 'var(--voltage)', color: 'var(--carbon)', borderRadius: '50%', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>{clientInitials}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14.5 }}>{clientName}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.6, letterSpacing: '0.04em' }}>{visitor.email || visitor.phone || 'Sin contacto'}</div>
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, opacity: 0.7, lineHeight: 1.5 }}>
              {visitor.phone && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--rule)' }}>
                  <span>Teléfono</span><span style={{ fontFamily: 'var(--font-mono)' }}>{visitor.phone}</span>
                </div>
              )}
              {visitor.ipCountry && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--rule)' }}>
                  <span>País</span><span>{visitor.ipCountry}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                <span>Estado</span><span style={{ fontStyle: 'italic' }}>{conversation.status === 'active' ? 'Activa' : conversation.status}</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 18 }}>
            <div className="section-num" style={{ marginBottom: 10 }}>Acciones del bot</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.45 }}>
              {conversation.quotes && conversation.quotes.length > 0 && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 14 }}>📋</span>
                  <span>
                    <strong style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>Cotización #{conversation.quotes[0].quoteNumber}</strong>
                    <em style={{ opacity: 0.7, marginLeft: 4 }}>por ${(conversation.quotes[0].totalAmount || 0).toLocaleString('es-CL')}</em>
                  </span>
                </div>
              )}
              {conversation.emailsSent && conversation.emailsSent > 0 && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 14 }}>📧</span>
                  <span><strong style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>Email enviado</strong> <em style={{ opacity: 0.7 }}>con PDF adjunto</em></span>
                </div>
              )}
              {conversation.leads && conversation.leads.length > 0 && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 14 }}>👤</span>
                  <span><strong style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>Lead capturado</strong> <em style={{ opacity: 0.7 }}>marcado como "qualified"</em></span>
                </div>
              )}
              {!conversation.quotes?.length && !conversation.emailsSent && !conversation.leads?.length && (
                <div style={{ opacity: 0.5, fontStyle: 'italic' }}>Sin acciones registradas</div>
              )}
            </div>
          </div>

          <div className="card" style={{ padding: 18 }}>
            <div className="section-num" style={{ marginBottom: 10 }}>Notas internas</div>
            <textarea className="textarea" placeholder="Apuntes para el equipo (no los ve el cliente)…" style={{ minHeight: 80, fontSize: 13 }} defaultValue={conversation.internalNotes || ''} />
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
  );
};

export default ConversationDetail;
