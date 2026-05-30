import React from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../../components/AppLayout.jsx';

/* Burbujas de chat */
const BotBubble = ({ children, label = '🤖 Zapi · Bot' }) => (
  <div style={{ alignSelf: 'flex-start', maxWidth: '75%', background: 'var(--bone)', border: '1px solid var(--rule)', borderRadius: '14px 14px 14px 4px', padding: '12px 16px' }}>
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.55, marginBottom: 4 }}>{label}</div>
    <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.5 }}>{children}</div>
  </div>
);
const ClientBubble = ({ children, label = 'Carla · Cliente' }) => (
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

const ConversationDetail = () => (
  <AppLayout>
    <div className="page-head" style={{ paddingBottom: 16 }}>
      <div>
        <div className="page-eyebrow">
          <Link to="/conversaciones" style={{ cursor: 'pointer', borderBottom: '1px solid var(--rule-strong)' }}>Conversaciones</Link>
          <span className="dot"></span>
          <span>#4828 · Carla Lagos</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
          <h1 className="page-title" style={{ fontSize: 28 }}>Carla <em>Lagos</em></h1>
          <span className="pill amber">Abierta</span>
          <span className="pill voltage">Cotización generada</span>
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
            Lunes 11 mayo · 10:02 — 10:18 · 16 mensajes
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <TimeDivider>— Inicio · 10:02 —</TimeDivider>

            <BotBubble>¡Hola! Soy Zapi. ¿En qué te puedo ayudar?</BotBubble>

            <ClientBubble>Hola, busco polerones talla M para regalo. ¿Tienen?</ClientBubble>

            <BotBubble>
              ¡Claro! Tenemos 4 modelos en talla M:
              <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ background: 'var(--bone-2)', border: '1px solid var(--rule)', borderRadius: 8, padding: 10, fontSize: 12 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 12.5 }}>Polerón oversize negro</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.6, marginTop: 2 }}>$29.900</div>
                </div>
                <div style={{ background: 'var(--bone-2)', border: '1px solid var(--rule)', borderRadius: 8, padding: 10, fontSize: 12 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 12.5 }}>Polerón clásico gris</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.6, marginTop: 2 }}>$24.900</div>
                </div>
              </div>
            </BotBubble>

            <ClientBubble>El negro me gusta. Quiero 3 unidades. ¿Me das una cotización?</ClientBubble>

            <VoltageBubble label="🤖 Zapi · Cotización generada">
              ¡Genial! Te armé la cotización <strong style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>#COT-0142</strong> por $89.700 (3 unidades). Te la mando por email — ¿está bien{' '}
              <strong style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>carla.lagos@gmail.com</strong>?
            </VoltageBubble>

            <TimeDivider>— 10:18 · Última actividad —</TimeDivider>
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
              <div style={{ width: 44, height: 44, background: 'var(--voltage)', color: 'var(--carbon)', borderRadius: '50%', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>CL</div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14.5 }}>Carla Lagos</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.6, letterSpacing: '0.04em' }}>carla.lagos@gmail.com</div>
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, opacity: 0.7, lineHeight: 1.5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--rule)' }}>
                <span>Teléfono</span><span style={{ fontFamily: 'var(--font-mono)' }}>+56 9 8742 2541</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--rule)' }}>
                <span>Ciudad</span><span>Santiago</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                <span>Primera vez</span><span style={{ fontStyle: 'italic' }}>Sí</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 18 }}>
            <div className="section-num" style={{ marginBottom: 10 }}>Acciones del bot</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.45 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 14 }}>📋</span>
                <span><strong style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>Cotización #COT-0142</strong> <em style={{ opacity: 0.7 }}>por $89.700</em></span>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 14 }}>📧</span>
                <span><strong style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>Email enviado</strong> <em style={{ opacity: 0.7 }}>con PDF adjunto</em></span>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 14 }}>👤</span>
                <span><strong style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>Lead capturado</strong> <em style={{ opacity: 0.7 }}>marcado como "qualified"</em></span>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 18 }}>
            <div className="section-num" style={{ marginBottom: 10 }}>Notas internas</div>
            <textarea className="textarea" placeholder="Apuntes para el equipo (no los ve el cliente)…" style={{ minHeight: 80, fontSize: 13 }} />
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
);

export default ConversationDetail;
