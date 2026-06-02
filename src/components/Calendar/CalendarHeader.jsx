import React from 'react';
import { RESOURCE_COLORS } from './calendarUtils.js';

const CalendarHeader = ({ days, currentDate, onPrev, onNext, onToday, resources, selectedResourceId, onResourceChange }) => {
  const firstDay = days[0];
  const lastDay = days[6];
  const sameMonth = firstDay.date.getMonth() === lastDay.date.getMonth();
  const monthLabel = sameMonth
    ? firstDay.date.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })
    : `${firstDay.date.toLocaleDateString('es-CL', { month: 'short' })} — ${lastDay.date.toLocaleDateString('es-CL', { month: 'short', year: 'numeric' })}`;

  return (
    <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--rule)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      {/* Week range */}
      <div style={{ flex: 1 }}>
        <div className="section-num" style={{ textTransform: 'capitalize' }}>{monthLabel}</div>
        <div className="section-title" style={{ marginTop: 2 }}>
          {firstDay.num} — <em>{lastDay.num}</em>
        </div>
      </div>

      {/* Resource filter */}
      {resources.length > 0 && (
        <select
          value={selectedResourceId}
          onChange={e => onResourceChange(e.target.value)}
          style={{ padding: '7px 12px', border: '1px solid var(--rule)', borderRadius: 8, background: 'var(--bone)', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', cursor: 'pointer' }}
        >
          <option value="">Todos los recursos</option>
          {resources.map((r, i) => (
            <option key={r._id} value={r._id}>{r.name}</option>
          ))}
        </select>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <button onClick={onToday} className="btn btn-ghost btn-sm" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em', padding: '6px 10px' }}>
          Hoy
        </button>
        <button onClick={onPrev} className="btn btn-ghost btn-sm" style={{ padding: '6px 10px' }}>
          <svg style={{ width: 14, height: 14 }}><use href="#i-arrow-left" /></svg>
        </button>
        <button onClick={onNext} className="btn btn-ghost btn-sm" style={{ padding: '6px 10px' }}>
          <svg style={{ width: 14, height: 14 }}><use href="#i-arrow-right" /></svg>
        </button>
      </div>
    </div>
  );
};

// Column header row (day names + numbers)
export const CalendarDayHeaders = ({ days }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `44px repeat(${days.length}, 1fr)`, borderBottom: '1px solid var(--rule)', flexShrink: 0 }}>
    <div />
    {days.map((d) => (
      <div key={d.date.toDateString()} style={{
        padding: '10px 6px',
        textAlign: 'center',
        borderLeft: '1px solid var(--rule)',
        background: d.isToday ? 'rgba(220,255,30,0.1)' : 'transparent',
        opacity: d.isWeekend ? 0.55 : 1,
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: d.isToday ? 0.9 : 0.55 }}>
          {d.isToday ? 'Hoy' : d.label}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, marginTop: 2 }}>
          {d.num}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, opacity: 0.35, marginTop: 1 }}>
          {d.month}
        </div>
      </div>
    ))}
  </div>
);

export default CalendarHeader;
