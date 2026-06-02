import React, { useState } from 'react';
import { message } from 'antd';
import AppLayout from '../../../components/AppLayout.jsx';
import { useTeam, useInviteMember, useUpdateMemberRole, useRemoveMember } from '../../../hooks/useTeam.js';

const workspaceId = localStorage.getItem('workspaceId');
const currentUserId = localStorage.getItem('userId');

const ROLES = [
  { value: 'admin',  label: 'Admin',    desc: 'Configura bots, ve todo, invita miembros' },
  { value: 'member', label: 'Operador', desc: 'Ve conversaciones, leads y citas' },
];

const ROLE_LABELS = { owner: 'Owner', admin: 'Admin', member: 'Operador' };
const ROLE_TONES  = { owner: 'dark',  admin: 'muted', member: 'muted' };

const initials = (name, email) => {
  if (name) return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (email?.[0] || '?').toUpperCase();
};

const AVATAR_COLORS = ['var(--voltage)', '#EC4899', '#8B5CF6', '#0891B2', '#059669', 'var(--ink)'];
const AVATAR_TEXTS  = ['var(--carbon)', 'var(--bone)', 'var(--bone)', 'var(--bone)', 'var(--bone)', 'var(--bone)'];

const Team = () => {
  const { data, isLoading } = useTeam(workspaceId);
  const { mutate: invite, isPending: inviting } = useInviteMember(workspaceId);
  const { mutate: updateRole } = useUpdateMemberRole(workspaceId);
  const { mutate: removeMember } = useRemoveMember(workspaceId);

  const members  = data?.data?.members  || data?.members  || [];
  const pending  = data?.data?.pending  || data?.pending  || [];

  const [form, setForm]             = useState({ email: '', role: 'member' });
  const [editingId, setEditingId]   = useState(null);
  const [confirmId, setConfirmId]   = useState(null);

  const handleInvite = () => {
    if (!form.email) { message.error('Ingresa un email'); return; }
    invite(form, {
      onSuccess: () => { message.success('Invitación enviada'); setForm({ email: '', role: 'member' }); },
      onError: (e) => message.error(e?.response?.data?.message || 'Error al invitar'),
    });
  };

  const handleRoleChange = (memberId, role) => {
    updateRole({ memberId, role }, {
      onSuccess: () => { message.success('Rol actualizado'); setEditingId(null); },
      onError: () => message.error('Error al actualizar rol'),
    });
  };

  const handleRemove = (memberId) => {
    removeMember(memberId, {
      onSuccess: () => { message.success('Miembro eliminado'); setConfirmId(null); },
      onError: () => message.error('Error al eliminar miembro'),
    });
  };

  const activeCount  = members.length;
  const pendingCount = pending.length;

  return (
    <AppLayout>
      <div className="page-head with-halo">
        <div>
          <div className="page-eyebrow">
            <span>Equipo</span>
            <span className="dot"></span>
            <span>{activeCount} miembro{activeCount !== 1 ? 's' : ''}{pendingCount > 0 ? ` · ${pendingCount} pendiente${pendingCount !== 1 ? 's' : ''}` : ''}</span>
          </div>
          <h1 className="page-title">Tu <em>tripulación.</em></h1>
          <p className="page-sub">Invita a quien necesite acceso. Cada rol tiene sus permisos.</p>
        </div>
      </div>

      <div className="page-body">

        {/* Invite form */}
        <div className="card" style={{ background: 'var(--voltage)', borderColor: 'var(--carbon)', marginBottom: 32 }}>
          <div className="section-num" style={{ marginBottom: 12, opacity: 0.7 }}>Nueva invitación</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr auto', gap: 10, alignItems: 'flex-end' }}>
            <div className="field" style={{ margin: 0 }}>
              <div className="field-label" style={{ marginBottom: 5 }}>Email del invitado</div>
              <input type="email" className="input" style={{ background: 'var(--bone)' }}
                placeholder="compañera@empresa.cl" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleInvite()} />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <div className="field-label" style={{ marginBottom: 5 }}>Rol</div>
              <select className="select" style={{ background: 'var(--bone)' }}
                value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <button className="btn btn-primary" onClick={handleInvite} disabled={inviting}>
              <svg><use href="#i-send" /></svg>
              {inviting ? 'Enviando...' : 'Invitar'}
            </button>
          </div>
          <div style={{ marginTop: 10, display: 'flex', gap: 16 }}>
            {ROLES.map(r => (
              <span key={r.value} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.6 }}>
                <strong>{r.label}:</strong> {r.desc}
              </span>
            ))}
          </div>
        </div>

        {/* Active members */}
        <div className="section-head">
          <div>
            <div className="section-num">Miembros activos · {activeCount}</div>
            <div className="section-title">Quién tiene <em>acceso</em></div>
          </div>
        </div>

        {isLoading ? (
          <div style={{ padding: 32, textAlign: 'center', opacity: 0.5, fontFamily: 'var(--font-mono)', fontSize: 12 }}>Cargando equipo...</div>
        ) : members.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', opacity: 0.5, fontFamily: 'var(--font-mono)', fontSize: 12 }}>Sin miembros aún</div>
        ) : (
          <table className="data-table" style={{ marginBottom: 32 }}>
            <thead>
              <tr>
                <th>Persona</th>
                <th>Rol</th>
                <th>Se unió</th>
                <th style={{ width: 48 }}></th>
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => {
                const userId = m.userId?._id || m.userId || m._id;
                const isYou = userId?.toString() === currentUserId;
                const isOwner = m.role === 'owner';
                const name  = m.userId?.name  || m.name  || '';
                const email = m.userId?.email || m.email || '';
                const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
                const textC = AVATAR_TEXTS[i % AVATAR_TEXTS.length];
                const joined = m.joinedAt ? new Date(m.joinedAt).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

                return (
                  <tr key={userId || i}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, background: color, color: textC, borderRadius: '50%', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                          {initials(name, email)}
                        </div>
                        <div>
                          <div className="td-strong">
                            {name || email}
                            {isYou && <span className="pill voltage" style={{ marginLeft: 6 }}>Tú</span>}
                          </div>
                          {name && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.55, letterSpacing: '0.04em' }}>{email}</div>}
                        </div>
                      </div>
                    </td>
                    <td>
                      {editingId === userId && !isOwner && !isYou ? (
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <select className="select" defaultValue={m.role} style={{ padding: '4px 8px', fontSize: 12 }}
                            onChange={e => handleRoleChange(userId, e.target.value)}>
                            {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                          </select>
                          <button onClick={() => setEditingId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5, fontSize: 16 }}>✕</button>
                        </div>
                      ) : (
                        <span className={`pill ${ROLE_TONES[m.role] || 'muted'}`} style={{ cursor: (!isOwner && !isYou) ? 'pointer' : 'default' }}
                          onClick={() => !isOwner && !isYou && setEditingId(userId)}
                          title={(!isOwner && !isYou) ? 'Clic para cambiar rol' : ''}>
                          {ROLE_LABELS[m.role] || m.role}
                        </span>
                      )}
                    </td>
                    <td className="td-mono">{joined}</td>
                    <td>
                      {!isOwner && !isYou && (
                        confirmId === userId ? (
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button onClick={() => handleRemove(userId)}
                              style={{ background: 'var(--magma)', color: 'var(--bone)', border: 'none', borderRadius: 5, padding: '3px 8px', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>
                              Sí
                            </button>
                            <button onClick={() => setConfirmId(null)}
                              style={{ background: 'transparent', border: '1px solid var(--rule)', borderRadius: 5, padding: '3px 8px', fontSize: 11, cursor: 'pointer' }}>
                              No
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmId(userId)}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.4, padding: 4 }}
                            title="Eliminar miembro">
                            <svg style={{ width: 16, height: 16 }}><use href="#i-trash" /></svg>
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Pending invitations */}
        {pendingCount > 0 && (
          <>
            <div className="section-head">
              <div>
                <div className="section-num">Pendientes · {pendingCount}</div>
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
                </tr>
              </thead>
              <tbody>
                {pending.map((p, i) => {
                  const sent = p.createdAt ? new Date(p.createdAt).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }) : '—';
                  return (
                    <tr key={i}>
                      <td className="td-mono">{p.email}</td>
                      <td><span className="pill muted">{ROLE_LABELS[p.role] || p.role}</span></td>
                      <td className="td-mono">{sent}</td>
                      <td><span className="pill amber">Esperando</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}

      </div>
    </AppLayout>
  );
};

export default Team;
