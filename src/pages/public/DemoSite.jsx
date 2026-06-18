import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateBubbleWidgetHtml } from '../../utils/generateBubbleWidgetHtml.js';

/**
 * DemoSite — muestra el widget de burbuja real sobre un "sitio web" de ejemplo,
 * dentro de un iframe (reutiliza generateBubbleWidgetHtml sin tocarlo).
 */
const apiUrl = import.meta.env.VITE_API_APP || 'http://localhost:5001';

const DemoSite = () => {
  const { embedKey } = useParams();
  const navigate = useNavigate();
  const appUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const html = generateBubbleWidgetHtml({
    botId: '', // bot-info resuelve por embedKey; el widget usa embedKey
    embedKey,
    apiUrl,
    appUrl,
    name: 'Asistente',
  });

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <div style={{ padding: '10px 16px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'sans-serif' }}>
        <button onClick={() => navigate(`/demo/${embedKey}`)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 22 }}>‹</button>
        <span style={{ fontSize: 13, color: '#666' }}>Vista de ejemplo · toca la burbuja abajo a la derecha</span>
      </div>
      <iframe
        title="Demo sitio web"
        srcDoc={html}
        style={{ flex: 1, border: 'none', width: '100%' }}
        allow="microphone"
      />
    </div>
  );
};

export default DemoSite;
