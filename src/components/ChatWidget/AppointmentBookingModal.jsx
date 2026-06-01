import React, { useState, useEffect } from 'react';
import Chatbot from '../../services/Chatbot.js';

const STEPS = ['guests', 'date', 'time', 'info', 'confirm'];

const overlayStyle = {
  position: 'absolute', inset: 0,
  background: 'rgba(0,0,0,0.45)',
  display: 'flex', alignItems: 'flex-end',
  zIndex: 10,
};
const sheetStyle = {
  background: '#fff',
  borderRadius: '16px 16px 0 0',
  padding: '20px 16px 24px',
  width: '100%',
  maxHeight: '80%',
  overflowY: 'auto',
};
const btnPrimary = {
  width: '100%', padding: '12px', background: '#1a1a1a', color: '#fff',
  border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer', marginTop: 12,
};
const btnSecondary = {
  width: '100%', padding: '10px', background: 'transparent', color: '#666',
  border: '1px solid #ddd', borderRadius: 8, fontSize: 13, cursor: 'pointer', marginTop: 8,
};
const inputStyle = {
  width: '100%', padding: '10px 12px', border: '1px solid #ddd',
  borderRadius: 8, fontSize: 14, boxSizing: 'border-box', marginTop: 6,
};

const AppointmentBookingModal = ({ embedKey, conversationId, onClose, onBooked }) => {
  const [step, setStep] = useState('guests');
  const [guestCount, setGuestCount] = useState(2);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [form, setForm] = useState({ customerName: '', customerEmail: '', customerPhone: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch available dates when guest count is set
  const fetchDates = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await Chatbot.get(`/api/embed/available-dates?embedKey=${embedKey}&guestCount=${guestCount}&daysAhead=21`);
      if (res.data?.success) {
        setAvailableDates(res.data.data.availableDates);
        setStep('date');
      } else {
        setError('No se encontraron fechas disponibles.');
      }
    } catch {
      setError('Error al obtener disponibilidad.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch slots for selected date
  const fetchSlots = async (date) => {
    setSelectedDate(date);
    setLoading(true);
    setError('');
    try {
      const res = await Chatbot.get(`/api/embed/availability?embedKey=${embedKey}&date=${date}&guestCount=${guestCount}`);
      if (res.data?.success) {
        setSlots(res.data.data.slots);
        setStep('time');
      } else {
        setError('No hay slots disponibles para ese día.');
      }
    } catch {
      setError('Error al obtener horarios.');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!form.customerName) { setError('El nombre es requerido.'); return; }
    setLoading(true);
    setError('');
    try {
      const scheduledAt = new Date(`${selectedDate}T${selectedTime}:00.000Z`).toISOString();
      const res = await Chatbot.post('/api/embed/appointment', {
        conversationId,
        date: selectedDate,
        time: selectedTime,
        scheduledAt,
        guestCount,
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        customerPhone: form.customerPhone,
        notes: form.notes,
      });
      if (res.data?.success) {
        onBooked(res.data.data.appointment);
      } else {
        setError(res.data?.message || 'Error al agendar.');
      }
    } catch {
      setError('Error al procesar la reserva.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T12:00:00Z');
    return d.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <div style={overlayStyle} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={sheetStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>📅 Reservar mesa</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#666' }}>×</button>
        </div>

        {error && (
          <div style={{ background: '#fff0f0', border: '1px solid #ffccc7', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#cf1322', marginBottom: 12 }}>
            {error}
          </div>
        )}

        {/* Step: guests */}
        {step === 'guests' && (
          <div>
            <p style={{ margin: '0 0 16px 0', fontSize: 14, color: '#555' }}>¿Para cuántas personas es la reserva?</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center', marginBottom: 16 }}>
              <button onClick={() => setGuestCount(g => Math.max(1, g - 1))}
                style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid #ddd', fontSize: 20, cursor: 'pointer', background: '#f5f5f5' }}>−</button>
              <span style={{ fontSize: 28, fontWeight: 700, minWidth: 40, textAlign: 'center' }}>{guestCount}</span>
              <button onClick={() => setGuestCount(g => Math.min(20, g + 1))}
                style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid #ddd', fontSize: 20, cursor: 'pointer', background: '#f5f5f5' }}>+</button>
            </div>
            <p style={{ textAlign: 'center', fontSize: 13, color: '#888', margin: '0 0 16px 0' }}>
              {guestCount === 1 ? '1 persona' : `${guestCount} personas`}
            </p>
            <button style={btnPrimary} onClick={fetchDates} disabled={loading}>
              {loading ? 'Buscando...' : 'Ver disponibilidad →'}
            </button>
          </div>
        )}

        {/* Step: date */}
        {step === 'date' && (
          <div>
            <p style={{ margin: '0 0 4px 0', fontSize: 13, color: '#888' }}>{guestCount} {guestCount === 1 ? 'persona' : 'personas'}</p>
            <p style={{ margin: '0 0 16px 0', fontSize: 14, color: '#555', fontWeight: 600 }}>Selecciona una fecha</p>
            {availableDates.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 24, color: '#888', fontSize: 14 }}>
                Sin fechas disponibles en los próximos 21 días.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {availableDates.map(date => (
                  <button key={date} onClick={() => fetchSlots(date)} disabled={loading}
                    style={{ padding: '12px 16px', border: '1px solid #e0e0e0', borderRadius: 8, background: '#fff', cursor: 'pointer', textAlign: 'left', fontSize: 14, fontWeight: 500, textTransform: 'capitalize' }}>
                    {formatDate(date)}
                  </button>
                ))}
              </div>
            )}
            <button style={btnSecondary} onClick={() => setStep('guests')}>← Volver</button>
          </div>
        )}

        {/* Step: time */}
        {step === 'time' && (
          <div>
            <p style={{ margin: '0 0 4px 0', fontSize: 13, color: '#888' }}>{formatDate(selectedDate)}</p>
            <p style={{ margin: '0 0 16px 0', fontSize: 14, color: '#555', fontWeight: 600 }}>Selecciona un horario</p>
            {slots.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 24, color: '#888', fontSize: 14 }}>No hay horarios disponibles.</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {slots.map(slot => (
                  <button key={slot.time} onClick={() => { setSelectedTime(slot.time); setStep('info'); }}
                    style={{ padding: '12px 8px', border: '1px solid #e0e0e0', borderRadius: 8, background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 15 }}>
                    {slot.time}
                  </button>
                ))}
              </div>
            )}
            <button style={btnSecondary} onClick={() => setStep('date')}>← Volver</button>
          </div>
        )}

        {/* Step: info */}
        {step === 'info' && (
          <div>
            <p style={{ margin: '0 0 4px 0', fontSize: 13, color: '#888' }}>{formatDate(selectedDate)} · {selectedTime} · {guestCount} {guestCount === 1 ? 'persona' : 'personas'}</p>
            <p style={{ margin: '0 0 16px 0', fontSize: 14, color: '#555', fontWeight: 600 }}>Tus datos</p>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Nombre *</label>
              <input style={inputStyle} placeholder="Tu nombre completo" value={form.customerName}
                onChange={e => setForm(p => ({ ...p, customerName: e.target.value }))} />
            </div>
            <div style={{ marginTop: 12 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Email</label>
              <input style={inputStyle} type="email" placeholder="tu@email.com" value={form.customerEmail}
                onChange={e => setForm(p => ({ ...p, customerEmail: e.target.value }))} />
            </div>
            <div style={{ marginTop: 12 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Teléfono</label>
              <input style={inputStyle} type="tel" placeholder="+56 9 1234 5678" value={form.customerPhone}
                onChange={e => setForm(p => ({ ...p, customerPhone: e.target.value }))} />
            </div>
            <div style={{ marginTop: 12 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Notas (opcional)</label>
              <textarea style={{ ...inputStyle, resize: 'none' }} rows={2} placeholder="Ej: Cumpleaños, ocasión especial..."
                value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
            </div>
            <button style={btnPrimary} onClick={() => setStep('confirm')} disabled={!form.customerName}>
              Revisar reserva →
            </button>
            <button style={btnSecondary} onClick={() => setStep('time')}>← Volver</button>
          </div>
        )}

        {/* Step: confirm */}
        {step === 'confirm' && (
          <div>
            <p style={{ margin: '0 0 16px 0', fontSize: 14, color: '#555', fontWeight: 600 }}>Confirmar reserva</p>
            <div style={{ background: '#f9f9f9', borderRadius: 10, padding: '14px 16px', fontSize: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Row label="Fecha" value={formatDate(selectedDate)} />
              <Row label="Hora" value={selectedTime} />
              <Row label="Personas" value={guestCount} />
              <Row label="Nombre" value={form.customerName} />
              {form.customerEmail && <Row label="Email" value={form.customerEmail} />}
              {form.customerPhone && <Row label="Teléfono" value={form.customerPhone} />}
              {form.notes && <Row label="Notas" value={form.notes} />}
            </div>
            <button style={btnPrimary} onClick={handleBook} disabled={loading}>
              {loading ? 'Confirmando...' : '✅ Confirmar reserva'}
            </button>
            <button style={btnSecondary} onClick={() => setStep('info')}>← Editar datos</button>
          </div>
        )}
      </div>
    </div>
  );
};

const Row = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <span style={{ color: '#888' }}>{label}</span>
    <span style={{ fontWeight: 600, textTransform: typeof value === 'string' && value.includes(',') ? 'capitalize' : 'none' }}>{value}</span>
  </div>
);

export default AppointmentBookingModal;
