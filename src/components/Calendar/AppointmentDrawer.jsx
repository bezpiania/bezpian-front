import React, { useState } from 'react';
import { fmt, STATUS_STYLES, resourceColor } from './calendarUtils.js';

const Row = ({ label, value }) => value ? (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: 14, borderBottom: '1px solid var(--rule)' }}>
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.45 }}>{label}</span>
    <span style={{ fontFamily: 'var(--font-body)', fontSize: 14 }}>{value}</span>
  </div>
) : null;

const AppointmentDrawer = ({ appointment, resourceIndex, onClose, onUpdateStatus, updating }) => {
  const [confirmCancel, setConfirmCancel] = useState(false);
  if (!appointment) return null;

  const color = resourceColor(appointment.resourceId, resourceIndex);
  const status = STATUS_STYLES[appointment.status] || STATUS_STYLES.scheduled;
  const start = new Date(appointment.scheduledAt);
  const end = appointment.endTime
    ? new Date(appointment.endTime)
    : new Date(start.getTime() + (appointment.durationMinutes || 60) * 60000);

  const dateStr = start.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = `${fmt(start)} — ${fmt(end)}`;
  const duration = appointment.durationMinutes || Math.round((end - start) / 60000);

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 199 }} />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 360, background: 'var(--bone)', borderLeft: '1px solid var(--rule)',
        zIndex: 200, display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.08)',
      }}>
        {/* Top accent bar */}
        <div style={{ height: 4, background: color.bg, flexShrink: 0 }} />

        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--rule)', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: status.dot, flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.55 }}>
                  {status.label}
                </span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, lineHeight: 1.1 }}>
                {appointment.customerName || '—'}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.5, marginTop: 4, letterSpacing: '0.05em' }}>
                {appointment.resourceName && `${appointment.resourceName} · `}{duration} min
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, opacity: 0.5, fontSize: 18, lineHeight: 1 }}>✕</button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Row label="Fecha" value={dateStr.charAt(0).toUpperCase() + dateStr.slice(1)} />
          <Row label="Horario" value={timeStr} />
          {appointment.guestCount > 1 && <Row label="Personas" value={`${appointment.guestCount} personas`} />}
          {appointment.customerPhone && <Row label="Teléfono" value={appointment.customerPhone} />}
          {appointment.customerEmail && <Row label="Email" value={appointment.customerEmail} />}
          {appointment.reason && <Row label="Motivo" value={appointment.reason} />}
          {appointment.notes && <Row label="Notas" value={appointment.notes} />}
        </div>

        {/* Actions */}
        {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid var(--rule)', display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
            {appointment.status === 'scheduled' && (
              <button
                onClick={() => onUpdateStatus(appointment._id, 'confirmed')}
                disabled={updating}
                style={{ padding: '10px 16px', background: 'var(--voltage)', color: 'var(--carbon)', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: updating ? 'wait' : 'pointer', fontFamily: 'var(--font-body)' }}
              >
                {updating ? 'Guardando...' : '✓ Confirmar reserva'}
              </button>
            )}
            {appointment.status === 'confirmed' && (
              <button
                onClick={() => onUpdateStatus(appointment._id, 'completed')}
                disabled={updating}
                style={{ padding: '10px 16px', background: 'var(--ink)', color: 'var(--bone)', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: updating ? 'wait' : 'pointer', fontFamily: 'var(--font-body)' }}
              >
                {updating ? 'Guardando...' : '✓ Marcar como completada'}
              </button>
            )}
            {!confirmCancel ? (
              <button
                onClick={() => setConfirmCancel(true)}
                style={{ padding: '10px 16px', background: 'transparent', color: 'var(--magma)', border: '1px solid var(--magma)', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
              >
                Cancelar reserva
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setConfirmCancel(false)} style={{ flex: 1, padding: '9px', background: 'transparent', border: '1px solid var(--rule)', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                  No
                </button>
                <button
                  onClick={() => { onUpdateStatus(appointment._id, 'cancelled'); setConfirmCancel(false); }}
                  disabled={updating}
                  style={{ flex: 1, padding: '9px', background: 'var(--magma)', color: 'var(--bone)', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                >
                  Sí, cancelar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AppointmentDrawer;
