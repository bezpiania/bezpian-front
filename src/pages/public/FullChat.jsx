import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Chatbot from '../../services/Chatbot.js';

// ── Helpers ──────────────────────────────────────────────────────────────────
const visitorId = Math.random().toString(36).substring(2, 10);

const BIZ_ICONS = {
  restaurant: '🍽️',
  store:      '🛍️',
  clinic:     '🏥',
  generic:    '🤖',
};

// ── Message bubble ────────────────────────────────────────────────────────────
const Bubble = ({ msg, accentColor }) => {
  const isUser   = msg.role === 'user';
  const isSystem = msg.role === 'system';

  if (isSystem) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
      <span style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A', borderRadius: 20, padding: '4px 14px', fontSize: 12, fontFamily: 'sans-serif' }}>
        {msg.content}
      </span>
    </div>
  );

  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 4 }}>
      {!isUser && (
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: accentColor, display: 'grid', placeItems: 'center', fontSize: 15, marginRight: 10, flexShrink: 0, alignSelf: 'flex-end' }}>
          🤖
        </div>
      )}
      <div style={{
        maxWidth: '72%',
        padding: '12px 16px',
        borderRadius: isUser ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
        background: isUser ? accentColor : '#fff',
        color: isUser ? '#fff' : '#1a1a1a',
        fontSize: 14,
        lineHeight: 1.55,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        boxShadow: isUser ? 'none' : '0 1px 4px rgba(0,0,0,0.08)',
        border: isUser ? 'none' : '1px solid #f0f0f0',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
        {msg.content}
      </div>
    </div>
  );
};

// ── Typing indicator ──────────────────────────────────────────────────────────
const Typing = ({ accentColor }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginBottom: 4 }}>
    <div style={{ width: 32, height: 32, borderRadius: '50%', background: accentColor, display: 'grid', placeItems: 'center', fontSize: 15, flexShrink: 0 }}>🤖</div>
    <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '4px 18px 18px 18px', padding: '14px 18px', display: 'flex', gap: 5, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
      {[0,1,2].map(i => (
        <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#ccc', display: 'inline-block', animation: 'bounce 1.4s infinite', animationDelay: `${i*0.2}s` }} />
      ))}
    </div>
    <style>{`@keyframes bounce{0%,60%,100%{transform:translateY(0);opacity:.5}30%{transform:translateY(-8px);opacity:1}}`}</style>
  </div>
);

// ── Quick action button ───────────────────────────────────────────────────────
const QuickBtn = ({ icon, label, onClick, color }) => (
  <button onClick={onClick} style={{
    display: 'flex', alignItems: 'center', gap: 8,
    background: '#fff', border: '1px solid #e8e8e8',
    borderRadius: 10, padding: '10px 14px', cursor: 'pointer',
    fontSize: 13, fontFamily: 'sans-serif', fontWeight: 500,
    transition: 'all 0.15s', width: '100%', textAlign: 'left',
    color: '#1a1a1a',
  }}
  onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = color + '10'; }}
  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8e8e8'; e.currentTarget.style.background = '#fff'; }}
  >
    <span style={{ fontSize: 16 }}>{icon}</span>
    {label}
  </button>
);

