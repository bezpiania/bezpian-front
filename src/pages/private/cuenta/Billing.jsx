import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import AccountLayout from '../../../components/AccountLayout.jsx';
import api from '../../../apis/app.js';
import { PLAN_CONFIG, getPlanConfig } from '../../../config/plans.js';

const workspaceId = localStorage.getItem('workspaceId');

// Build PLANS array from centralized config, adding visual styles
const PLAN_STYLES = {
    basico:     { bg: 'var(--bone-2)', border: 'var(--rule)' },
    pro:        { bg: 'var(--carbon)', border: 'var(--carbon)', labelColor: 'var(--voltage)', textColor: 'var(--bone)' },
    enterprise: { bg: 'var(--voltage)', border: 'var(--carbon)', textColor: 'var(--carbon)' },
};
const PLANS = ['basico', 'pro', 'enterprise'].map(key => ({
    key,
    ...PLAN_CONFIG[key],
    style: PLAN_STYLES[key] || {},
}));

const PLAN_LABELS = Object.fromEntries(Object.entries(PLAN_CONFIG).map(([k, v]) => [k, v.label]));

// ── Usage bar ────────────────────────────────────────────────────────────────
const UsageBar = ({ label, used, limit, unlimited }) => {
    const pct   = unlimited ? 0 : Math.min(100, Math.round((used / limit) * 100));
    const color = pct >= 100 ? 'var(--magma)' : pct >= 80 ? '#F59E0B' : 'var(--voltage)';

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14 }}>{label}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.6 }}>
                    {used}{unlimited ? '' : ` / ${limit}`}
                </div>
            </div>
            <div style={{ height: 8, background: 'var(--bone-3)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: unlimited ? '30%' : `${pct}%`, background: unlimited ? 'var(--ink)' : color, borderRadius: 999, transition: 'width 0.6s ease' }} />
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 12, opacity: 0.6, marginTop: 6, color: pct >= 100 ? 'var(--magma)' : 'inherit' }}>
                {unlimited ? '∞ Sin límite en tu plan.' : pct >= 100 ? 'Llegaste al tope. Actualiza tu plan.' : pct >= 80 ? `Vas en ${pct}%. Considera actualizar tu plan.` : `${100 - pct}% disponible`}
            </div>
        </div>
    );
};

