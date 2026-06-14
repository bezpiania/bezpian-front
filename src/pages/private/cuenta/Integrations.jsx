import React from 'react';
import AppLayout from '../../../components/AppLayout.jsx';

const AVAILABLE = [
  { id: 'wa', logo: 'W', logoBg: 'linear-gradient(135deg, #25D366, #128C7E)', logoColor: '#fff', logoFontSize: 24, logoFontWeight: 700, name: 'WhatsApp', sub: 'Business', desc: 'Atiende tus chats de WhatsApp con el mismo bot.', soon: true },
  { id: 'mp', logo: 'MP', logoBg: '#00B5E2', logoColor: '#fff', logoFontSize: 18, logoFontWeight: 800, name: 'Mercado', sub: 'Pago', desc: 'Genera links de pago dentro de cotizaciones. El cliente paga en 2 clicks.' },
  { id: 'sh', logo: 'S', logoBg: '#95BF47', logoColor: '#fff', logoFontSize: 22, logoFontWeight: 800, name: 'Shopify', sub: null, desc: 'Sincroniza tu catálogo y stock automáticamente.' },
  { id: 'js', logo: 'JS', logoBg: '#7C3AED', logoColor: '#fff', logoFontSize: 18, logoFontWeight: 800, name: 'Jumpseller', sub: null, desc: 'Catálogo y órdenes desde tu tienda Jumpseller.' },
  { id: 'gs', logo: 'GS', logoBg: '#0F9D58', logoColor: '#fff', logoFontSize: 18, logoFontWeight: 800, name: 'Google', sub: 'Sheets', desc: 'Exporta leads y cotizaciones a una hoja en tiempo real.' },
];

const Integrations = () => (
  <AppLayout>
    <div className="page-head">
      <div>
        <div className="page-eyebrow">
          <span>Integraciones</span>
          <span className="dot"></span>
          <span>1 conectada · 5 disponibles</span>
        </div>
        <h1 className="page-title">
          Conecta lo que <span className="hl">ya usas.</span>
        </h1>
        <p className="page-sub">
          Calendar, email, payments. Cuanto más conectes, más cosas pueden hacer tus bots sin que tú levantes un dedo.
        </p>
      </div>
    </div>

    <div className="page-body">
      <div className="section-head">
        <div>
          <div className="section-num">Conectadas · 1</div>
          <div className="section-title">Lo que ya <em>está vivo</em></div>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: 32 }}>
        <div style={{ background: 'var(--bone-2)', border: '1px solid var(--carbon)', borderRadius: 14, padding: 20, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 14, right: 14 }}>
            <span className="pill green">Conectado</span>
          </div>
          <div style={{ width: 48, height: 48, background: 'var(--bone)', borderRadius: 12, display: 'grid', placeItems: 'center', marginBottom: 14, boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
            <svg style={{ width: 28, height: 28 }}><use href="#i-google" /></svg>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em', marginBottom: 4 }}>
            Google <em style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontWeight: 400 }}>Calendar</em>
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 13, opacity: 0.7, lineHeight: 1.45, marginBottom: 14 }}>
            Sincroniza citas que tus bots agendan. Avisos automáticos por email al cliente.
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', opacity: 0.55, borderTop: '1px solid var(--rule)', paddingTop: 10, marginBottom: 10 }}>
            hola@acme.cl · desde 15 mar
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }}>Configurar</button>
            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--magma)', borderColor: 'rgba(255,77,31,0.3)' }}>
              Desconectar
            </button>
          </div>
        </div>
      </div>

      <div className="section-head">
        <div>
          <div className="section-num">Disponibles · 5</div>
          <div className="section-title">Para <em>activar</em></div>
        </div>
      </div>

      <div className="grid-3">
        {AVAILABLE.map((a) => (
          <div key={a.id} style={{ background: 'var(--bone-2)', border: '1px solid var(--rule)', borderRadius: 14, padding: 20 }}>
            <div style={{ width: 48, height: 48, background: a.logoBg, color: a.logoColor, borderRadius: 12, display: 'grid', placeItems: 'center', marginBottom: 14, fontFamily: 'var(--font-display)', fontWeight: a.logoFontWeight, fontSize: a.logoFontSize }}>
              {a.logo}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em', marginBottom: 4 }}>
              {a.name} {a.sub && <em style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontWeight: 400 }}>{a.sub}</em>}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 13, opacity: 0.7, lineHeight: 1.45, marginBottom: 14 }}>
              {a.desc}
              {a.soon && <span className="pill voltage" style={{ marginLeft: 4 }}>Próximamente</span>}
            </div>
            {a.soon ? (
              <button className="btn btn-ghost btn-sm" disabled style={{ width: '100%', justifyContent: 'center', opacity: 0.5 }}>
                Avísame cuando salga
              </button>
            ) : (
              <button className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                <svg><use href="#i-plug" /></svg>Conectar
              </button>
            )}
          </div>
        ))}

        {/* Sugerir */}
        <div style={{ background: 'transparent', border: '2px dashed var(--rule-strong)', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 10, minHeight: 240 }}>
          <div style={{ width: 48, height: 48, background: 'var(--bone-2)', border: '1px solid var(--rule)', borderRadius: 12, display: 'grid', placeItems: 'center', color: 'var(--carbon)', opacity: 0.6 }}>
            <svg style={{ width: 22, height: 22 }}><use href="#i-plus" /></svg>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14.5, letterSpacing: '-0.005em' }}>¿Te falta alguna?</div>
          <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 12.5, opacity: 0.7, lineHeight: 1.4, maxWidth: '24ch' }}>
            Dinos qué herramienta usas y la consideramos para el próximo sprint.
          </div>
          <button className="btn btn-ghost btn-sm">Sugerir integración</button>
        </div>
      </div>
    </div>
  </AppLayout>
);

export default Integrations;
