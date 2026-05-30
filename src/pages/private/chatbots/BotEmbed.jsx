import React from 'react';
import { Link } from 'react-router-dom';
import { message } from 'antd';
import AppLayout from '../../../components/AppLayout.jsx';

const SNIPPET = `<!-- Zapien chatbot · Zapi -->
<script src="https://cdn.zapien.cl/widget.js" data-bot="zapi_acme_abc123" async></script>`;

const BotEmbed = () => {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SNIPPET);
      message.success('Código copiado');
    } catch {
      message.error('No se pudo copiar');
    }
  };

  return (
    <AppLayout>
      <div className="page-head with-halo">
        <div>
          <div className="page-eyebrow">
            <Link to="/chatbots" style={{ cursor: 'pointer' }}>Chatbots</Link>
            <span className="dot"></span>
            <Link to="/chatbots/zapi" style={{ cursor: 'pointer' }}>Zapi</Link>
            <span className="dot"></span>
            <span>Embed</span>
          </div>
          <h1 className="page-title">
            Ponlo en tu <span className="hl">sitio.</span>
          </h1>
          <p className="page-sub">
            Pega este código justo antes de{' '}
            <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--carbon)', color: 'var(--voltage)', padding: '2px 6px', borderRadius: 4, fontSize: 13 }}>
              &lt;/body&gt;
            </code>{' '}
            y listo. Funciona en cualquier HTML, WordPress, Shopify, Wix.
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost btn-sm">
            <svg><use href="#i-eye" /></svg>Previsualizar
          </button>
          <button className="btn btn-voltage btn-sm" onClick={copy}>
            <svg><use href="#i-copy" /></svg>Copiar código
          </button>
        </div>
      </div>

      <div className="page-body">
        <div className="grid-2">
          <div>
            <div className="section-head">
              <div>
                <div className="section-num">01 · Tu snippet</div>
                <div className="section-title">Código <em>de embed</em></div>
              </div>
              <span className="pill voltage">2 líneas</span>
            </div>
            <div style={{ background: 'var(--carbon)', color: 'var(--bone)', borderRadius: 12, padding: 24, fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.7, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', gap: 6 }}>
                <button
                  onClick={copy}
                  style={{ background: 'rgba(244,240,232,0.1)', border: '1px solid rgba(244,240,232,0.15)', color: 'var(--bone)', padding: '6px 10px', borderRadius: 6, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5 }}
                >
                  <svg style={{ width: 11, height: 11 }}><use href="#i-copy" /></svg>
                  Copiar
                </button>
              </div>
              <div><span style={{ color: '#9C9586' }}>{'<!-- Zapien chatbot · Zapi -->'}</span></div>
              <div>
                <span style={{ color: '#8FA3D6' }}>{'<script '}</span>
                <span style={{ color: '#DCFF1E' }}>src</span>=<span style={{ color: '#D3B58D' }}>"https://cdn.zapien.cl/widget.js"</span>{' '}
                <span style={{ color: '#DCFF1E' }}>data-bot</span>=<span style={{ color: '#D3B58D' }}>"zapi_acme_abc123"</span>{' '}
                <span style={{ color: '#DCFF1E' }}>async</span>
                <span style={{ color: '#8FA3D6' }}>{'></script>'}</span>
              </div>
            </div>

            <div style={{ marginTop: 18, background: 'var(--bone-2)', border: '1px solid var(--rule)', borderRadius: 12, padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>💡</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, lineHeight: 1.5 }}>
                <strong style={{ fontFamily: 'var(--font-display)', fontWeight: 600, display: 'block', marginBottom: 2 }}>¿Usas un CMS o constructor?</strong>
                <em style={{ opacity: 0.75 }}>Tenemos guías paso a paso para WordPress, Shopify, Wix, Webflow, Jumpseller y Squarespace.</em>
              </div>
            </div>
          </div>

          <div>
            <div className="section-head">
              <div>
                <div className="section-num">02 · Estado</div>
                <div className="section-title">¿Está <em>vivo?</em></div>
              </div>
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ background: 'rgba(45, 190, 96, 0.08)', padding: '16px 18px', borderBottom: '1px solid var(--rule)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 10, height: 10, background: 'var(--green)', borderRadius: '50%', boxShadow: '0 0 0 4px rgba(45,190,96,0.18)', animation: 'pulse 2s ease-in-out infinite' }}></div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: '#1F8849' }}>Detectado en tienda-acme.cl</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.6, letterSpacing: '0.06em' }}>Último ping: hace 2 minutos</div>
                </div>
              </div>
              <div style={{ padding: 18 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.5, marginBottom: 10 }}>Páginas donde aparece</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                  {['tienda-acme.cl/', 'tienda-acme.cl/productos', 'tienda-acme.cl/contacto'].map((p) => (
                    <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'var(--bone)', borderRadius: 6 }}>
                      <svg style={{ width: 11, height: 11, color: 'var(--green)' }}><use href="#i-check" /></svg>
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="section-head">
            <div>
              <div className="section-num">03 · Avanzado</div>
              <div className="section-title">Configuración <em>opcional</em></div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div className="field" style={{ margin: 0 }}>
              <div className="field-label">Dominios permitidos</div>
              <input type="text" className="input" defaultValue="tienda-acme.cl, *.acme.cl" />
              <div className="field-hint">Solo carga en estos dominios. Vacío = todos.</div>
            </div>
            <div className="field" style={{ margin: 0 }}>
              <div className="field-label">Páginas excluidas</div>
              <input type="text" className="input" placeholder="/admin, /checkout" />
              <div className="field-hint">El bot no aparece en estas rutas.</div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default BotEmbed;
