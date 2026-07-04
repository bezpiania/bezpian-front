import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { message } from 'antd';
import instance from '../apis/app.js';

/**
 * TrialBanner — aviso de período de prueba / pago pendiente.
 * Se muestra en 'trialing' (días restantes) y 'past_due' (servicio en pausa).
 * El botón "Pagar" abre el checkout de Lemon Squeezy. No se muestra a clientes finales.
 */
const TrialBanner = () => {
  const workspaceId = localStorage.getItem('workspaceId');
  const role        = localStorage.getItem('workspaceRole') || 'member';
  const plan        = localStorage.getItem('workspacePlan') || 'basico';
  const [paying, setPaying] = useState(false);

  const { data } = useQuery({
    queryKey: ['billing-usage-banner', workspaceId],
    queryFn: () => instance.get(`/api/billing/usage?workspaceId=${workspaceId}`),
    enabled: !!workspaceId && role !== 'client',
    staleTime: 60000,
    select: (d) => (d?.data ?? d)?.subscription || null,
  });

  if (!data || role === 'client') return null;
  if (data.status === 'active') return null;

  const pastDue = data.status === 'past_due' || data.status === 'canceled';

  const handlePay = async () => {
    try {
      setPaying(true);
      const res = await instance.post('/api/billing/checkout', { workspaceId, plan });
      const url = res?.data?.url || res?.url;
      if (url) window.location.href = url;
      else message.error('No se pudo iniciar el pago. Revisa la configuración de cobros.');
    } catch (err) {
      message.error(err?.response?.data?.message || 'No se pudo iniciar el pago');
    } finally { setPaying(false); }
  };

  const bg   = pastDue ? '#fdecec' : '#fff7e6';
  const bd   = pastDue ? '#e24b4a' : '#f0b429';
  const text = pastDue
    ? 'Tu período de prueba terminó. Reactiva tu plan para volver a activar tu asistente.'
    : `Te ${data.daysLeft === 1 ? 'queda' : 'quedan'} ${data.daysLeft ?? 0} día${data.daysLeft === 1 ? '' : 's'} de prueba. Activa tu plan para no perder el servicio.`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: bg, borderBottom: `1px solid ${bd}`, fontFamily: 'var(--font-body, sans-serif)', fontSize: 13 }}>
      <span style={{ flex: 1, color: '#5f4a12' }}>{text}</span>
      <button onClick={handlePay} disabled={paying} className="btn btn-primary" style={{ fontSize: 13, padding: '6px 14px' }}>
        {paying ? 'Abriendo…' : 'Activar mi plan'}
      </button>
    </div>
  );
};

export default TrialBanner;
