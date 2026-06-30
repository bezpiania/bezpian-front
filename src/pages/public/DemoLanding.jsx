import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Chatbot from '../../services/Chatbot.js';

/**
 * DemoLanding — página pública por chatbot (/demo/:embedKey).
 * Muestra los 3 modos en un solo link: texto, voz y widget embebido.
 * Pensada para enviar a un cliente y que pruebe todo desde su teléfono.
 */
const apiUrl = import.meta.env.VITE_API_APP || 'http://localhost:5001';

const BIZ_ICON = { restaurant: '🍽️', store: '🛍️', clinic: '🏥', generic: '🤖' };

const DemoLanding = () => {
  const { embedKey } = useParams();
  const navigate = useNavigate();
  const [bot, setBot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!embedKey) return;
    Chatbot.get(`/api/embed/bot-info?embedKey=${embedKey}`)
      .then((res) => setBot(res?.data || null))
      .catch(() => setBot(null))
      .finally(() => setLoading(false));
  }, [embedKey]);

  const name   = bot?.name || 'Asistente';
  const color  = bot?.widget?.color || '#DCFF1E';
  const avatar = bot?.widget?.avatar || BIZ_ICON[bot?.businessType] || '🤖';
  const origin = typeof window !== 'undefined' ? window.location.origin : '';


  // Esperar a tener la info del bot para no mostrar colores genéricos en el primer render
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bone)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', border: '3px solid rgba(0,0,0,0.12)', borderTopColor: 'var(--carbon)', animation: 'demospin 0.8s linear infinite' }} />
        <style>{`@keyframes demospin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const Btn = ({ icon, title, sub, onClick }) => (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left',
      padding: '18px 20px', borderRadius: 16, cursor: 'pointer',
      background: 'var(--bone)',
      border: '1.5px solid var(--rule)',
      marginBottom: 14,
    }}>
      <span style={{ fontSize: 26 }}>{icon}</span>
      <span style={{ flex: 1 }}>
        <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--carbon)' }}>{title}</span>
        <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 13, opacity: 0.6, color: 'var(--carbon)' }}>{sub}</span>
      </span>
      <span style={{ fontSize: 20, opacity: 0.45 }}>→</span>
    </button>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bone)', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 440, padding: '48px 24px', position: 'relative' }}>
        <div style={{ position: 'fixed', top: -120, right: -120, width: 280, height: 280, borderRadius: 140, background: color, opacity: 0.28, pointerEvents: 'none' }} />

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.55, marginBottom: 14 }}>
          ● Asistente IA · Demo
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: color, display: 'grid', placeItems: 'center', fontSize: 28 }}>{avatar}</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 30, letterSpacing: '-0.03em', margin: 0 }}>{name}</h1>
        </div>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, opacity: 0.75, lineHeight: 1.6, margin: '8px 0 28px' }}>
          {loading ? 'Cargando…' : 'Pruébalo como quieras: escríbele, háblale por voz, o míralo como se vería en un sitio web. Atiende, vende y responde por ti, 24/7.'}
        </p>

        <Btn icon="💬" title="Chatear por texto" sub="Pregúntale lo que quieras, como ChatGPT" onClick={() => navigate(`/demo-chat/${embedKey}`)} />
        <Btn icon="🎙️" title="Hablar por voz" sub="Conversa en voz alta con el asistente" onClick={() => navigate(`/demo-voz/${embedKey}`)} />
        <Btn icon="🔗" title="Verlo en un sitio web" sub="Cómo se vería integrado en tu página" onClick={() => navigate(`/demo-sitio/${embedKey}`)} />

      </div>
    </div>
  );
};

export default DemoLanding;
