import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Chatbot from '../../services/Chatbot.js';
import { generateBubbleWidgetHtml } from '../../utils/generateBubbleWidgetHtml.js';

/**
 * DemoSite — muestra el widget de burbuja real sobre un "sitio web" de ejemplo,
 * dentro de un iframe. Lee la info del bot (color, avatar, nombre) para que la
 * burbuja se vea con la marca real, igual que el código del embed.
 */
const apiUrl = import.meta.env.VITE_API_APP || 'http://localhost:5001';

const DemoSite = () => {
  const { embedKey } = useParams();
  const navigate = useNavigate();
  const [html, setHtml] = useState('');
  const appUrl = typeof window !== 'undefined' ? window.location.origin : '';

  useEffect(() => {
    if (!embedKey) return;
    Chatbot.get(`/api/embed/bot-info?embedKey=${embedKey}`)
      .then((res) => {
        const b = res?.data || {};
        setHtml(generateBubbleWidgetHtml({
          botId: '',
          embedKey,
          apiUrl,
          appUrl,
          color: b.widget?.color || '#667eea',
          avatar: b.widget?.avatar || '🤖',
          name: b.name || 'Asistente',
        }));
      })
      .catch(() => {
        setHtml(generateBubbleWidgetHtml({ botId: '', embedKey, apiUrl, appUrl, name: 'Asistente' }));
      });
  }, [embedKey]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <div style={{ padding: '10px 16px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'sans-serif' }}>
        <button onClick={() => navigate(`/demo/${embedKey}`)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 22 }}>‹</button>
        <span style={{ fontSize: 13, color: '#666' }}>Vista de ejemplo · toca la burbuja abajo a la derecha</span>
      </div>
      {html ? (
        <iframe title="Demo sitio web" srcDoc={html} style={{ flex: 1, border: 'none', width: '100%' }} allow="microphone" />
      ) : null}
    </div>
  );
};

export default DemoSite;
