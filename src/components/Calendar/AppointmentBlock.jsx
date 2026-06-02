import React from 'react';
import { fmt, STATUS_STYLES } from './calendarUtils.js';

const AppointmentBlock = ({ appointment, color, top, height, onClick, stackIndex = 0, stackTotal = 1 }) => {
  const status = STATUS_STYLES[appointment.status] || STATUS_STYLES.scheduled;
  const isNarrow = height < 48;
  const widthPct = stackTotal > 1 ? Math.floor(90 / stackTotal) : 90;
  const leftPct = stackTotal > 1 ? 5 + stackIndex * Math.floor(90 / stackTotal) : 5;

  return (
    <div
      onClick={() => onClick(appointment)}
      title={`${appointment.customerName} · ${fmt(appointment.scheduledAt)}`}
      style={{
        position: 'absolute',
        top,
        left: `${leftPct}%`,
        width: `${widthPct}%`,
        height,
        background: color.bg,
        color: color.text,
        borderRadius: 6,
        padding: isNarrow ? '3px 6px' : '6px 8px',
        borderLeft: `3px solid ${color.border}`,
        cursor: 'pointer',
        overflow: 'hidden',
        boxSizing: 'border-box',
        transition: 'opacity 0.15s, transform 0.15s',
        zIndex: 10 + stackIndex,
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
    >
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, opacity: 0.75, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
        {fmt(appointment.scheduledAt)}
        {!isNarrow && appointment.resourceName && ` · ${appointment.resourceName}`}
      </div>
      {!isNarrow && (
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 11, lineHeight: 1.2, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {appointment.customerName || '—'}
        </div>
      )}
      {!isNarrow && height > 60 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: status.dot, flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, opacity: 0.7 }}>{status.label}</span>
        </div>
      )}
    </div>
  );
};

export default AppointmentBlock;
