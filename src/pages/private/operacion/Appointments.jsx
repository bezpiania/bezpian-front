import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { message } from 'antd';
import AppLayout from '../../../components/AppLayout.jsx';
import CalendarHeader, { CalendarDayHeaders } from '../../../components/Calendar/CalendarHeader.jsx';
import CalendarGrid from '../../../components/Calendar/CalendarGrid.jsx';
import AppointmentDrawer from '../../../components/Calendar/AppointmentDrawer.jsx';
import { getWeekDays, shiftWeek, relativeLabel, fmt, STATUS_STYLES } from '../../../components/Calendar/calendarUtils.js';
import { useGetAppointments, useCreateAppointment, useUpdateAppointmentStatus } from '../../../hooks/useAppointment.js';
import { useResources } from '../../../hooks/useResources.js';

const Appointments = () => {
  const params = useParams();
  const workspaceId = params.workspaceId || localStorage.getItem('workspaceId');
  const chatbotId = params.id || null;

  // Data
  const { data: appointmentsResponse, isLoading } = useGetAppointments(workspaceId, chatbotId);
  const rawAppointments = appointmentsResponse?.data || [];
  const { data: resources = [] } = useResources(workspaceId, chatbotId);
  const { mutate: createAppointment, isPending: isCreating } = useCreateAppointment(workspaceId, chatbotId);
  const { mutate: updateStatus, isPending: updating } = useUpdateAppointmentStatus(workspaceId, chatbotId);

  // UI state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedResourceId, setSelectedResourceId] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({ scheduledAt: '', customerName: '', customerPhone: '', reason: '', durationMinutes: 60 });

  // Auto-navigate to the week with the most recent appointment if current week is empty
  useEffect(() => {
    if (!rawAppointments.length) return;
    const weekStart = getWeekDays(new Date())[0].date;
    const weekEnd = new Date(getWeekDays(new Date())[6].date);
    weekEnd.setHours(23, 59, 59, 999);
    const hasThisWeek = rawAppointments.some(a => {
      const d = new Date(a.scheduledAt || a.startTime);
      return d >= weekStart && d <= weekEnd;
    });
    if (!hasThisWeek) {
      const nearest = [...rawAppointments].sort((a, b) =>
        Math.abs(new Date(a.scheduledAt) - new Date()) - Math.abs(new Date(b.scheduledAt) - new Date())
      )[0];
      if (nearest) setCurrentDate(new Date(nearest.scheduledAt));
    }
  }, [rawAppointments]);

  // Computed
  const days = useMemo(() => getWeekDays(currentDate), [currentDate]);

  const resourceMap = useMemo(() => {
    const m = {};
    for (const r of resources) m[r._id] = r;
    return m;
  }, [resources]);

  const filteredAppointments = useMemo(() => {
    const weekStart = days[0].date;
    const weekEnd = new Date(days[6].date);
    weekEnd.setHours(23, 59, 59, 999);

    return rawAppointments.filter(a => {
      const d = new Date(a.scheduledAt || a.startTime);
      const inWeek = d >= weekStart && d <= weekEnd;
      const inResource = !selectedResourceId || a.resourceId?.toString() === selectedResourceId;
      return inWeek && inResource;
    });
  }, [rawAppointments, days, selectedResourceId]);

  const upcomingAppointments = useMemo(() => {
    return [...rawAppointments]
      .filter(a => a.status !== 'cancelled')
      .sort((a, b) => new Date(b.scheduledAt || b.startTime) - new Date(a.scheduledAt || a.startTime))
      .slice(0, 8);
  }, [rawAppointments]);

  const handleUpdateStatus = (appointmentId, status) => {
    updateStatus({ appointmentId, status }, {
      onSuccess: () => {
        message.success(status === 'confirmed' ? 'Reserva confirmada' : status === 'completed' ? 'Marcada como completada' : 'Reserva cancelada');
        setSelectedAppointment(prev => prev ? { ...prev, status } : null);
      },
      onError: () => message.error('Error al actualizar estado'),
    });
  };

  const handleCreate = () => {
    if (!form.scheduledAt || !form.customerName) { message.error('Fecha y nombre son requeridos'); return; }
    createAppointment({
      scheduledAt: new Date(form.scheduledAt),
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      reason: form.reason,
      durationMinutes: form.durationMinutes,
    }, {
      onSuccess: () => { message.success('Reserva agendada'); setShowCreateModal(false); setForm({ scheduledAt: '', customerName: '', customerPhone: '', reason: '', durationMinutes: 60 }); },
      onError: () => message.error('Error al agendar'),
    });
  };

  const selectedResourceIndex = selectedAppointment
    ? resources.findIndex(r => r._id === selectedAppointment.resourceId?.toString())
    : -1;

  return (
    <AppLayout>
      <div className="page-head with-halo">
        <div>
          <div className="page-eyebrow">
            <span>Agenda</span>
          </div>
          <h1 className="page-title">
            Lo que <span className="hl">viene</span><br />esta semana.
          </h1>
          <p className="page-sub">
            Todas las reservas agendadas por tu bot, en tiempo real.
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)}>
            <svg><use href="#i-plus" /></svg>Nueva reserva
          </button>
        </div>
      </div>

      <div className="page-body">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>

          {/* Calendar */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 520 }}>
            <CalendarHeader
              days={days}
              currentDate={currentDate}
              onPrev={() => setCurrentDate(d => shiftWeek(d, -1))}
              onNext={() => setCurrentDate(d => shiftWeek(d, 1))}
              onToday={() => setCurrentDate(new Date())}
              resources={resources}
              selectedResourceId={selectedResourceId}
              onResourceChange={setSelectedResourceId}
            />
            <CalendarDayHeaders days={days} />
            {isLoading ? (
              <div style={{ padding: 40, textAlign: 'center', opacity: 0.5, fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                Cargando agenda...
              </div>
            ) : (
              <CalendarGrid
                days={days}
                appointments={filteredAppointments}
                resourceMap={resourceMap}
                onAppointmentClick={setSelectedAppointment}
              />
            )}
          </div>

          {/* Upcoming sidebar */}
          <div>
            <div className="section-head">
              <div>
                <div className="section-num">Próximas · {upcomingAppointments.length}</div>
                <div className="section-title">Tu <em>agenda</em></div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {upcomingAppointments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 24, opacity: 0.5, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                  Sin reservas próximas
                </div>
              ) : upcomingAppointments.map((apt, idx) => {
                const isFirst = idx === 0;
                const status = STATUS_STYLES[apt.status] || STATUS_STYLES.scheduled;
                return (
                  <div
                    key={apt._id}
                    onClick={() => setSelectedAppointment(apt)}
                    style={{
                      background: isFirst ? 'var(--voltage)' : 'var(--bone-2)',
                      border: isFirst ? '1px solid var(--carbon)' : '1px solid var(--rule)',
                      borderRadius: 12, padding: '14px 18px', cursor: 'pointer',
                      transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.55, marginBottom: 3 }}>
                          {relativeLabel(apt.scheduledAt || apt.startTime)}
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: isFirst ? 17 : 14 }}>
                          {apt.customerName || '—'}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: status.dot }} />
                      </div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.55, letterSpacing: '0.04em' }}>
                      {fmt(apt.scheduledAt || apt.startTime)}
                      {resourceMap[apt.resourceId?.toString()] && ` · ${resourceMap[apt.resourceId.toString()].name}`}
                      {apt.guestCount > 1 && ` · ${apt.guestCount} pers.`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Appointment detail drawer */}
      {selectedAppointment && (
        <AppointmentDrawer
          appointment={{ ...selectedAppointment, resourceName: resourceMap[selectedAppointment.resourceId?.toString()]?.name }}
          resourceIndex={selectedResourceIndex >= 0 ? selectedResourceIndex : 0}
          onClose={() => setSelectedAppointment(null)}
          onUpdateStatus={handleUpdateStatus}
          updating={updating}
        />
      )}

      {/* Create modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
          <div style={{ background: 'var(--bone)', borderRadius: 16, padding: 32, maxWidth: 420, width: '90%', boxShadow: '0 24px 60px rgba(0,0,0,0.12)' }}>
            <h2 style={{ margin: '0 0 24px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22 }}>Nueva reserva</h2>
            <div style={{ display: 'grid', gap: 16 }}>
              {[
                { label: 'Fecha y hora *', key: 'scheduledAt', type: 'datetime-local' },
                { label: 'Nombre del cliente *', key: 'customerName', type: 'text', placeholder: 'Ej: Juan García' },
                { label: 'Teléfono', key: 'customerPhone', type: 'tel', placeholder: '+56 9 1234 5678' },
                { label: 'Motivo', key: 'reason', type: 'text', placeholder: 'Consulta, reserva, etc.' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', opacity: 0.7 }}>{f.label}</label>
                  <input type={f.type} value={form[f.key]} placeholder={f.placeholder}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--rule)', fontFamily: 'var(--font-body)', fontSize: 13, boxSizing: 'border-box', background: 'var(--bone)' }} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', opacity: 0.7 }}>Duración</label>
                <select value={form.durationMinutes} onChange={e => setForm(p => ({ ...p, durationMinutes: parseInt(e.target.value) }))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--rule)', fontFamily: 'var(--font-body)', fontSize: 13, background: 'var(--bone)' }}>
                  {[30, 45, 60, 90, 120].map(v => <option key={v} value={v}>{v < 60 ? `${v} min` : `${v / 60}h`}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
              <button onClick={() => setShowCreateModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancelar</button>
              <button onClick={handleCreate} disabled={isCreating}
                style={{ flex: 1, padding: '10px 16px', borderRadius: 8, background: 'var(--voltage)', color: 'var(--carbon)', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)', opacity: isCreating ? 0.7 : 1 }}>
                {isCreating ? 'Agendando...' : 'Agendar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default Appointments;
