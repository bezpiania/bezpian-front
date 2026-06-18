import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Chatbot from '../../services/Chatbot.js';
import { generateFullChatHtml } from '../../utils/generateFullChatHtml.js';

/**
 * DemoChat — chat de pantalla completa usando EXACTAMENTE la plantilla del embed
 * (generateFullChatHtml), renderizada en un iframe. Misma apariencia que el código
 * que se copia desde la pestaña Código embed.
 */
const apiUrl = import.meta.env.VITE_API_APP || 'http://localhost:5001';

const DemoChat = () => {
  const { embedKey } = useParams();
  const navigate = useNavigate();
  const [html, setHtml] = useState('');

  useEffect(() => {
    if (!embedKey) return;
    Chatbot.get(`/api/embed/bot-info?embedKey=${embedKey}`)
      .then((res) => {
        const b = res?.data || {};
        setHtml(generateFullChatHtml({
          embedKey,
          apiUrl,
          color: b.widget?.color || '#0d0d0d',
          avatar: b.widget?.avatar || '🤖',
          name: b.name || 'Asistente',
          pattern: b.widget?.pattern || 'dots',
          patternOpacity: b.widget?.patternOpacity ?? 0.45,
        }));
      })
      .catch(() => {
        setHtml(generateFullChatHtml({ embedKey, apiUrl, name: 'Asistente' }));
      });
  }, [embedKey]);

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <div style={{ padding: '8px 14px', borderBottom: '1px solid #eee', fontFamily: 'sans-serif' }}>
        <button onClick={() => navigate(`/demo/${embedKey}`)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 22 }}>‹</button>
      </div>
      {html ? (
        <iframe title="Chat" srcDoc={html} style={{ flex: 1, border: 'none', width: '100%' }} allow="microphone" />
      ) : null}
    </div>
  );
};

export default DemoChat;
