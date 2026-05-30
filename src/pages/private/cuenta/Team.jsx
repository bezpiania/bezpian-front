import React from 'react';
import AppLayout from '../../../components/AppLayout.jsx';

const MEMBERS = [
  { initials: 'S', color: 'var(--voltage)', textColor: 'var(--carbon)', name: 'Sebastián Rojas', email: 'hola@acme.cl', role: { label: 'Owner', tone: 'dark' }, lastAccess: 'Ahora', joined: '12 mar 2026', isYou: true },
  { initials: 'PV', color: '#EC4899', textColor: 'var(--bone)', name: 'Paula Vega', email: 'paula@acme.cl', role: { label: 'Admin', tone: 'muted' }, lastAccess: 'Hoy 09:02', joined: '15 mar 2026' },
  { initials: 'MR', color: '#1B2C5C', textColor: 'var(--bone)', name: 'Matías Reyes', email: 'matias@acme.cl', role: { label: 'Operador', tone: 'muted' }, lastAccess: 'Ayer', joined: '02 abr 2026' },
];

const PENDING = [
  { email: 'camila@acme.cl', role: 'Operador', sent: 'Hace 2 días' },
  { email: 'jorge.contador@externos.cl', role: 'Solo lectura', sent: 'Hace 5 días' },
];

const Team = () => (
  <AppLayout>
    <div className="page-head with-halo">
      <div>
        <div className="page-eyebrow">
          <span>Equipo</span>
          <span className="dot"></span>
          <span>3 miembros · 2 invitaciones pendientes</span>
        </div>
        <h1 className="page-title">Tu <em>tripulación.</em></h1>
        <p className="page-sub">
          Invita a quien necesite ver los chats, leads o configurar bots. Cada uno tiene un rol con su set de permisos.
        </p>
      </div>
      <div className="page-actions">
        <button className="btn btn-voltage">
          <svg><use href="#i-plus" /></svg>Invitar miembro
        </button>
      </div>
    </div>

    <div className="page-body">
      {/* Invite form */}
      <div className="card" style={{ background: 'var(--voltage)', borderColor: 'var(--carbon)', marginBottom: 24 }}>
        <div className="section-num" style={{ marginBottom: 12, opacity: 0.7 }}>Nueva invitación</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr auto', gap: 10, alignItems: 'flex-end' }}>
          <div className="field" style={{ margin: 0 }}>
            <div className="field-label" style={{ marginBottom: 5 }}>Email del invitado</div>
            <input type="email" className="input" style={{ background: 'var(--bone)' }} placeholder="compañera@empresa.cl" />
          </div>
          <div className="field" style={{ margin: 0 }}>
            <div className="field-label" style={{ marginBottom: 5 }}>Rol</div>
            <select className="select" style={{ background: 'var(--bone)' }} defaultValue="Operador">
              <option>Admin</option>
              <option>Operador</option>
              <option>Solo lectura</option>
            </select>
          </div>
          <button className="btn btn-primary">
            <svg><use href="#i-send" /></svg>Enviar
          </button>
        </div>
      </div>

      <div className="section-head">
        <div>
          <div className="section-num">Miembros activos · 3</div>
          <div className="section-title">Quién tiene <em>acceso</em></div>
        </div>
      </div>

      <table className="data-table" style={{ marginBottom: 32 }}>
        <thead>
          <tr>
            <th>Persona</th>
            <th>Rol</th>
            <th>Último acceso</th>
            <th>Se unió</th>
            <th style={{ width: 48 }}></th>
          </tr>
        </thead>
        <tbody>
          {MEMBERS.map((m, i) => (
            <tr key={i}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, background: m.color, color: m.textColor, borderRadius: '50%', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>
                    {m.initials}
                  </div>
                  <div>
                    <div className="td-strong">
                      {m.name}
                      {m.isYou && <span className="pill voltage" style={{ marginLeft: 6 }}>Tú</span>}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.6, letterSpacing: '0.04em' }}>{m.email}</div>
                  </div>
                </div>
              </td>
              <td><span className={'pill ' + m.role.tone}>{m.role.label}</span></td>
              <td className="td-mono">{m.lastAccess}</td>
              <td className="td-mono">{m.joined}</td>
              <td>
                <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', opacity: m.isYou ? 0.3 : 0.5, padding: 4 }}>
                  <svg style={{ width: 16, height: 16 }}><use href="#i-dots" /></svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="section-head">
        <div>
          <div className="section-num">Pendientes · 2</div>
          <div className="section-title">Invitaciones <em>en el aire</em></div>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Rol</th>
            <th>Enviada</th>
            <th>Estado</th>
            <th style={{ width: 48 }}></th>
          </tr>
        </thead>
        <tbody>
          {PENDING.map((p, i) => (
            <tr key={i}>
              <td className="td-mono">{p.email}</td>
              <td><span className="pill muted">{p.role}</span></td>
              <td className="td-mono">{p.sent}</td>
              <td><span className="pill amber">Esperando</span></td>
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

export default Team;
