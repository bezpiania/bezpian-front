import React, { useState } from 'react';
import { message } from 'antd';
import AccountLayout from '../../../components/AccountLayout.jsx';
import { useTeam, useCreateMember, useUpdateMemberInfo, useUpdateMemberRole, useRemoveMember } from '../../../hooks/useTeam.js';

const workspaceId = localStorage.getItem('workspaceId');

const ROLES = [
  { value: 'admin',  label: 'Admin',    desc: 'Configura bots, gestiona equipo' },
  { value: 'member', label: 'Operador', desc: 'Ve conversaciones, leads y citas' },
];
const ROLE_LABELS = { owner: 'Owner', admin: 'Admin', member: 'Operador' };
const ROLE_TONES  = { owner: 'dark', admin: 'green', member: 'amber' };
const AVATAR_COLORS = ['var(--voltage)', '#EC4899', '#8B5CF6', '#0891B2', '#059669', 'var(--ink)'];
const AVATAR_TEXTS  = ['var(--carbon)', 'var(--bone)', 'var(--bone)', 'var(--bone)', 'var(--bone)', 'var(--bone)'];

const initials = (name, email) => {
  if (name) return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (email?.[0] || '?').toUpperCase();
};

const EMPTY_FORM = { name: '', email: '', password: '', role: 'member' };

const FieldRow = ({ label, children }) => (
  <div>
    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', opacity: 0.7 }}>{label}</label>
    {children}
  </div>
);

const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--rule)', fontFamily: 'var(--font-body)', fontSize: 13, boxSizing: 'border-box', background: 'var(--bone)' };

