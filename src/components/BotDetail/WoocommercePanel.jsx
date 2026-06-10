import React, { useState, useEffect, useCallback } from 'react';
import api from '../../apis/app.js';

const STATUS_LABELS = {
  idle:    { label: 'Sin sincronizar', color: 'var(--carbon-light)' },
  syncing: { label: 'Sincronizando…',  color: 'var(--voltage)' },
  success: { label: 'Sincronizado',    color: 'var(--forest)' },
  error:   { label: 'Error',           color: 'var(--magma)' },
};

export default function WoocommercePanel({ workspaceId, botId }) {
  const [config, setConfig]   = useState(null);
  const [form, setForm]       = useState({ storeUrl: '', consumerKey: '', consumerSecret: '' });
  const [saving, setSaving]   = useState(false);
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [msg, setMsg]         = useState(null); // { type: 'ok'|'err', text }
  const [polling, setPolling] = useState(false);

  const BASE = `/api/workspaces/${workspaceId}/chatbots/${botId}/woocommerce`;

  const loadConfig = useCallback(async () => {
    try {
      const res = await api.get(BASE);
      const d = res?.data ?? res; // interceptor returns res.data directly
      setConfig(d);
      setForm(f => ({ ...f, storeUrl: d?.storeUrl || '' }));
    } catch { /* silent */ }
  }, [BASE]);

  useEffect(() => { loadConfig(); }, [loadConfig]);

  // Poll while syncing
  useEffect(() => {
    if (!polling) return;
    const interval = setInterval(async () => {
      const res = await api.get(BASE).catch(() => null);
      if (!res) return;
      const d = res?.data ?? res;
      setConfig(d);
      if (d.lastSyncStatus !== 'syncing') {
        setPolling(false);
        setSyncing(false);
        if (d.lastSyncStatus === 'success') {
          setMsg({ type: 'ok', text: `✅ Sync completado — ${d.lastSyncCount} productos importados.` });
        } else {
          setMsg({ type: 'err', text: `❌ Error: ${d.lastSyncError}` });
        }
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [polling, BASE]);

  const handleSave = async () => {
    if (!form.storeUrl) return setMsg({ type: 'err', text: 'La URL de la tienda es requerida.' });
    setSaving(true); setMsg(null);
    try {
      const body = { storeUrl: form.storeUrl };
      if (form.consumerKey)    body.consumerKey    = form.consumerKey;
      if (form.consumerSecret) body.consumerSecret = form.consumerSecret;
      await api.put(BASE, body);
      setMsg({ type: 'ok', text: 'Credenciales guardadas.' });
      setForm(f => ({ ...f, consumerKey: '', consumerSecret: '' }));
      loadConfig();
    } catch (e) {
      setMsg({ type: 'err', text: e.response?.data?.message || e.message || 'Error al guardar.' });
    } finally { setSaving(false); }
  };

  const handleTest = async () => {
    setTesting(true); setMsg(null);
    try {
      const body = { storeUrl: form.storeUrl };
      if (form.consumerKey)    body.consumerKey    = form.consumerKey;
      if (form.consumerSecret) body.consumerSecret = form.consumerSecret;
      const res = await api.post(`${BASE}/test`, body);
      const d = res?.data ?? res;
      setMsg({ type: 'ok', text: d.message });
    } catch (e) {
      setMsg({ type: 'err', text: e.response?.data?.message || e.message || 'No se pudo conectar.' });
    } finally { setTesting(false); }
  };

  const handleSync = async () => {
    setSyncing(true); setMsg(null);
    try {
      await api.post(`${BASE}/sync`);
      setPolling(true);
      setMsg({ type: 'ok', text: 'Sincronización iniciada…' });
    } catch (e) {
      setSyncing(false);
      setMsg({ type: 'err', text: e.response?.data?.message || 'Error al iniciar sync.' });
    }
  };

  const statusInfo = STATUS_LABELS[config?.lastSyncStatus || 'idle'];

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {/* Header */}
      <div className="section-head">
        <div>
          <div className="section-num">Integración WooCommerce</div>
          <div className="section-title">
            Sincroniza tu catálogo <em>directamente desde tu tienda</em>
          </div>
        </div>
      </div>

      {/* Status bar */}
      {config && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 16px',
          background: 'var(--bone-2)',
          borderRadius: 'var(--border-radius)',
          border: '1px solid var(--rule)',
        }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: statusInfo.color,
            boxShadow: config?.lastSyncStatus === 'syncing' ? `0 0 6px ${statusInfo.color}` : 'none',
          }} />
          <div style={{ flex: 1, fontSize: 13 }}>
            <strong>Estado:</strong> <span style={{ color: statusInfo.color }}>{statusInfo.label}</span>
            {config.lastSyncAt && (
              <span style={{ opacity: 0.6, marginLeft: 8 }}>
                · Última sync: {new Date(config.lastSyncAt).toLocaleString('es-CL')}
              </span>
            )}
            {config.lastSyncCount > 0 && (
              <span style={{ opacity: 0.6, marginLeft: 8 }}>
                · {config.lastSyncCount} productos
              </span>
            )}
          </div>
          {config.hasCredentials && (
            <button
              className="btn btn-primary btn-sm"
              onClick={handleSync}
              disabled={syncing || config?.lastSyncStatus === 'syncing'}
              style={{ minWidth: 140, cursor: syncing ? 'wait' : 'pointer' }}
            >
              {syncing || config?.lastSyncStatus === 'syncing'
                ? '⏳ Sincronizando…'
                : '🔄 Sincronizar ahora'}
            </button>
          )}
        </div>
      )}

      {/* Credentials form */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, marginBottom: 16 }}>
          Credenciales de acceso
        </div>

        <div style={{ display: 'grid', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
              URL de la tienda WooCommerce
            </label>
            <input
              className="input"
              type="url"
              placeholder="https://mitienda.cl"
              value={form.storeUrl}
              onChange={e => setForm(f => ({ ...f, storeUrl: e.target.value }))}
            />
            <div style={{ fontSize: 11, opacity: 0.55, marginTop: 3 }}>
              La URL raíz de tu tienda WordPress, sin la ruta de la API.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                Consumer Key (CK)
              </label>
              <input
                className="input"
                type="password"
                placeholder="ck_..."
                value={form.consumerKey || (config?.hasCredentials && !form._ckFocused ? '••••••••••••••••' : '')}
                onFocus={() => setForm(f => ({ ...f, _ckFocused: true, consumerKey: '' }))}
                onBlur={() => setForm(f => ({ ...f, _ckFocused: false }))}
                onChange={e => setForm(f => ({ ...f, consumerKey: e.target.value }))}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                Consumer Secret (CS)
              </label>
              <input
                className="input"
                type="password"
                placeholder="cs_..."
                value={form.consumerSecret || (config?.hasCredentials && !form._csFocused ? '••••••••••••••••' : '')}
                onFocus={() => setForm(f => ({ ...f, _csFocused: true, consumerSecret: '' }))}
                onBlur={() => setForm(f => ({ ...f, _csFocused: false }))}
                onChange={e => setForm(f => ({ ...f, consumerSecret: e.target.value }))}
              />
            </div>
          </div>

          <div style={{ fontSize: 11, opacity: 0.55 }}>
            Obtén las claves en: WooCommerce → Ajustes → Avanzado → API REST → Añadir clave.
            {config?.hasCredentials && ' Deja en blanco para mantener las credenciales actuales.'}
          </div>
        </div>

        {msg && (
          <div style={{
            marginTop: 14, padding: '10px 14px',
            background: msg.type === 'ok' ? 'var(--forest-light)' : 'var(--magma-light)',
            color:      msg.type === 'ok' ? 'var(--forest)'       : 'var(--magma)',
            borderRadius: 8, fontSize: 13,
          }}>
            {msg.text}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <button
            className="btn btn-sm"
            onClick={handleTest}
            disabled={testing || !form.storeUrl}
            style={{
              background: 'var(--carbon)', color: 'var(--bone)',
              border: '1.5px solid var(--carbon)',
              fontWeight: 600,
              cursor: testing ? 'wait' : 'pointer',
              opacity: (testing || !form.storeUrl) ? 0.45 : 1,
            }}
          >
            {testing ? '⏳ Probando…' : '🔌 Probar conexión'}
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleSave}
            disabled={saving || !form.storeUrl}
            style={{ cursor: saving ? 'wait' : 'pointer' }}
          >
            {saving ? 'Guardando…' : 'Guardar credenciales'}
          </button>
        </div>
      </div>

      {/* How it works */}
      <div className="card" style={{ padding: 20, background: 'var(--bone-2)', border: '1px solid var(--rule)', marginBottom: 32 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, marginBottom: 10 }}>
          ¿Cómo funciona la sincronización?
        </div>
        <ol style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.8, opacity: 0.75 }}>
          <li>Se conecta a tu WooCommerce y descarga todos los productos publicados.</li>
          <li>Mapea nombre, descripción, SKU, categorías, marca e imagen automáticamente.</li>
          <li>Si un producto ya existía, lo <strong>actualiza</strong>. Si es nuevo, lo <strong>crea</strong>.</li>
          <li>Los productos manuales que tengan el mismo SKU también se actualizan.</li>
          <li>El chatbot usa el catálogo actualizado en tiempo real para responder consultas.</li>
        </ol>
      </div>
    </div>
  );
}
