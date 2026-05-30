import React from 'react';
import AppLayout from '../../../components/AppLayout.jsx';

const PIPELINE = [
  { key: 'new', label: 'Nuevos', count: 12, border: 'var(--rule)', bg: 'var(--bone)' },
  { key: 'contacted', label: 'Contactados', count: 8, border: 'var(--rule)', bg: 'var(--bone)' },
  { key: 'qualified', label: 'Calificados', count: 6, border: 'var(--carbon)', bg: 'var(--voltage)' },
  { key: 'won', label: 'Ganados', count: 4, border: 'var(--green)', bg: 'var(--bone)' },
  { key: 'lost', label: 'Perdidos', count: 2, border: 'var(--magma)', bg: 'var(--bone)', dim: true },
];

const LEADS = [
  { id: 1, initials: 'CL', color: 'var(--voltage)', textColor: 'var(--carbon)', name: 'Carla Lagos', meta: 'Santiago · Primera vez', email: 'carla.lagos@gmail.com', phone: '+56 9 8742 2541', bot: { label: '🛍️ Zapi', tone: 'voltage' }, status: { label: 'Calificado', tone: 'voltage' }, when: 'Hoy 10:18' },
  { id: 2, initials: 'DS', color: '#1B2C5C', textColor: 'var(--bone)', name: 'Daniel Soto', meta: 'Valparaíso · Recurrente', email: 'd.soto@empresa.cl', phone: '+56 9 5421 8821', bot: { label: '🛍️ Zapi', tone: 'voltage' }, status: { label: 'Contactado', tone: 'amber' }, when: 'Hoy 02:14' },
  { id: 3, initials: 'MG', color: '#EC4899', textColor: 'var(--bone)', name: 'María González', meta: 'La Serena', email: 'maria@restaurant.cl', phone: '+56 9 9821 4441', bot: { label: '🌶️ Pikante', tone: 'magma' }, status: { label: 'Ganado', tone: 'green' }, when: 'Ayer 17:42' },
  { id: 4, initials: 'AP', color: '#8B5CF6', textColor: 'var(--bone)', name: 'Andrés Pérez', meta: 'Temuco · Pidió demo', email: 'andres@startup.cl', phone: '+56 9 3344 5566', bot: { label: '📚 Edu', tone: 'dark' }, status: { label: 'Nuevo', tone: 'muted' }, when: 'Ayer 09:12' },
  { id: 5, initials: 'JM', color: '#2DBE60', textColor: 'var(--bone)', name: 'Javiera Muñoz', meta: 'Santiago', email: 'jmunoz@correo.cl', phone: '—', bot: { label: '🛍️ Zapi', tone: 'voltage' }, status: { label: 'Perdido', tone: 'red' }, when: '3 días' },
];

const BotPill = ({ bot }) =>
  bot.tone === 'magma' ? (
    <span className="pill" style={{ background: '#FF4D1F', color: 'var(--bone)' }}>{bot.label}</span>
  ) : (
    <span className={'pill ' + bot.tone}>{bot.label}</span>
  );

const Leads = () => (
  <AppLayout>
    <div className="page-head with-halo">
      <div>
        <div className="page-eyebrow">
          <span>Leads</span>
          <span className="dot"></span>
          <span>32 totales · 8 nuevos esta semana</span>
        </div>
        <h1 className="page-title">
          CRM <span className="hl">liviano</span><br />para tu equipo.
        </h1>
        <p className="page-sub">
          Los clientes que mostraron interés. Mueve por el embudo, agrega notas, exporta cuando quieras.
        </p>
      </div>
      <div className="page-actions">
        <button className="btn btn-ghost btn-sm">
          <svg><use href="#i-download" /></svg>Exportar CSV
        </button>
      </div>
    </div>

    <div className="page-body">
      {/* Pipeline */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, background: 'var(--rule-strong)', border: '1px solid var(--rule-strong)', borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
        {PIPELINE.map((p) => (
          <div key={p.key} style={{ background: p.bg, padding: 14, cursor: 'pointer', borderBottom: `3px solid ${p.border}`, opacity: p.dim ? 0.75 : 1 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 4 }}>
              {p.label}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, letterSpacing: '-0.03em' }}>
              {p.count}
            </div>
          </div>
        ))}
      </div>

      <div className="filter-bar">
        <div className="search">
          <svg><use href="#i-search" /></svg>
          <input placeholder="Buscar por nombre, email o teléfono…" />
        </div>
        <button className="filter-chip">Todos los estados <svg><use href="#i-chevron-down" /></svg></button>
        <button className="filter-chip"><svg><use href="#i-bot" /></svg>Todos los bots<svg><use href="#i-chevron-down" /></svg></button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: 36 }}><input type="checkbox" style={{ cursor: 'pointer' }} /></th>
            <th>Lead</th>
            <th>Contacto</th>
            <th>Origen</th>
            <th>Estado</th>
            <th>Capturado</th>
            <th style={{ width: 48 }}></th>
          </tr>
        </thead>
        <tbody>
          {LEADS.map((l) => (
            <tr key={l.id}>
              <td><input type="checkbox" /></td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, background: l.color, color: l.textColor, borderRadius: '50%', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12 }}>
                    {l.initials}
                  </div>
                  <div>
                    <div className="td-strong">{l.name}</div>
                    <div style={{ fontStyle: 'italic', fontSize: 12, opacity: 0.6, marginTop: 1 }}>{l.meta}</div>
                  </div>
                </div>
              </td>
              <td className="td-mono">
                {l.email}<br />
                <span style={{ opacity: 0.6 }}>{l.phone}</span>
              </td>
              <td><BotPill bot={l.bot} /></td>
              <td><span className={'pill ' + l.status.tone}>{l.status.label}</span></td>
              <td className="td-mono">{l.when}</td>
              <td>
                <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.5, padding: 4 }}>
                  <svg style={{ width: 16, height: 16 }}><use href="#i-dots" /></svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </AppLayout>
);

export default Leads;