const Team = () => {
  const { data, isLoading } = useTeam(workspaceId);
  const { mutate: createMember, isPending: creating } = useCreateMember(workspaceId);
  const { mutate: updateInfo, isPending: updatingInfo } = useUpdateMemberInfo(workspaceId);
  const { mutate: updateRole } = useUpdateMemberRole(workspaceId);
  const { mutate: removeMember } = useRemoveMember(workspaceId);

  const members = data?.data?.members || data?.members || [];
  const pending = data?.data?.pending || data?.pending || [];

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_FORM);
  const [showPassword, setShowPassword] = useState(false);

  const [editingMember, setEditingMember] = useState(null); // { userId, name, email, role }
  const [editForm, setEditForm] = useState({});
  const [editShowPassword, setEditShowPassword] = useState(false);

  const [confirmId, setConfirmId] = useState(null);

  const handleCreate = () => {
    if (!createForm.email || !createForm.password) { message.error('Email y contraseña son requeridos'); return; }
    if (createForm.password.length < 6) { message.error('La contraseña debe tener mínimo 6 caracteres'); return; }
    createMember(createForm, {
      onSuccess: (res) => {
        if (res?.success === false) { message.error(res.message); return; }
        message.success('Miembro creado');
        setShowCreate(false);
        setCreateForm(EMPTY_FORM);
      },
      onError: (e) => message.error(e?.response?.data?.message || 'Error al crear miembro'),
    });
  };

  const openEdit = (m) => {
    const userId = m.userId?._id || m.userId;
    setEditingMember({ userId, role: m.role });
    setEditForm({ name: m.userId?.name || m.name || '', email: m.userId?.email || m.email || '', password: '', role: m.role });
    setEditShowPassword(false);
  };

  const handleEdit = () => {
    if (editForm.password && editForm.password.length < 6) { message.error('La contraseña debe tener mínimo 6 caracteres'); return; }
    const { role, ...infoData } = editForm;
    const memberId = editingMember.userId;

    // Update info if changed
    const hasInfoChanges = infoData.name || infoData.email || infoData.password;
    const hasRoleChange = role !== editingMember.role;

    const done = () => { setEditingMember(null); message.success('Miembro actualizado'); };

    if (hasInfoChanges && hasRoleChange) {
      updateInfo({ memberId, ...infoData }, {
        onSuccess: () => updateRole({ memberId, role }, { onSuccess: done }),
      });
    } else if (hasInfoChanges) {
      updateInfo({ memberId, ...infoData }, { onSuccess: done });
    } else if (hasRoleChange) {
      updateRole({ memberId, role }, { onSuccess: done });
    } else {
      setEditingMember(null);
    }
  };

  const handleRemove = (memberId) => {
    removeMember(memberId, {
      onSuccess: () => { message.success('Miembro eliminado'); setConfirmId(null); },
      onError: () => message.error('Error al eliminar'),
    });
  };

  return (
    <AccountLayout>
      <div className="page-head">
        <div>
          <div className="page-eyebrow">
            <span>Equipo</span>
            <span className="dot"></span>
            <span>{members.length} miembro{members.length !== 1 ? 's' : ''}</span>
          </div>
          <h1 className="page-title">Tu <em>tripulación.</em></h1>
          <p className="page-sub">Crea y gestiona los accesos de tu equipo.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(true)}>
            <svg><use href="#i-plus" /></svg>Agregar miembro
          </button>
        </div>
      </div>

      <div className="page-body">
        {/* Members table */}
        <div className="section-head">
          <div>
            <div className="section-num">Miembros activos · {members.length}</div>
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
                <th style={{ width: 100 }}></th>
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => {
                const userId = m.userId?._id || m.userId || m._id;
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
                          <div className="td-strong">{name || email}</div>
                          {name && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.55, letterSpacing: '0.04em' }}>{email}</div>}
                        </div>
                      </div>
                    </td>
                    <td><span className={`pill ${ROLE_TONES[m.role] || 'muted'}`}>{ROLE_LABELS[m.role] || m.role}</span></td>
                    <td className="td-mono">{joined}</td>
                    <td>
                      {!isOwner && (
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <button className="btn btn-secondary btn-sm" style={{ fontSize: 11 }} onClick={() => openEdit(m)}>
                            Editar
                          </button>
                          {confirmId === userId?.toString() ? (
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
                            <button onClick={() => setConfirmId(userId?.toString())}
                              style={{ background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.4, padding: 4 }}>
                              <svg style={{ width: 16, height: 16 }}><use href="#i-trash" /></svg>
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Create modal */}
      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
          <div style={{ background: 'var(--bone)', borderRadius: 16, padding: 32, maxWidth: 440, width: '90%', boxShadow: '0 24px 60px rgba(0,0,0,0.12)' }}>
            <h2 style={{ margin: '0 0 24px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22 }}>Agregar miembro</h2>
            <div style={{ display: 'grid', gap: 16 }}>
              <FieldRow label="Nombre">
                <input style={inputStyle} placeholder="María González" value={createForm.name}
                  onChange={e => setCreateForm(p => ({ ...p, name: e.target.value }))} />
              </FieldRow>
              <FieldRow label="Email *">
                <input style={inputStyle} type="email" placeholder="maria@empresa.cl" value={createForm.email}
                  onChange={e => setCreateForm(p => ({ ...p, email: e.target.value }))} />
              </FieldRow>
              <FieldRow label="Contraseña *">
                <div style={{ position: 'relative' }}>
                  <input style={inputStyle} type={showPassword ? 'text' : 'password'} placeholder="Mínimo 6 caracteres"
                    value={createForm.password} onChange={e => setCreateForm(p => ({ ...p, password: e.target.value }))} />
                  <button type="button" onClick={() => setShowPassword(p => !p)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.5 }}>
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </FieldRow>
              <FieldRow label="Rol">
                <select style={inputStyle} value={createForm.role} onChange={e => setCreateForm(p => ({ ...p, role: e.target.value }))}>
                  {ROLES.map(r => <option key={r.value} value={r.value}>{r.label} — {r.desc}</option>)}
                </select>
              </FieldRow>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => { setShowCreate(false); setCreateForm(EMPTY_FORM); }}>Cancelar</button>
              <button style={{ flex: 1, padding: '10px 16px', borderRadius: 8, background: 'var(--voltage)', color: 'var(--carbon)', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)', opacity: creating ? 0.7 : 1 }}
                onClick={handleCreate} disabled={creating}>
                {creating ? 'Creando...' : 'Crear miembro'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editingMember && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
          <div style={{ background: 'var(--bone)', borderRadius: 16, padding: 32, maxWidth: 440, width: '90%', boxShadow: '0 24px 60px rgba(0,0,0,0.12)' }}>
            <h2 style={{ margin: '0 0 24px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22 }}>Editar miembro</h2>
            <div style={{ display: 'grid', gap: 16 }}>
              <FieldRow label="Nombre">
                <input style={inputStyle} placeholder="Nombre completo" value={editForm.name}
                  onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} />
              </FieldRow>
              <FieldRow label="Email">
                <input style={inputStyle} type="email" value={editForm.email}
                  onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))} />
              </FieldRow>
              <FieldRow label="Nueva contraseña (dejar vacío para no cambiar)">
                <div style={{ position: 'relative' }}>
                  <input style={inputStyle} type={editShowPassword ? 'text' : 'password'} placeholder="Nueva contraseña"
                    value={editForm.password} onChange={e => setEditForm(p => ({ ...p, password: e.target.value }))} />
                  <button type="button" onClick={() => setEditShowPassword(p => !p)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.5 }}>
                    {editShowPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </FieldRow>
              <FieldRow label="Rol">
                <select style={inputStyle} value={editForm.role} onChange={e => setEditForm(p => ({ ...p, role: e.target.value }))}>
                  {ROLES.map(r => <option key={r.value} value={r.value}>{r.label} — {r.desc}</option>)}
                </select>
              </FieldRow>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setEditingMember(null)}>Cancelar</button>
              <button style={{ flex: 1, padding: '10px 16px', borderRadius: 8, background: 'var(--ink)', color: 'var(--bone)', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)', opacity: updatingInfo ? 0.7 : 1 }}
                onClick={handleEdit} disabled={updatingInfo}>
                {updatingInfo ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AccountLayout>
  );
};

export default Team;