// ── Main ──────────────────────────────────────────────────────────────────────
const FullChat = () => {
  const { embedKey } = useParams();
  const [botInfo, setBotInfo]       = useState(null);
  const [messages, setMessages]     = useState([]);
  const [input, setInput]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [convId, setConvId]         = useState(null);
  const [botId, setBotId]           = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef              = useRef(null);
  const inputRef                    = useRef(null);

  const accentColor = botInfo?.widget?.color || '#6366f1';
  const botAvatar   = botInfo?.widget?.avatar || '🤖';
  const botName     = botInfo?.name || 'Asistente';

  // Auto-scroll
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  // Start conversation
  useEffect(() => {
    if (!embedKey) return;
    // Get bot info first (name, color, avatar)
    Chatbot.get(`/api/embed/bot-info?embedKey=${embedKey}`)
      .then(res => { if (res?.success) setBotInfo(res.data); })
      .catch(() => {});

    // Start conversation
    Chatbot.post('/api/embed/conversations', { embedKey, visitorId })
      .then(res => {
        if (res?.success) {
          const d = res.data;
          setConvId(d.conversationId);
          setBotId(d.botId);
          setMessages([{ role: 'assistant', content: d.welcomeMessage, id: '0' }]);
        }
      })
      .catch(() => setMessages([{ role: 'assistant', content: 'Hubo un error al conectar. Intenta recargar la página.', id: 'err' }]));
  }, [embedKey]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || !convId || !botId) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg, id: Date.now() }]);
    setLoading(true);
    try {
      const res = await Chatbot.post('/api/embed/messages', { conversationId: convId, content: msg, botId });
      if (res?.success) {
        const botMsg = res.data?.botMessage;
        setMessages(prev => [...prev, { role: 'assistant', content: botMsg.content, id: botMsg._id }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error al procesar tu mensaje. Intenta de nuevo.', id: 'err-' + Date.now() }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const quickActions = [
    { icon: '📅', label: 'Hacer una reserva',    msg: 'Quiero reservar una mesa' },
    { icon: '🛵', label: 'Pedir delivery',        msg: 'Quiero hacer un pedido de delivery' },
    { icon: '🍽️', label: 'Ver el menú',           msg: '¿Qué tienen en el menú?' },
    { icon: '📍', label: 'Ubicación y horarios',  msg: '¿Dónde están y a qué hora abren?' },
  ];

  // ── Sidebar content ─────────────────────────────────────────────────────────
  const Sidebar = () => (
    <div style={{
      width: 280, flexShrink: 0,
      background: '#fff',
      borderRight: '1px solid #f0f0f0',
      display: 'flex', flexDirection: 'column',
      padding: '28px 20px',
      gap: 24,
      overflowY: 'auto',
    }}>
      {/* Bot identity */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingBottom: 20, borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: accentColor, display: 'grid', placeItems: 'center', fontSize: 30, boxShadow: `0 6px 20px ${accentColor}44` }}>
          {botAvatar}
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 17, color: '#1a1a1a' }}>{botName}</div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 3, display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            En línea ahora
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#999', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Acciones rápidas</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {quickActions.map(a => (
            <QuickBtn key={a.label} icon={a.icon} label={a.label} color={accentColor} onClick={() => sendMessage(a.msg)} />
          ))}
        </div>
      </div>

      {/* Powered by */}
      <div style={{ marginTop: 'auto', textAlign: 'center', paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
        <span style={{ fontSize: 11, color: '#ccc', fontFamily: 'sans-serif' }}>Powered by Zapien AI</span>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8f8f8', fontFamily: 'sans-serif' }}>

      {/* Sidebar — desktop */}
      <div style={{ display: 'none' }} className="fc-sidebar-desktop">
        <Sidebar />
      </div>

      {/* Sidebar — desktop visible via CSS */}
      <style>{`
        @media (min-width: 768px) {
          .fc-sidebar-desktop { display: flex !important; }
          .fc-mobile-header { display: none !important; }
        }
        @media (max-width: 767px) {
          .fc-sidebar-overlay { display: ${sidebarOpen ? 'flex' : 'none'} !important; }
        }
      `}</style>

      {/* Mobile sidebar overlay */}
      <div className="fc-sidebar-overlay" onClick={() => setSidebarOpen(false)} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50,
        display: 'none', alignItems: 'flex-start',
      }}>
        <div onClick={e => e.stopPropagation()} style={{ width: 280, height: '100%', background: '#fff', overflowY: 'auto' }}>
          <div style={{ padding: '16px 20px 0', display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>×</button>
          </div>
          <Sidebar />
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Mobile header */}
        <div className="fc-mobile-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', gap: 8, color: '#1a1a1a', fontWeight: 600 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: accentColor, display: 'grid', placeItems: 'center', fontSize: 18 }}>{botAvatar}</div>
            {botName}
          </button>
          <div style={{ fontSize: 11, color: '#888', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            En línea
          </div>
        </div>

        {/* Desktop header */}
        <div className="fc-sidebar-desktop" style={{ display: 'none', padding: '18px 28px', background: '#fff', borderBottom: '1px solid #f0f0f0', alignItems: 'center', gap: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#1a1a1a' }}>Conversación</div>
          <div style={{ marginLeft: 'auto', fontSize: 12, color: '#888', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
            {botName} está en línea
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#ccc' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{botAvatar}</div>
              <div style={{ fontSize: 15 }}>Iniciando conversación...</div>
            </div>
          )}
          {messages.map(msg => <Bubble key={msg.id} msg={msg} accentColor={accentColor} />)}
          {loading && <Typing accentColor={accentColor} />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '16px 20px', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', background: '#f8f8f8', borderRadius: 14, padding: '10px 14px', border: '1.5px solid #e8e8e8', transition: 'border-color 0.2s' }}
            onFocusCapture={e => e.currentTarget.style.borderColor = accentColor}
            onBlurCapture={e => e.currentTarget.style.borderColor = '#e8e8e8'}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Escribe tu mensaje..."
              disabled={loading || !convId}
              rows={1}
              style={{
                flex: 1, border: 'none', background: 'transparent', resize: 'none',
                fontSize: 14, fontFamily: 'sans-serif', lineHeight: 1.5,
                outline: 'none', maxHeight: 120, overflowY: 'auto', color: '#1a1a1a',
              }}
              onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim() || !convId}
              style={{
                width: 36, height: 36, borderRadius: 10, border: 'none', flexShrink: 0,
                background: input.trim() ? accentColor : '#e0e0e0',
                color: '#fff', cursor: input.trim() ? 'pointer' : 'not-allowed',
                display: 'grid', placeItems: 'center', transition: 'background 0.15s',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
          <div style={{ textAlign: 'center', marginTop: 8, fontSize: 11, color: '#ccc' }}>
            Powered by <strong style={{ color: '#bbb' }}>Zapien AI</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullChat;
