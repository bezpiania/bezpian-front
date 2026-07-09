import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Chatbot from '../../services/Chatbot.js';
import { generateVoiceWidgetHtml } from '../../utils/generateVoiceWidgetHtml.js';

/**
 * DemoVoice — widget de voz real (generateVoiceWidgetHtml) sobre una página
 * de ejemplo. El micrófono queda flotando con su margen, igual que el embed.
 */
const apiUrl = import.meta.env.VITE_API_APP || 'http://localhost:5001';

const DemoVoice = () => {
  const { embedKey } = useParams();
  const navigate = useNavigate();
  const [html, setHtml] = useState('');
  const [bot, setBot] = useState(null);
  const appUrl = typeof window !== 'undefined' ? window.location.origin : '';

  useEffect(() => {
    if (!embedKey) return;
    Chatbot.get(`/api/embed/bot-info?embedKey=${embedKey}`)
      .then((res) => {
        const b = res?.data || {};
        if (b.name) document.title = b.name;
        setBot(b);
        setHtml(generateVoiceWidgetHtml({
          botId: '', embedKey, apiUrl, appUrl,
          color: b.widget?.color || '#534AB7',
          avatar: b.widget?.avatar || '🎙️',
          name: b.name || 'Asistente',
        }));
      })
      .catch(() => setHtml(generateVoiceWidgetHtml({ botId: '', embedKey, apiUrl, appUrl, name: 'Asistente' })));
  }, [embedKey]);

  const name = bot?.name || 'Asistente';
  const color = bot?.widget?.color || '#534AB7';

  return (
    <div style={{ height: '100dvh', position: 'relative', background: 'var(--bone, #F4F0E8)', overflow: 'hidden' }}>
      {/* Fondo con instrucción (no captura toques) */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 14, padding: 24, pointerEvents: 'none' }}>
        <div style={{ width: 84, height: 84, borderRadius: 24, background: color, display: 'grid', placeItems: 'center', fontSize: 40 }}>🎙️</div>
        <div style={{ fontFamily: 'sans-serif', fontSize: 22, fontWeight: 700, color: '#1a1a1a' }}>{name}</div>
        <div style={{ fontFamily: 'sans-serif', fontSize: 16, color: '#555', maxWidth: 300, lineHeight: 1.5 }}>
          Toca el micrófono de abajo a la derecha y háblale. Te responde con voz, al instante.
        </div>
      </div>

      {/* Widget de voz real, transparente, encima */}
      {html ? (
        <iframe
          title="Voz"
          srcDoc={html}
          allow="microphone; autoplay"
          style={{ position: 'absolute', inset: 0, border: 'none', width: '100%', height: '100%', background: 'transparent' }}
        />
      ) : null}

      {/* Botón volver SIEMPRE encima del iframe */}
      <button
        onClick={() => navigate(`/demo/${embedKey}`)}
        style={{ position: 'absolute', top: 12, left: 16, zIndex: 20, border: 'none', background: 'rgba(255,255,255,0.85)', borderRadius: 20, width: 40, height: 40, cursor: 'pointer', fontSize: 22, boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
      >‹</button>
    </div>
  );
};

export default DemoVoice;
