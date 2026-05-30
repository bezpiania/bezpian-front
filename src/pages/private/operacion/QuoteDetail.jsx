import React from 'react';
import { Link } from 'react-router-dom';
import { message } from 'antd';
import AppLayout from '../../../components/AppLayout.jsx';

const PUBLIC_LINK = 'zapien.cl/q/aBc123XyZ';

const QuoteDetail = () => {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText('https://' + PUBLIC_LINK);
      message.success('Link copiado');
    } catch {
      message.error('No se pudo copiar');
    }
  };

  return (
    <AppLayout>
      <div className="page-head" style={{ paddingBottom: 20 }}>
        <div>
          <div className="page-eyebrow">
            <Link to="/cotizaciones" style={{ cursor: 'pointer', borderBottom: '1px solid var(--rule-strong)' }}>Cotizaciones</Link>
            <span className="dot"></span>
            <span>COT-0142</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
            <h1 className="page-title" style={{ fontSize: 32 }}>
              Cotización <em>#0142</em>
            </h1>
            <span className="pill amber">Enviada · vista 2 veces</span>
          </div>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost btn-sm" onClick={copy}>
            <svg><use href="#i-link" /></svg>Copiar link público
          </button>
          <button className="btn btn-ghost btn-sm">
            <svg><use href="#i-mail" /></svg>Reenviar
          </button>
          <button className="btn btn-primary btn-sm">
            <svg><use href="#i-download" /></svg>Descargar PDF
          </button>
        </div>
      </div>

      <div className="page-body">
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24 }}>
          {/* PDF preview */}
          <div>
            <div className="section-head">
              <div>
                <div className="section-num">PDF · cliente lo vio 2 veces</div>
                <div className="section-title">Lo que <em>recibe el cliente</em></div>
              </div>
              <Link to="/cotizacion/COT-0142" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, cursor: 'pointer', opacity: 0.7, borderBottom: '2px solid var(--voltage)' }}>
                Ver versión pública →
              </Link>
            </div>

            <div style={{ background: 'var(--bone)', border: '1px solid var(--rule)', borderRadius: 14, padding: 48, boxShadow: '0 12px 36px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36, borderBottom: '1px solid var(--rule)', paddingBottom: 24 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                    <div style={{ width: 36, height: 36, background: 'var(--voltage)', borderRadius: 9, display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18 }}>A</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' }}>Tienda Acme</div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, opacity: 0.7, lineHeight: 1.5 }}>
                    Av. Providencia 1234<br />
                    Santiago, Chile<br />
                    hola@acme.cl
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.55, marginBottom: 6 }}>Cotización</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, letterSpacing: '-0.025em' }}>#COT-0142</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.6, marginTop: 6 }}>Fecha: 11 may 2026</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.6 }}>Vence: 18 may 2026</div>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.55, marginBottom: 6 }}>Para</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16 }}>Carla Lagos</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, opacity: 0.7 }}>carla.lagos@gmail.com · +56 9 8742 2541</div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--rule-strong)' }}>
                    <th style={{ textAlign: 'left', padding: '10px 0', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.55 }}>Producto</th>
                    <th style={{ textAlign: 'right', padding: '10px 0', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.55, width: 60 }}>Cant.</th>
                    <th style={{ textAlign: 'right', padding: '10px 0', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.55, width: 100 }}>Unitario</th>
                    <th style={{ textAlign: 'right', padding: '10px 0', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.55, width: 100 }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--rule)' }}>
                    <td style={{ padding: '14px 0' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14 }}>Polerón oversize negro talla M</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 12.5, opacity: 0.65, marginTop: 2 }}>Algodón orgánico, hecho en Santiago</div>
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13 }}>3</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13 }}>$29.900</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>$89.700</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--rule)' }}>
                    <td style={{ padding: '14px 0' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14 }}>Envío RM</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 12.5, opacity: 0.65, marginTop: 2 }}>24-48 hrs</div>
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13 }}>1</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13 }}>$0</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>$0</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ minWidth: 240 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontFamily: 'var(--font-body)', fontSize: 13, opacity: 0.7 }}>
                    <span>Subtotal</span><span style={{ fontFamily: 'var(--font-mono)' }}>$89.700</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontFamily: 'var(--font-body)', fontSize: 13, opacity: 0.7 }}>
                    <span>IVA (19%)</span><span style={{ fontFamily: 'var(--font-mono)' }}>$17.043</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', marginTop: 6, borderTop: '2px solid var(--carbon)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' }}>
                    <span>Total</span><span style={{ fontFamily: 'var(--font-mono)', background: 'var(--voltage)', padding: '2px 8px', borderRadius: 6 }}>$106.743</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 32, paddingTop: 18, borderTop: '1px solid var(--rule)', fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 12.5, opacity: 0.65, lineHeight: 1.5 }}>
                Esta cotización es válida hasta el 18 de mayo de 2026. Generada automáticamente por Zapi.{' '}
                <strong style={{ fontStyle: 'normal', fontFamily: 'var(--font-display)', fontWeight: 600 }}>Cualquier duda escríbenos a hola@acme.cl</strong>.
              </div>
            </div>
          </div>

          {/* Side panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card">
              <div className="section-num" style={{ marginBottom: 10 }}>Estado</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--rule)' }}>
                  <div style={{ width: 22, height: 22, background: 'var(--green)', color: 'var(--bone)', borderRadius: '50%', display: 'grid', placeItems: 'center' }}>
                    <svg style={{ width: 11, height: 11 }}><use href="#i-check" /></svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13 }}>Generada</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.5 }}>11 may · 10:18</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--rule)' }}>
                  <div style={{ width: 22, height: 22, background: 'var(--green)', color: 'var(--bone)', borderRadius: '50%', display: 'grid', placeItems: 'center' }}>
                    <svg style={{ width: 11, height: 11 }}><use href="#i-check" /></svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13 }}>Enviada por email</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.5 }}>11 may · 10:18</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--rule)' }}>
                  <div style={{ width: 22, height: 22, background: 'var(--voltage)', color: 'var(--carbon)', borderRadius: '50%', display: 'grid', placeItems: 'center' }}>
                    <svg style={{ width: 11, height: 11 }}><use href="#i-eye" /></svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13 }}>Vista por el cliente · 2 veces</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.5 }}>Última: 11 may · 13:42</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', opacity: 0.4 }}>
                  <div style={{ width: 22, height: 22, background: 'var(--rule)', borderRadius: '50%' }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, fontStyle: 'italic' }}>Pendiente: aceptar o rechazar</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ background: 'var(--voltage)', borderColor: 'var(--carbon)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 8 }}>Link público</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, background: 'rgba(21,20,15,0.1)', padding: '8px 10px', borderRadius: 6, marginBottom: 10, wordBreak: 'break-all' }}>
                {PUBLIC_LINK}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, lineHeight: 1.45, fontStyle: 'italic', opacity: 0.85 }}>
                Compártelo por WhatsApp o email.{' '}
                <strong style={{ fontStyle: 'normal', fontFamily: 'var(--font-display)', fontWeight: 600 }}>El cliente puede aceptar con un click.</strong>
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center', fontSize: 12 }} onClick={copy}>
                  <svg><use href="#i-copy" /></svg>Copiar
                </button>
              </div>
            </div>

            <div className="card">
              <div className="section-num" style={{ marginBottom: 8 }}>Origen</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.5 }}>
                Generada por <strong style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>🛍️ Zapi</strong> desde la conversación{' '}
                <Link to="/conversaciones/4828" style={{ cursor: 'pointer', borderBottom: '1px solid var(--voltage)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                  #4828
                </Link>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default QuoteDetail;
