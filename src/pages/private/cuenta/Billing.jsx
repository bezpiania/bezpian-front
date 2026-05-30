import React from 'react';
import AppLayout from '../../../components/AppLayout.jsx';

const Billing = () => (
  <AppLayout>
    <div className="page-head with-halo">
      <div>
        <div className="page-eyebrow">
          <span>Plan y facturación</span>
          <span className="dot"></span>
          <span>Próximo cobro: 12 jun · $29.990 CLP</span>
        </div>
        <h1 className="page-title">Plan <em>Pro</em></h1>
        <p className="page-sub">
          3 bots activos · 1.247 conversaciones este mes (de 5.000 incluidas) · facturado por Mercado Pago.
        </p>
      </div>
      <div className="page-actions">
        <button className="btn btn-voltage">Cambiar a Empresa</button>
      </div>
    </div>

    <div className="page-body">
      {/* Usage */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="section-head">
          <div>
            <div className="section-num">Uso del mes</div>
            <div className="section-title">¿Cuánto te <em>queda?</em></div>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.55 }}>11 may → 11 jun</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14 }}>Conversaciones</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.6 }}>1.247 / 5.000</div>
            </div>
            <div style={{ height: 8, background: 'var(--bone)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '25%', background: 'var(--voltage)', borderRadius: 999 }}></div>
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 12, opacity: 0.6, marginTop: 6 }}>
              Vas en buen ritmo, te queda 75%.
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14 }}>Chatbots activos</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.6 }}>3 / 3</div>
            </div>
            <div style={{ height: 8, background: 'var(--bone)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '100%', background: 'var(--magma)', borderRadius: 999 }}></div>
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 12, opacity: 0.6, marginTop: 6, color: 'var(--magma)' }}>
              Llegaste al tope. Upgrade para más.
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14 }}>Miembros del equipo</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.6 }}>3 / 10</div>
            </div>
            <div style={{ height: 8, background: 'var(--bone)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '30%', background: 'var(--carbon)', borderRadius: 999 }}></div>
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 12, opacity: 0.6, marginTop: 6 }}>
              Sobra espacio.
            </div>
          </div>
        </div>
      </div>

      {/* Planes */}
      <div className="section-head">
        <div>
          <div className="section-num">Planes</div>
          <div className="section-title">¿Cambiar de <em>tier?</em></div>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: 32 }}>
        {/* Starter */}
        <div style={{ background: 'var(--bone-2)', border: '1px solid var(--rule)', borderRadius: 14, padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.55, marginBottom: 6 }}>Starter</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 32, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 4 }}>
            $9.990<span style={{ fontSize: 14, opacity: 0.5, fontWeight: 500 }}> /mes</span>
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 13, opacity: 0.65, marginBottom: 20 }}>
            Para empezar sin compromiso.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, fontFamily: 'var(--font-body)', fontSize: 13.5 }}>
            {['1 chatbot', '1.000 conversaciones/mes', '2 miembros'].map((f) => (
              <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <svg style={{ width: 14, height: 14, color: 'var(--green)', flexShrink: 0, marginTop: 3 }}><use href="#i-check" /></svg>
                <span>{f}</span>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', opacity: 0.4 }}>
              <svg style={{ width: 14, height: 14, flexShrink: 0, marginTop: 3 }}><use href="#i-close" /></svg>
              <span>Sin agendamiento</span>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }}>Bajar a Starter</button>
        </div>

        {/* Pro · plan actual (carbon) */}
        <div style={{ background: 'var(--carbon)', color: 'var(--bone)', border: '1px solid var(--carbon)', borderRadius: 14, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--voltage)' }}>Pro</div>
            <span className="pill voltage">Tu plan</span>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 32, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 4 }}>
            $29.990<span style={{ fontSize: 14, opacity: 0.5, fontWeight: 500 }}> /mes</span>
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 13, opacity: 0.75, marginBottom: 20 }}>
            Para PyMEs que venden todos los días.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, fontFamily: 'var(--font-body)', fontSize: 13.5 }}>
            {['3 chatbots', '5.000 conversaciones/mes', '10 miembros', 'Agendamiento + integraciones'].map((f) => (
              <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <svg style={{ width: 14, height: 14, color: 'var(--voltage)', flexShrink: 0, marginTop: 3 }}><use href="#i-check" /></svg>
                <span>{f}</span>
              </div>
            ))}
          </div>
          <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center', background: 'rgba(244,240,232,0.08)', color: 'var(--bone)', borderColor: 'rgba(244,240,232,0.15)' }}>
            Plan actual
          </button>
        </div>

        {/* Empresa */}
        <div style={{ background: 'var(--voltage)', border: '1px solid var(--carbon)', borderRadius: 14, padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 6 }}>Empresa</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 32, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 4 }}>
            $99.000<span style={{ fontSize: 14, opacity: 0.6, fontWeight: 500 }}> /mes</span>
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 13, opacity: 0.75, marginBottom: 20 }}>
            Cuando ya volaste de la PyME.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, fontFamily: 'var(--font-body)', fontSize: 13.5 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <svg style={{ width: 14, height: 14, color: 'var(--carbon)', flexShrink: 0, marginTop: 3 }}><use href="#i-check" /></svg>
              <span><strong style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>Bots ilimitados</strong></span>
            </div>
            {['50.000 conversaciones/mes', 'Equipo ilimitado · SSO', 'Soporte dedicado (humano)'].map((f) => (
              <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <svg style={{ width: 14, height: 14, color: 'var(--carbon)', flexShrink: 0, marginTop: 3 }}><use href="#i-check" /></svg>
                <span>{f}</span>
              </div>
            ))}
          </div>
          <button className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>Cambiar a Empresa</button>
        </div>
      </div>

      {/* Pago + historial */}
      <div className="grid-2-eq">
        <div className="card">
          <div className="section-head">
            <div>
              <div className="section-num">Método de pago</div>
              <div className="section-title">Tu <em>tarjeta</em></div>
            </div>
            <button className="btn btn-ghost btn-sm">
              <svg><use href="#i-edit" /></svg>Cambiar
            </button>
          </div>
          <div style={{ background: 'var(--bone)', border: '1px solid var(--rule)', borderRadius: 10, padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 30, background: 'linear-gradient(135deg, #FFD700, #FF6B00)', borderRadius: 5, display: 'grid', placeItems: 'center', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 11, letterSpacing: '0.05em' }}>MC</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, letterSpacing: '0.1em', fontWeight: 500 }}>•••• •••• •••• 4821</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.55, marginTop: 2, letterSpacing: '0.06em' }}>Mastercard · vence 09/28 · via Mercado Pago</div>
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 12.5, opacity: 0.65, marginTop: 10, lineHeight: 1.45 }}>
            El cobro mensual sale el día 12 de cada mes. Si falla, te avisamos por email <em>antes</em> de cortarte el bot.
          </div>
        </div>

        <div className="card">
          <div className="section-head">
            <div>
              <div className="section-num">Últimas facturas</div>
              <div className="section-title">Historial</div>
            </div>
            <a style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, cursor: 'pointer', opacity: 0.7 }}>Ver todas →</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--rule)', borderRadius: 8, overflow: 'hidden' }}>
            {[
              { label: 'Abril 2026', meta: 'FAC-2026-04 · pagado el 12 abr', amount: '$29.990' },
              { label: 'Marzo 2026', meta: 'FAC-2026-03 · pagado el 12 mar', amount: '$29.990' },
              { label: 'Febrero 2026', extra: '(prorrateado)', meta: 'FAC-2026-02 · pagado el 18 feb', amount: '$14.995' },
            ].map((f, i) => (
              <div key={i} style={{ background: 'var(--bone)', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13.5 }}>
                    {f.label}
                    {f.extra && <em style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontWeight: 400, opacity: 0.6 }}> {f.extra}</em>}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.55, letterSpacing: '0.05em' }}>{f.meta}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 13 }}>{f.amount}</span>
                  <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.5, padding: 4 }}>
                    <svg style={{ width: 14, height: 14 }}><use href="#i-download" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
);

export default Billing;