// ── Confirm plan change modal ────────────────────────────────────────────────
const ConfirmPlanModal = ({ plan, currentPlan, onConfirm, onClose, loading }) => {
    const isDowngrade = ['free', 'basico'].includes(plan.key) && ['pro', 'enterprise'].includes(currentPlan);
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
            <div style={{ background: 'var(--bone)', borderRadius: 16, padding: 32, maxWidth: 420, width: '90%', boxShadow: '0 24px 60px rgba(0,0,0,0.12)' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{isDowngrade ? '⚠️' : '🚀'}</div>
                <h2 style={{ margin: '0 0 8px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22 }}>
                    {isDowngrade ? `Bajar a ${plan.label}` : `Cambiar a ${plan.label}`}
                </h2>
                <p style={{ margin: '0 0 20px', fontFamily: 'var(--font-body)', fontSize: 14, opacity: 0.7, lineHeight: 1.5 }}>
                    {isDowngrade
                        ? `Al bajar a ${plan.label} algunos recursos podrían quedar por encima del límite del plan. ¿Confirmas el cambio?`
                        : `Pasarás al plan ${plan.label} por ${plan.price}/mes. El cambio es inmediato.`}
                </p>
                <div style={{ background: 'var(--bone-2)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, opacity: 0.6 }}>PLAN</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{plan.label} — {plan.price}/mes</span>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose} disabled={loading}>Cancelar</button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        style={{ flex: 1, padding: '10px 16px', borderRadius: 8, background: isDowngrade ? 'var(--magma)' : 'var(--voltage)', color: isDowngrade ? 'var(--bone)' : 'var(--carbon)', border: 'none', fontWeight: 700, fontSize: 13, cursor: loading ? 'wait' : 'pointer', fontFamily: 'var(--font-body)' }}>
                        {loading ? 'Cambiando...' : 'Confirmar cambio'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Main ─────────────────────────────────────────────────────────────────────
const Billing = () => {
    const qc = useQueryClient();
    const [confirmPlan, setConfirmPlan] = useState(null);

    const { data: usageData, isLoading } = useQuery({
        queryKey: ['billing-usage', workspaceId],
        queryFn: () => api.get(`/api/billing/usage?workspaceId=${workspaceId}`),
        enabled: !!workspaceId,
    });

    const { data: invoicesData } = useQuery({
        queryKey: ['billing-invoices', workspaceId],
        queryFn: () => api.get(`/api/billing/invoices?workspaceId=${workspaceId}`),
        enabled: !!workspaceId,
    });

    const { mutate: changePlan, isPending: changingPlan } = useMutation({
        mutationFn: (plan) => api.post('/api/billing/change-plan', { workspaceId, plan }),
        onSuccess: (res) => {
            if (res?.success === false) { message.error(res.message); return; }
            message.success(`Plan actualizado a ${PLAN_LABELS[confirmPlan?.key] || confirmPlan?.key}`);
            setConfirmPlan(null);
            qc.invalidateQueries({ queryKey: ['billing-usage', workspaceId] });
        },
        onError: () => message.error('Error al cambiar el plan'),
    });

    const usage    = usageData?.data?.usage   || { conversations: 0, chatbots: 0, members: 0 };
    const limits   = usageData?.data?.limits  || getPlanConfig('free');
    const plan     = usageData?.data?.plan    || 'free';
    const invoices = invoicesData?.data?.invoices || [];

    const periodStart = usageData?.data?.periodStart ? new Date(usageData.data.periodStart).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }) : '';
    const periodEnd   = usageData?.data?.periodEnd   ? new Date(usageData.data.periodEnd).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }) : '';

    return (
        <AccountLayout>
            <div className="page-head with-halo">
                <div>
                    <div className="page-eyebrow">
                        <span>Plan y facturación</span>
                    </div>
                    <h1 className="page-title">Plan <em>{PLAN_LABELS[plan] || plan}</em></h1>
                    <p className="page-sub">Revisa tu uso mensual y gestiona tu suscripción.</p>
                </div>
            </div>

            <div className="page-body">
                {/* Alert banner when near or at limit */}
                {!isLoading && (() => {
                    const convPct = limits.conversations > 0 ? Math.round((usage.conversations / limits.conversations) * 100) : 0;
                    if (convPct >= 100) return (
                        <div style={{ background: 'var(--magma)', color: 'var(--bone)', borderRadius: 10, padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                            <div>
                                <strong style={{ fontFamily: 'var(--font-display)', fontSize: 15 }}>⛔ Límite alcanzado</strong>
                                <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, marginTop: 2, opacity: 0.9 }}>
                                    Tu chatbot está bloqueado — los usuarios ven un mensaje de límite. Actualiza tu plan para restaurar el servicio.
                                </div>
                            </div>
                            <button onClick={() => document.getElementById('planes-section')?.scrollIntoView({ behavior: 'smooth' })}
                                style={{ background: 'var(--bone)', color: 'var(--magma)', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'var(--font-body)' }}>
                                Ver planes →
                            </button>
                        </div>
                    );
                    if (convPct >= 80) return (
                        <div style={{ background: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: 10, padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                            <div>
                                <strong style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: '#92400E' }}>⚠️ Vas en {convPct}% de tu límite</strong>
                                <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, marginTop: 2, color: '#92400E', opacity: 0.8 }}>
                                    Te quedan {limits.conversations - usage.conversations} conversaciones este mes. Considera actualizar tu plan.
                                </div>
                            </div>
                            <button onClick={() => document.getElementById('planes-section')?.scrollIntoView({ behavior: 'smooth' })}
                                style={{ background: '#92400E', color: '#FEF3C7', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'var(--font-body)' }}>
                                Ver planes →
                            </button>
                        </div>
                    );
                    return null;
                })()}

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
                <div id="planes-section" className="section-head">
                    <div>
                        <div className="section-num">Planes disponibles</div>
                        <div className="section-title">¿Cambiar de <em>tier?</em></div>
                    </div>
                </div>

                <div className="grid-3" style={{ marginBottom: 32 }}>
                    {PLANS.map(p => {
                        const isCurrent = p.key === plan;
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
                                <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 13, opacity: 0.7, marginBottom: 20 }}>{p.desc}</div>
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
                                    <button disabled style={{ width: '100%', padding: '9px 16px', borderRadius: 8, border: `1px solid ${s.labelColor || 'var(--rule)'}`, background: 'transparent', color: s.labelColor || 'inherit', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, opacity: 0.4, cursor: 'not-allowed' }}>
                                        Plan actual
                                    </button>
                                ) : (
                                    <button onClick={() => setConfirmPlan(p)}
                                        style={{ width: '100%', padding: '9px 16px', borderRadius: 8, border: `1px solid ${p.key === 'enterprise' ? 'var(--carbon)' : 'var(--rule)'}`, background: p.key === 'enterprise' ? 'var(--carbon)' : 'transparent', color: p.key === 'enterprise' ? 'var(--voltage)' : 'inherit', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                                        Cambiar a {p.label}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Invoices */}
                <div className="grid-2-eq">
                    <div className="card">
                        <div className="section-head">
                            <div>
                                <div className="section-num">Historial de facturas</div>
                                <div className="section-title">Tus <em>cobros</em></div>
                            </div>
                        </div>
                        {invoices.length === 0 ? (
                            <div style={{ padding: '24px 0', fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 13, opacity: 0.5, textAlign: 'center' }}>
                                Sin facturas aún — aparecerán aquí cuando conectes Mercado Pago.
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--rule)', borderRadius: 8, overflow: 'hidden' }}>
                                {invoices.map((inv, i) => (
                                    <div key={i} style={{ background: 'var(--bone)', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div>
                                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13 }}>
                                                {new Date(inv.createdAt).toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })}
                                            </div>
                                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.55, letterSpacing: '0.05em' }}>
                                                {inv.externalReference || `FAC-${inv._id?.slice(-6).toUpperCase()}`} · {inv.status}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 13 }}>
                                                ${inv.amount?.toLocaleString('es-CL')} {inv.currency}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="card">
                        <div className="section-head">
                            <div>
                                <div className="section-num">Método de pago</div>
                                <div className="section-title">Próximamente <em>Mercado Pago</em></div>
                            </div>
                        </div>
                        <div style={{ padding: '16px 0', fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 13, opacity: 0.55, lineHeight: 1.55 }}>
                            La integración con Mercado Pago estará disponible próximamente. Por ahora, los cambios de plan son inmediatos y sin cobro.
                        </div>
                        <div style={{ marginTop: 12, padding: '12px 16px', background: 'var(--bone-2)', borderRadius: 8, fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.6 }}>
                            Contacto: hola@zapien.ai
                        </div>
                    </div>
                </div>

            </div>

            {confirmPlan && (
                <ConfirmPlanModal
                    plan={confirmPlan}
                    currentPlan={plan}
                    onConfirm={() => changePlan(confirmPlan.key)}
                    onClose={() => setConfirmPlan(null)}
                    loading={changingPlan}
                />
            )}
        </AccountLayout>
    );
};

export default Billing;
