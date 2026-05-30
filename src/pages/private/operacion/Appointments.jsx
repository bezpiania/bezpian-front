import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '../../../components/AppLayout.jsx';
import { useGetAppointments } from '../../../hooks/useAppointment.js';

const DAYS_OF_WEEK = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];
const HOURS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];
const COLORS_APPOINTMENT = ['var(--carbon)', 'var(--voltage)', '#1B2C5C', '#EC4899', '#8B5CF6', '#FF6B6B'];

const getDaysOfWeek = () => {
  const days = [];
  const today = new Date();
  today.setDate(today.getDate() - today.getDay() + 1);

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const isToday = d.toDateString() === new Date().toDateString();
    const label = isToday ? 'Hoy' : DAYS_OF_WEEK[i];
    const isOff = i === 5 || i === 6;

    days.push({
      label,
      num: d.getDate(),
      date: d,
      today: isToday,
      off: isOff,
      weekday: i,
    });
  }

  return days;
};

const Appointments = () => {
  const { workspaceId } = useParams();
  const { data: appointmentsResponse, isLoading } = useGetAppointments(workspaceId, workspaceId);
  const appointments = appointmentsResponse?.data || [];

  const DAYS = getDaysOfWeek();

  const appointmentsByDay = useMemo(() => {
    const map = {};
    DAYS.forEach(d => {
      map[d.date.toDateString()] = [];
    });

    appointments.forEach(apt => {
      const aptDate = new Date(apt.date || apt.startTime);
      const dateStr = aptDate.toDateString();
      if (map[dateStr]) {
        map[dateStr].push(apt);
      }
    });

    return map;
  }, [appointments, DAYS]);

  const upcomingAppointments = useMemo(() => {
    return appointments
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      .slice(0, 5);
  }, [appointments]);

  const formatTime = (date) => {
    if (!date) return '—';
    const d = new Date(date);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const getTimePosition = (timeStr) => {
    const [hour] = timeStr.split(':').map(Number);
    return (hour - 9) * 60;
  };

  return (
  <AppLayout>
    <div className="page-head with-halo">
      <div>
        <div className="page-eyebrow">
          <span>Agenda</span>
          <span className="dot"></span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 7, height: 7, background: 'var(--green)', borderRadius: '50%' }}></span>
            Google Calendar sincronizado
          </span>
        </div>
        <h1 className="page-title">
          Lo que <span className="hl">viene</span><br />esta semana.
        </h1>
        <p className="page-sub">
          Las citas que tu bot agendó. Todo se sincroniza con tu Google Calendar automáticamente.
        </p>
      </div>
      <div className="page-actions">
        <button className="filter-chip"><svg><use href="#i-cal" /></svg>11 — 17 may<svg><use href="#i-chevron-down" /></svg></button>
        <button className="btn btn-primary btn-sm">
          <svg><use href="#i-plus" /></svg>Bloquear horario
        </button>
      </div>
    </div>

    <div className="page-body">
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
        {/* Calendar */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--rule)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="section-num">Esta semana</div>
              <div className="section-title">Semana del <em>11 mayo</em></div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button className="btn btn-ghost btn-sm" style={{ padding: '6px 10px' }}>
                <svg><use href="#i-arrow-left" /></svg>
              </button>
              <button className="btn btn-ghost btn-sm" style={{ padding: '6px 10px' }}>
                <svg><use href="#i-arrow-right" /></svg>
              </button>
            </div>
          </div>

          {/* Header de días */}
          <div style={{ display: 'grid', gridTemplateColumns: '48px repeat(7, 1fr)', borderBottom: '1px solid var(--rule)' }}>
            <div></div>
            {DAYS.map((d, i) => (
              <div
                key={i}
                style={{
                  padding: '10px 6px',
                  textAlign: 'center',
                  borderLeft: '1px solid var(--rule)',
                  background: d.today ? 'rgba(220,255,30,0.1)' : 'transparent',
                  opacity: d.off ? 0.5 : 1,
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: d.today ? 0.8 : 0.55, color: 'var(--carbon)' }}>
                  {d.label}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginTop: 2 }}>
                  {d.num}
                </div>
              </div>
            ))}
          </div>

          {/* Cuerpo del calendario */}
          <div style={{ display: 'grid', gridTemplateColumns: '48px repeat(7, 1fr)', minHeight: 380 }}>
            <div style={{ borderRight: '1px solid var(--rule)' }}>
              {HOURS.map((h) => (
                <div key={h} style={{ height: 60, padding: '4px 6px', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.05em', opacity: 0.5, textAlign: 'right' }}>
                  {h}
                </div>
              ))}
            </div>

            {DAYS.map((day, dayIdx) => (
              <div
                key={day.date.toDateString()}
                style={{
                  borderLeft: '1px solid var(--rule)',
                  position: 'relative',
                  background: day.today ? 'rgba(220,255,30,0.04)' : 'transparent',
                  opacity: day.off ? 0.5 : 1,
                }}
              >
                {day.off ? (
                  <div style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 6px, var(--rule) 6px, var(--rule) 7px)', height: 360 }} />
                ) : (
                  (appointmentsByDay[day.date.toDateString()] || []).map((apt, aptIdx) => {
                    const startTime = new Date(apt.startTime);
                    const endTime = new Date(apt.endTime);
                    const startHour = startTime.getHours() + startTime.getMinutes() / 60;
                    const duration = (endTime - startTime) / (1000 * 60 * 60);
                    const top = (startHour - 9) * 60;
                    const height = Math.max(50, duration * 60);
                    const bgColor = COLORS_APPOINTMENT[aptIdx % COLORS_APPOINTMENT.length];
                    const textColor = bgColor === 'var(--voltage)' ? 'var(--carbon)' : 'var(--bone)';

                    return (
                      <div
                        key={apt._id}
                        style={{
                          position: 'absolute',
                          top,
                          left: 4,
                          right: 4,
                          height,
                          background: bgColor,
                          color: textColor,
                          borderRadius: 6,
                          padding: '6px 8px',
                          borderLeft: `3px solid ${day.today && bgColor === 'var(--voltage)' ? 'var(--carbon)' : 'var(--voltage)'}`,
                        }}
                      >
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, opacity: 0.8, letterSpacing: '0.05em' }}>
                          {formatTime(apt.startTime)}
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 11, lineHeight: 1.1, marginTop: 2 }}>
                          {apt.clientName || apt.title || '—'}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Lista próximas citas */}
        <div>
          <div className="section-head">
            <div>
              <div className="section-num">Próximas · {upcomingAppointments.length}</div>
              <div className="section-title">Tu <em>agenda</em></div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: 20, opacity: 0.6 }}>Cargando citas...</div>
            ) : upcomingAppointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 20, opacity: 0.6 }}>No hay citas próximas</div>
            ) : (
              upcomingAppointments.map((apt, idx) => {
                const isNextImmediate = idx === 0;
                const startTime = new Date(apt.startTime);
                const endTime = new Date(apt.endTime);
                const now = new Date();
                const diffMs = startTime - now;
                const diffMins = Math.round(diffMs / (1000 * 60));
                const dayStr = startTime.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' });

                return (
                  <div
                    key={apt._id}
                    style={{
                      background: isNextImmediate ? 'var(--voltage)' : 'var(--bone-2)',
                      border: isNextImmediate ? '1px solid var(--carbon)' : '1px solid var(--rule)',
                      borderRadius: 12,
                      padding: '14px 18px',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: isNextImmediate ? 0.7 : 0.55 }}>
                          {diffMins >= 0 && diffMins < 60 ? `En ${diffMins} min` : `${dayStr.charAt(0).toUpperCase() + dayStr.slice(1)} · ${formatTime(apt.startTime)}`}
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: isNextImmediate ? 18 : 15, letterSpacing: isNextImmediate ? '-0.02em' : 0, marginTop: 2 }}>
                          {apt.clientName || apt.title || '—'}
                        </div>
                      </div>
                      {isNextImmediate && <span className="pill dark">{apt.type || 'Cita'}</span>}
                    </div>
                    {isNextImmediate && apt.notes && (
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.45, opacity: 0.85, marginBottom: 8 }}>
                        <em>"{apt.notes}"</em>
                      </div>
                    )}
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em', opacity: isNextImmediate ? 0.7 : 0.55 }}>
                      {formatTime(apt.startTime)} — {formatTime(apt.endTime)} · {apt.location || 'Virtual'}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
  );
};

export default Appointments;
