import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '../../../components/AppLayout.jsx';
import api from '../../../apis/app.js';

const workspaceId = localStorage.getItem('workspaceId');

const PLANS = [
  {
    key: 'starter',
    label: 'Starter',
    price: '$9.990',
    desc: 'Para empezar sin compromiso.',
    features: ['1 chatbot', '1.000 conversaciones/mes', '2 miembros'],
    missing: ['Sin agendamiento'],
    style: { bg: 'var(--bone-2)', border: 'var(--rule)', labelColor: null, textColor: null },
  },
  {
    key: 'pro',
    label: 'Pro',
    price: '$29.990',
    desc: 'Para PyMEs que venden todos los días.',
    features: ['3 chatbots', '5.000 conversaciones/mes', '10 miembros', 'Agendamiento + integraciones'],
    style: { bg: 'var(--carbon)', border: 'var(--carbon)', labelColor: 'var(--voltage)', textColor: 'var(--bone)' },
  },
  {
    key: 'enterprise',
    label: 'Empresa',
    price: '$99.000',
    desc: 'Cuando ya volaste de la PyME.',
    features: ['Bots ilimitados', '50.000 conversaciones/mes', 'Equipo ilimitado · SSO', 'Soporte dedicado'],
    style: { bg: 'var(--voltage)', border: 'var(--carbon)', labelColor: null, textColor: 'var(--carbon)' },
  },
];

const PLAN_LABELS = { free: 'Free', starter: 'Starter', pro: 'Pro', enterprise: 'Empresa' };

// ── Usage bar ────────────────────────────────────────────────────────────────
const UsageBar = ({ label, used, limit, unlimited }) => {
  const pct    = unlimited || limit <= 0 ? 0 : Math.min(100, Math.round((used / limit) * 100));
  const color  = pct >= 100 ? 'var(--magma)' : pct >= 80 ? '#F59E0B' : 'var(--voltage)';
  const status = unlimited ? 'Ilimitado' : pct >= 100 ? 'Límite alcanzado' : pct >= 80 ? 'Casi al tope' : 'Bien';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14 }}>{label}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.6 }}>
          {used} {unlimited ? '' : `/ ${limit}`}
        </div>
      </div>
      <div style={{ height: 8, background: 'var(--bone-3)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: unlimited ? '100%' : `${pct}%`, background: unlimited ? 'var(--ink)' : color, borderRadius: 999, transition: 'width 0.6s ease' }} />
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 12, opacity: 0.6, marginTop: 6, color: pct >= 100 ? 'var(--magma)' : 'inherit' }}>
        {unlimited ? '∞ Sin límite en tu plan.' : pct >= 100 ? 'Llegaste al tope. Upgrade para continuar.' : pct >= 80 ? `Vas en ${pct}%. Considera hacer upgrade pronto.` : status}
      </div>
    </div>
  );
};

