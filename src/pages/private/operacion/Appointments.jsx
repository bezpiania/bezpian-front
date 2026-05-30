import React from 'react';
import AppLayout from '../../../components/AppLayout.jsx';

const DAYS = [
  { label: 'Lun', num: 11, today: false, off: false },
  { label: 'Hoy', num: 12, today: true, off: false },
  { label: 'Mié', num: 13, today: false, off: false },
  { label: 'Jue', num: 14, today: false, off: false },
  { label: 'Vie', num: 15, today: false, off: false },
  { label: 'Sáb', num: 16, today: false, off: true },
  { label: 'Dom', num: 17, today: false, off: true },
];

const Appointments = () => (
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
              {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'].map((h) => (
                <div key={h} style={{ height: 60, padding: '4px 6px', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.05em', opacity: 0.5, textAlign: 'right' }}>
                  {h}
                </div>
              ))}
            </div>

            {/* Lunes */}
            <div style={{ borderLeft: '1px solid var(--rule)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 30, left: 4, right: 4, height: 50, background: 'var(--carbon)', color: 'var(--bone)', borderRadius: 6, padding: '6px 8px', borderLeft: '3px solid var(--voltage)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, opacity: 0.7, letterSpacing: '0.05em' }}>09:30</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 11, lineHeight: 1.1, marginTop: 2 }}>Demo SEO</div>
              </div>
            </div>

            {/* Hoy */}
            <div style={{ borderLeft: '1px solid var(--rule)', position: 'relative', background: 'rgba(220,255,30,0.04)' }}>
              <div style={{ position: 'absolute', top: 60, left: 4, right: 4, height: 50, background: 'var(--voltage)', color: 'var(--carbon)', borderRadius: 6, padding: '6px 8px', borderLeft: '3px solid var(--carbon)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, opacity: 0.8, letterSpacing: '0.05em' }}>10:00</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, lineHeight: 1.1, marginTop: 2 }}>Andrés P.</div>
              </div>
              <div style={{ position: 'absolute', top: 180, left: 4, right: 4, height: 50, background: 'var(--carbon)', color: 'var(--bone)', borderRadius: 6, padding: '6px 8px', borderLeft: '3px solid var(--voltage)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, opacity: 0.7, letterSpacing: '0.05em' }}>12:00</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 11, lineHeight: 1.1, marginTop: 2 }}>Demo curso</div>
              </div>
            </div>

            {/* Mié */}
            <div style={{ borderLeft: '1px solid var(--rule)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 120, left: 4, right: 4, height: 50, background: 'var(--carbon)', color: 'var(--bone)', borderRadius: 6, padding: '6px 8px', borderLeft: '3px solid var(--voltage)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, opacity: 0.7, letterSpacing: '0.05em' }}>11:00</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 11, lineHeight: 1.1, marginTop: 2 }}>M. González</div>
              </div>
            </div>

            {/* Jue */}
            <div style={{ borderLeft: '1px solid var(--rule)', position: 'relative' }}></div>

            {/* Vie */}
            <div style={{ borderLeft: '1px solid var(--rule)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 4, right: 4, height: 80, background: 'var(--carbon)', color: 'var(--bone)', borderRadius: 6, padding: '6px 8px', borderLeft: '3px solid var(--voltage)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, opacity: 0.7, letterSpacing: '0.05em' }}>09:00 — 10:30</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 11, lineHeight: 1.1, marginTop: 2 }}>Carla L.</div>
              </div>
            </div>

            {/* Sáb / Dom — rayados */}
            <div style={{ borderLeft: '1px solid var(--rule)', background: 'repeating-linear-gradient(45deg, transparent, transparent 6px, var(--rule) 6px, var(--rule) 7px)', opacity: 0.4 }}></div>
            <div style={{ borderLeft: '1px solid var(--rule)', background: 'repeating-linear-gradient(45deg, transparent, transparent 6px, var(--rule) 6px, var(--rule) 7px)', opacity: 0.4 }}></div>
          </div>
        </div>

        {/* Lista próximas citas */}
        <div>
          <div className="section-head">
            <div>
              <div className="section-num">Próximas · 5</div>
              <div className="section-title">Tu <em>agenda</em></div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ background: 'var(--voltage)', border: '1px solid var(--carbon)', borderRadius: 12, padding: '16px 18px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.7 }}>Hoy · en 42 min</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em', marginTop: 2 }}>Andrés Pérez</div>
                </div>
                <span className="pill dark">Demo</span>
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.45, opacity: 0.85, marginBottom: 8 }}>
                <em>"Quiero conocer el curso de SEO antes de inscribirme. ¿Pueden mostrarme una clase?"</em>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', opacity: 0.7 }}>
                10:00 — 10:30 · Google Meet · 📚 Edu
              </div>
              <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
                <button className="btn btn-primary btn-sm" style={{ fontSize: 12, padding: '7px 12px' }}>Unirse al Meet</button>
                <button className="btn btn-ghost btn-sm" style={{ fontSize: 12, padding: '7px 12px', background: 'rgba(255,255,255,0.4)' }}>Reagendar</button>
              </div>
            </div>

            {[
              { when: 'Hoy · 12:00', who: 'Demo curso · Camila R.', meta: '30 min · Meet · 📚 Edu' },
              { when: 'Miércoles 14 · 11:00', who: 'María González', meta: '45 min · Presencial · 🌶️ Pikante' },
              { when: 'Viernes 16 · 09:00', who: 'Carla Lagos · Recogida', meta: '90 min · Tienda · 🛍️ Zapi' },
            ].map((a, i) => (
              <div key={i} style={{ background: 'var(--bone-2)', border: '1px solid var(--rule)', borderRadius: 12, padding: '14px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.55 }}>{a.when}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, marginTop: 2 }}>{a.who}</div>
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em', opacity: 0.55 }}>{a.meta}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
);

export default Appointments;
