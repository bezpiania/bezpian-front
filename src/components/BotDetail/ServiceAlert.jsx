import React from 'react';

/**
 * Alerta que se muestra cuando un servicio está activado pero le falta configuración.
 * steps: [{ done: bool, label: string }]
 */
const ServiceAlert = ({ steps = [] }) => {
  const pending = steps.filter(s => !s.done);
  if (pending.length === 0) return null;

  return (
    <div style={{
      marginBottom: 24,
      padding: '16px 20px',
      background: 'rgba(255, 180, 0, 0.08)',
      border: '1px solid rgba(255, 180, 0, 0.35)',
      borderLeft: '4px solid #f5a623',
      borderRadius: 10,
      display: 'flex',
      gap: 14,
      alignItems: 'flex-start',
    }}>
      <span style={{ fontSize: 20, lineHeight: 1 }}>⚠️</span>
      <div>
        <div style={{ fontWeight: 600, fontSize: 13, color: '#92600a', marginBottom: 6 }}>
          Este servicio está activado pero le falta configuración — el bot no lo ofrecerá hasta completarla.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {pending.map((s, i) => (
            <div key={i} style={{ fontSize: 12, color: '#92600a', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>○</span> {s.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceAlert;