// ── Upgrade modal ────────────────────────────────────────────────────────────
const UpgradeModal = ({ plan, currentPlan, onClose }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
    <div style={{ background: 'var(--bone)', borderRadius: 16, padding: 32, maxWidth: 420, width: '90%', boxShadow: '0 24px 60px rgba(0,0,0,0.12)' }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>🚀</div>
      <h2 style={{ margin: '0 0 8px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22 }}>
        Cambia a {plan.label}
      </h2>
      <p style={{ margin: '0 0 20px', fontFamily: 'var(--font-body)', fontSize: 14, opacity: 0.7, lineHeight: 1.5 }}>
        Para cambiar tu plan contacta a nuestro equipo. Te configuramos el upgrade en minutos.
      </p>
      <div style={{ background: 'var(--bone-2)', borderRadius: 10, padding: '14px 16px', marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.55, marginBottom: 4 }}>CONTACTO</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15 }}>hola@zapien.ai</div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancelar</button>
        <a href="mailto:hola@zapien.ai?subject=Upgrade a plan " + plan.label
          style={{ flex: 1, padding: '10px 16px', borderRadius: 8, background: 'var(--voltage)', color: 'var(--carbon)', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)', textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Contactar →
        </a>
      </div>
    </div>
  </div>
);

// ── Main ─────────────────────────────────────────────────────────────────────
const Billing = () => {
  const [upgradePlan, setUpgradePlan] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['billing-usage', workspaceId],
    queryFn: () => api.get(`/api/billing/usage?workspaceId=${workspaceId}`),
    enabled: !!workspaceId,
  });

  const usage  = data?.data?.usage  || { conversations: 0, chatbots: 0, members: 0 };
  const limits = data?.data?.limits || { conversations: 500, chatbots: 1, members: 2 };
  const plan   = data?.data?.plan   || 'free';

  const periodStart = data?.data?.periodStart ? new Date(data.data.periodStart).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }) : '';
  const periodEnd   = data?.data?.periodEnd   ? new Date(data.data.periodEnd).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }) : '';

  return (
    <AppLayout>
      <div className="page-head with-halo">
        <div>
          <div className="page-eyebrow">
            <span>Plan y facturación</span>
          </div>
          <h1 className="page-title">
            Plan <em>{PLAN_LABELS[plan] || plan}</em>
          </h1>
          <p className="page-sub">
            Revisa tu uso mensual y gestiona tu suscripción.
          </p>
        </div>
        {plan !== 'enterprise' && (
          <div className="page-actions">
            <button className="btn btn-voltage" onClick={() => setUpgradePlan(PLANS.find(p => p.key === 'enterprise'))}>
              Cambiar a Empresa
            </button>
          </div>
        )}
      </div>

      <div className="page-body">

        {/* Usage */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="section-head">
            <div>
              <div className="section-num">Uso del mes</div>
              <div className="section-title">¿Cuánto te <em>queda?</em></div>
            </div>
            {periodStart && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.55 }}>
                {periodStart} → {periodEnd}
              </span>
            )}
          </div>

          {isLoading ? (
            <div style={{ padding: 24, textAlign: 'center', opacity: 0.5, fontFamily: 'var(--font-mono)', fontSize: 12 }}>Cargando uso...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 28 }}>
              <UsageBar label="Conversaciones" used={usage.conversations} limit={limits.conversations} unlimited={limits.conversations < 0} />
              <UsageBar label="Chatbots activos" used={usage.chatbots} limit={limits.chatbots} unlimited={limits.chatbots < 0} />
              <UsageBar label="Miembros del equipo" used={usage.members} limit={limits.members} unlimited={limits.members < 0} />
            </div>
          )}
        </div>

        {/* Plans */}
        <div className="section-head">
          <div>
            <div className="section-num">Planes</div>
            <div className="section-title">¿Cambiar de <em>tier?</em></div>
          </div>
        </div>

        <div className="grid-3" style={{ marginBottom: 32 }}>
          {PLANS.map(p => {
            const isCurrent = p.key === plan || (plan === 'free' && p.key === 'starter');
            const s = p.style;

            return (
              <div key={p.key} style={{ background: s.bg, color: s.textColor || 'inherit', border: `1px solid ${s.border}`, borderRadius: 14, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: s.labelColor, opacity: s.labelColor ? 1 : 0.55 }}>
                    {p.label}
                  </div>
                  {isCurrent && <span className="pill voltage">Tu plan</span>}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 30, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 4 }}>
                  {p.price}<span style={{ fontSize: 13, opacity: 0.5, fontWeight: 500 }}> /mes</span>
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 13, opacity: 0.7, marginBottom: 20 }}>
                  {p.desc}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, fontFamily: 'var(--font-body)', fontSize: 13 }}>
                  {p.features.map(f => (
                    <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <svg style={{ width: 14, height: 14, color: s.labelColor || 'var(--green)', flexShrink: 0, marginTop: 3 }}><use href="#i-check" /></svg>
                      <span>{f}</span>
                    </div>
                  ))}
                  {p.missing?.map(f => (
                    <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', opacity: 0.4 }}>
                      <svg style={{ width: 14, height: 14, flexShrink: 0, marginTop: 3 }}><use href="#i-close" /></svg>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                {isCurrent ? (
                  <button disabled style={{ width: '100%', padding: '9px 16px', borderRadius: 8, border: `1px solid ${s.labelColor || 'var(--rule)'}`, background: 'transparent', color: s.labelColor || 'inherit', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, opacity: 0.5, cursor: 'not-allowed' }}>
                    Plan actual
                  </button>
                ) : (
                  <button onClick={() => setUpgradePlan(p)}
                    style={{ width: '100%', padding: '9px 16px', borderRadius: 8, border: `1px solid ${p.key === 'enterprise' ? 'var(--carbon)' : 'var(--rule)'}`, background: p.key === 'enterprise' ? 'var(--carbon)' : 'transparent', color: p.key === 'enterprise' ? 'var(--voltage)' : 'inherit', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    {plan === 'enterprise' ? 'Bajar a ' : 'Cambiar a '}{p.label}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Payment method placeholder */}
        <div className="card">
          <div className="section-head">
            <div>
              <div className="section-num">Método de pago</div>
              <div className="section-title">Próximamente <em>Mercado Pago</em></div>
            </div>
          </div>
          <div style={{ padding: '16px 0', fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 13.5, opacity: 0.55, lineHeight: 1.55 }}>
            La integración con Mercado Pago estará disponible próximamente. Por ahora, contacta a <strong>hola@zapien.ai</strong> para gestionar tu suscripción.
          </div>
        </div>

      </div>

      {upgradePlan && <UpgradeModal plan={upgradePlan} currentPlan={plan} onClose={() => setUpgradePlan(null)} />}
    </AppLayout>
  );
};

export default Billing;
