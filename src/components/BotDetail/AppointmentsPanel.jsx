import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import Chatbot from '../../services/Chatbot.js';
import api from '../../apis/app.js';

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const DAY_LABELS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const EMPTY_RESOURCE = {
  name: '',
  type: 'table',
  capacity: 2,
  isClientSelectable: false,
  description: '',
  durationMinutes: 90,
  bufferMinutes: 15,
  schedule: {
    mon: { enabled: false, slots: [] },
    tue: { enabled: false, slots: [] },
    wed: { enabled: false, slots: [] },
    thu: { enabled: false, slots: [] },
    fri: { enabled: false, slots: [] },
    sat: { enabled: false, slots: [] },
    sun: { enabled: false, slots: [] },
  },
};

// ─── Resource Form ──────────────────────────────────────────────────────────

const ResourceForm = ({ initial, onSave, onCancel, saving }) => {
  const [form, setForm] = useState(initial || EMPTY_RESOURCE);
  const [newSlot, setNewSlot] = useState({});

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const toggleDay = (dayKey) => {
    setForm(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [dayKey]: { ...prev.schedule[dayKey], enabled: !prev.schedule[dayKey].enabled },
      },
    }));
  };

  const addSlot = (dayKey) => {
    const time = newSlot[dayKey];
    if (!time) return;
    const existing = form.schedule[dayKey].slots.map(s => s.time);
    if (existing.includes(time)) return;
    setForm(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [dayKey]: {
          ...prev.schedule[dayKey],
          slots: [...prev.schedule[dayKey].slots, { time }].sort((a, b) => a.time.localeCompare(b.time)),
        },
      },
    }));
    setNewSlot(prev => ({ ...prev, [dayKey]: '' }));
  };

  const removeSlot = (dayKey, time) => {
    setForm(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [dayKey]: {
          ...prev.schedule[dayKey],
          slots: prev.schedule[dayKey].slots.filter(s => s.time !== time),
        },
      },
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="field">
          <label className="field-label">Nombre del recurso *</label>
          <input className="input" placeholder="Ej: Mesa 1, Mesa VIP" value={form.name}
            onChange={e => set('name', e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">Tipo</label>
          <select className="select" value={form.type} onChange={e => set('type', e.target.value)}>
            <option value="table">Mesa</option>
            <option value="person">Persona / Especialista</option>
            <option value="room">Sala / Cabina</option>
            <option value="equipment">Equipo</option>
          </select>
        </div>
        <div className="field">
          <label className="field-label">Capacidad (personas)</label>
          <input className="input" type="number" min={1} value={form.capacity}
            onChange={e => set('capacity', parseInt(e.target.value) || 1)} />
        </div>
        <div className="field">
          <label className="field-label">Duración por reserva (min)</label>
          <input className="input" type="number" min={15} step={15} value={form.durationMinutes}
            onChange={e => set('durationMinutes', parseInt(e.target.value) || 60)} />
        </div>
        <div className="field">
          <label className="field-label">Buffer entre reservas (min)</label>
          <input className="input" type="number" min={0} step={5} value={form.bufferMinutes}
            onChange={e => set('bufferMinutes', parseInt(e.target.value) || 0)} />
        </div>
        <div className="field" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', paddingBottom: 8 }}>
            <input type="checkbox" checked={form.isClientSelectable}
              onChange={() => set('isClientSelectable', !form.isClientSelectable)} />
            <span style={{ fontSize: 14 }}>El cliente puede elegir este recurso</span>
          </label>
          <small style={{ opacity: 0.6, fontSize: 12 }}>
            Si está desactivado, el sistema asigna automáticamente.
          </small>
        </div>
      </div>

      <div className="field">
        <label className="field-label">Descripción (opcional)</label>
        <input className="input" placeholder="Ej: Con vista al jardín, capacidad máx 4 personas"
          value={form.description} onChange={e => set('description', e.target.value)} />
      </div>

      {/* Schedule by day */}
      <div>
        <div className="section-num" style={{ marginBottom: 12 }}>Horario y slots disponibles</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {DAY_KEYS.map((dayKey, i) => {
            const day = form.schedule[dayKey];
            return (
              <div key={dayKey} style={{
                border: '1px solid var(--rule)',
                borderRadius: 8,
                padding: '12px 16px',
                background: day.enabled ? 'var(--bone)' : 'transparent',
                opacity: day.enabled ? 1 : 0.5,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: day.enabled ? 12 : 0 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', minWidth: 100 }}>
                    <input type="checkbox" checked={day.enabled} onChange={() => toggleDay(dayKey)} />
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{DAY_LABELS[i === 0 ? 0 : i]}</span>
                  </label>
                  {day.enabled && (
                    <span style={{ fontSize: 12, opacity: 0.6 }}>
                      {day.slots.length === 0 ? 'Sin slots — agrega horarios abajo' : `${day.slots.length} slot${day.slots.length !== 1 ? 's' : ''}`}
                    </span>
                  )}
                </div>

                {day.enabled && (
                  <div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                      {day.slots.map(s => (
                        <span key={s.time} style={{
                          background: 'var(--ink)', color: '#fff',
                          borderRadius: 6, padding: '4px 10px', fontSize: 13,
                          display: 'flex', alignItems: 'center', gap: 6,
                        }}>
                          {s.time}
                          <button onClick={() => removeSlot(dayKey, s.time)}
                            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, lineHeight: 1, opacity: 0.7 }}>
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input type="time" className="input" style={{ width: 130 }}
                        value={newSlot[dayKey] || ''}
                        onChange={e => setNewSlot(prev => ({ ...prev, [dayKey]: e.target.value }))} />
                      <button className="btn btn-secondary btn-sm" onClick={() => addSlot(dayKey)}>
                        + Agregar slot
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button className="btn btn-secondary" onClick={onCancel} disabled={saving}>Cancelar</button>
        <button className="btn btn-primary" onClick={() => onSave(form)} disabled={saving || !form.name}>
          {saving ? 'Guardando...' : 'Guardar recurso'}
        </button>
      </div>
    </div>
  );
};

// ─── Main Panel ──────────────────────────────────────────────────────────────

const AppointmentsPanel = ({ workspaceId, botId, bot }) => {
  const queryClient = useQueryClient();
  const [config, setConfig] = useState({
    enabled: bot?.integrations?.calendar?.enabled || false,
    timezone: bot?.integrations?.calendar?.timezone || 'America/Santiago',
  });
  const [loading, setLoading] = useState(false);
  const [showGoogleOAuthModal, setShowGoogleOAuthModal] = useState(false);
  const [googleOAuthForm, setGoogleOAuthForm] = useState({
    googleClientId: bot?.integrations?.calendar?.googleClientId || '',
    googleClientSecret: bot?.integrations?.calendar?.googleClientSecret || '',
  });
  const [googleConfigured, setGoogleConfigured] = useState(!!bot?.integrations?.calendar?.googleClientId);
  const isGoogleConnected = !!bot?.integrations?.calendar?.accessToken;

  // Resource state
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [savingResource, setSavingResource] = useState(false);

  useEffect(() => {
    if (bot?.integrations?.calendar) {
      const cal = bot.integrations.calendar;
      setConfig({ enabled: cal.enabled || false, timezone: cal.timezone || 'America/Santiago' });
    }
  }, [bot]);

  // Fetch resources
  const { data: resourcesData, refetch: refetchResources } = useQuery({
    queryKey: ['resources', workspaceId, botId],
    queryFn: async () => {
      const res = await api.get(`/api/workspaces/${workspaceId}/chatbots/${botId}/resources`);
      return res.data;
    },
    enabled: !!workspaceId && !!botId,
  });
  const resources = resourcesData?.resources || [];

  const handleSave = async () => {
    try {
      setLoading(true);
      await Chatbot.update(workspaceId, botId, {
        integrations: {
          ...bot.integrations,
          calendar: { ...bot.integrations?.calendar, enabled: config.enabled, timezone: config.timezone },
        },
      });
      queryClient.invalidateQueries({ queryKey: ['chatbot', workspaceId, botId] });
      message.success('Configuración guardada');
    } catch {
      message.error('Error al guardar configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResource = async (form) => {
    try {
      setSavingResource(true);
      if (editingResource?._id) {
        await api.patch(`/api/workspaces/${workspaceId}/chatbots/${botId}/resources/${editingResource._id}`, form);
        message.success('Recurso actualizado');
      } else {
        await api.post(`/api/workspaces/${workspaceId}/chatbots/${botId}/resources`, form);
        message.success('Recurso creado');
      }
      setShowResourceForm(false);
      setEditingResource(null);
      refetchResources();
    } catch {
      message.error('Error al guardar recurso');
    } finally {
      setSavingResource(false);
    }
  };

  const handleDeleteResource = async (id) => {
    if (!window.confirm('¿Desactivar este recurso?')) return;
    try {
      await api.delete(`/api/workspaces/${workspaceId}/chatbots/${botId}/resources/${id}`);
      message.success('Recurso desactivado');
      refetchResources();
    } catch {
      message.error('Error al desactivar recurso');
    }
  };

  const handleSaveGoogleOAuth = async () => {
    try {
      if (!googleOAuthForm.googleClientId || !googleOAuthForm.googleClientSecret) {
        message.error('Client ID y Client Secret son requeridos'); return;
      }
      setLoading(true);
      const response = await Chatbot.patch(`/api/workspaces/${workspaceId}/chatbots/${botId}/google-oauth`, googleOAuthForm);
      if (response.data?.success) {
        message.success('Credenciales configuradas');
        setGoogleConfigured(true);
        setShowGoogleOAuthModal(false);
      } else {
        message.error(response.data?.message || 'Error al guardar credenciales');
      }
    } catch {
      message.error('Error al guardar credenciales de Google');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectGoogle = async () => {
    try {
      if (!googleConfigured) { setShowGoogleOAuthModal(true); return; }
      setLoading(true);
      const response = await Chatbot.get(`/api/workspaces/${workspaceId}/chatbots/${botId}/calendar/auth-url`);
      if (response?.success && response?.data?.authUrl) {
        window.location.href = response.data.authUrl;
      } else {
        message.error('No se recibió URL de autenticación');
      }
    } catch {
      message.error('Error al conectar Google Calendar');
    } finally {
      setLoading(false);
    }
  };

  const typeLabel = { table: 'Mesa', person: 'Especialista', room: 'Sala', equipment: 'Equipo' };

  return (
    <>
      <div className="section-head">
        <div>
          <div className="section-num">Agendamiento</div>
          <div className="section-title">Configura <em>recursos y disponibilidad</em></div>
        </div>
      </div>

      {/* Enable toggle */}
      <div className="card" style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className="section-num">Estado del agendamiento</div>
            <small style={{ opacity: 0.6 }}>
              {config.enabled ? 'El chatbot puede agendar reservas.' : 'El chatbot no realizará reservas.'}
            </small>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={config.enabled}
              onChange={() => setConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
              style={{ width: 18, height: 18 }} />
            <span style={{ fontWeight: 600 }}>{config.enabled ? 'Activado' : 'Desactivado'}</span>
          </label>
        </div>
      </div>

      {/* Resources */}
      <div style={{ marginTop: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div className="section-num">Recursos</div>
            <small style={{ opacity: 0.6 }}>Mesas, especialistas, salas — cada uno con su propio horario y slots.</small>
          </div>
          {!showResourceForm && (
            <button className="btn btn-primary btn-sm" onClick={() => { setEditingResource(null); setShowResourceForm(true); }}>
              + Agregar recurso
            </button>
          )}
        </div>

        {showResourceForm && (
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="section-num" style={{ marginBottom: 16 }}>
              {editingResource ? 'Editar recurso' : 'Nuevo recurso'}
            </div>
            <ResourceForm
              initial={editingResource || EMPTY_RESOURCE}
              onSave={handleSaveResource}
              onCancel={() => { setShowResourceForm(false); setEditingResource(null); }}
              saving={savingResource}
            />
          </div>
        )}

        {resources.length === 0 && !showResourceForm ? (
          <div className="card" style={{ textAlign: 'center', padding: 40, opacity: 0.6 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🗓️</div>
            <div style={{ fontWeight: 600 }}>Sin recursos aún</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>
              Agrega una mesa, sala o especialista para habilitar reservas.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {resources.map(r => {
              const activeDays = DAY_KEYS.filter(k => r.schedule?.[k]?.enabled);
              const totalSlots = DAY_KEYS.reduce((sum, k) => sum + (r.schedule?.[k]?.slots?.length || 0), 0);
              return (
                <div key={r._id} className="card" style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 8,
                        background: 'var(--bone)', border: '1px solid var(--rule)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                      }}>
                        {r.type === 'table' ? '🪑' : r.type === 'person' ? '👤' : r.type === 'room' ? '🚪' : '🔧'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>{r.name}</div>
                        <div style={{ fontSize: 12, opacity: 0.6, marginTop: 2 }}>
                          {typeLabel[r.type]} · Cap. {r.capacity} · {r.durationMinutes} min
                          {r.bufferMinutes > 0 && ` · ${r.bufferMinutes} min buffer`}
                          {r.isClientSelectable && ' · Elegible por cliente'}
                        </div>
                        <div style={{ fontSize: 12, opacity: 0.5, marginTop: 2 }}>
                          {activeDays.length > 0
                            ? `${activeDays.length} días activos · ${totalSlots} slots/semana`
                            : 'Sin días configurados'}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => {
                        setEditingResource(r); setShowResourceForm(true);
                      }}>Editar</button>
                      <button className="btn btn-secondary btn-sm" style={{ color: '#ff4d4f' }}
                        onClick={() => handleDeleteResource(r._id)}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Google Calendar */}
      <div style={{ marginTop: 32 }}>
        <div className="section-num" style={{ marginBottom: 16 }}>Integración Google Calendar</div>
        <div className="grid-2-eq">
          <div className="card">
            <div className="section-num">Credenciales OAuth</div>
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: googleConfigured ? '#16a766' : '#ff7a45' }}>
                {googleConfigured ? '✅ Configuradas' : '⚠️ No configuradas'}
              </span>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowGoogleOAuthModal(true)} disabled={loading}>
                {googleConfigured ? 'Actualizar' : 'Configurar'}
              </button>
            </div>
          </div>
          <div className="card">
            <div className="section-num">Conexión</div>
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: isGoogleConnected ? '#16a766' : 'var(--carbon)' }}>
                {isGoogleConnected ? '✅ Conectado' : '❌ No conectado'}
              </span>
              {!isGoogleConnected && (
                <button className="btn btn-primary btn-sm" onClick={handleConnectGoogle} disabled={loading || !googleConfigured}>
                  {loading ? 'Conectando...' : 'Conectar'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
        <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar configuración'}
        </button>
      </div>

      {/* Google OAuth Modal */}
      {showGoogleOAuthModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: 12, padding: 24, maxWidth: 500, width: '90%', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 8px 0' }}>Configurar Google OAuth</h3>
            <p style={{ margin: '0 0 20px 0', fontSize: 13, opacity: 0.7 }}>Ingresa tus credenciales de Google Cloud Console</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="field">
                <label className="field-label">Google Client ID *</label>
                <input type="text" className="input" placeholder="Tu Google Client ID"
                  value={googleOAuthForm.googleClientId}
                  onChange={e => setGoogleOAuthForm({ ...googleOAuthForm, googleClientId: e.target.value })} />
              </div>
              <div className="field">
                <label className="field-label">Google Client Secret *</label>
                <input type="password" className="input" placeholder="Tu Google Client Secret"
                  value={googleOAuthForm.googleClientSecret}
                  onChange={e => setGoogleOAuthForm({ ...googleOAuthForm, googleClientSecret: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button className="btn btn-secondary" onClick={() => setShowGoogleOAuthModal(false)} disabled={loading}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSaveGoogleOAuth} disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentsPanel;
