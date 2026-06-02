import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import api from '../../apis/app.js';

const SalesPanel = ({ workspaceId, botId, bot }) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [showAddZone, setShowAddZone] = useState(false);
  const [newZone, setNewZone] = useState('');

  const [config, setConfig] = useState({
    enabled:          bot?.deliveryConfig?.enabled          ?? false,
    zones:            bot?.deliveryConfig?.zones            ?? [],
    deliveryCost:     bot?.deliveryConfig?.deliveryCost     ?? 0,
    estimatedMinutes: bot?.deliveryConfig?.estimatedMinutes ?? 45,
    minimumOrder:     bot?.deliveryConfig?.minimumOrder     ?? 0,
  });

  useEffect(() => {
    if (bot?.deliveryConfig) {
      setConfig({
        enabled:          bot.deliveryConfig.enabled          ?? false,
        zones:            bot.deliveryConfig.zones            ?? [],
        deliveryCost:     bot.deliveryConfig.deliveryCost     ?? 0,
        estimatedMinutes: bot.deliveryConfig.estimatedMinutes ?? 45,
        minimumOrder:     bot.deliveryConfig.minimumOrder     ?? 0,
      });
    }
  }, [bot]);

  const set = (key, val) => setConfig(prev => ({ ...prev, [key]: val }));

  const addZone = () => {
    if (!newZone.trim()) return;
    if (config.zones.includes(newZone.trim())) return;
    set('zones', [...config.zones, newZone.trim()]);
    setNewZone('');
    setShowAddZone(false);
  };

  const removeZone = (zone) => set('zones', config.zones.filter(z => z !== zone));

  const handleSave = async () => {
    try {
      setLoading(true);
      await api.patch(`/api/workspaces/${workspaceId}/chatbots/${botId}`, {
        $set: { deliveryConfig: config },
      });
      queryClient.invalidateQueries({ queryKey: ['chatbot', workspaceId, botId] });
      message.success('Configuración de ventas guardada');
    } catch {
      message.error('Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="section-head">
        <div>
          <div className="section-num">Ventas / Delivery</div>
          <div className="section-title">Configura el <em>servicio a domicilio</em></div>
        </div>
      </div>

      {/* Toggle */}
      <div className="card" style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className="section-num">Estado del delivery</div>
            <small style={{ opacity: 0.6 }}>
              {config.enabled ? 'El chatbot puede tomar pedidos a domicilio.' : 'El chatbot no tomará pedidos de delivery.'}
            </small>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={config.enabled}
              onChange={() => set('enabled', !config.enabled)}
              style={{ width: 18, height: 18 }} />
            <span style={{ fontWeight: 600 }}>{config.enabled ? 'Activado' : 'Desactivado'}</span>
          </label>
        </div>
      </div>

      {/* Config */}
      <div className="grid-2-eq" style={{ marginTop: 20 }}>
        <div className="card">
          <div className="section-num" style={{ marginBottom: 14 }}>Costos y tiempos</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="field">
              <label className="field-label">Costo de despacho</label>
              <input type="number" className="input" min={0} value={config.deliveryCost}
                onChange={e => set('deliveryCost', parseFloat(e.target.value) || 0)} />
              <small style={{ opacity: 0.55, marginTop: 4, display: 'block' }}>En la moneda local. 0 = despacho gratis.</small>
            </div>
            <div className="field">
              <label className="field-label">Tiempo estimado (minutos)</label>
              <input type="number" className="input" min={5} step={5} value={config.estimatedMinutes}
                onChange={e => set('estimatedMinutes', parseInt(e.target.value) || 45)} />
            </div>
            <div className="field">
              <label className="field-label">Pedido mínimo (opcional)</label>
              <input type="number" className="input" min={0} value={config.minimumOrder}
                onChange={e => set('minimumOrder', parseFloat(e.target.value) || 0)} />
              <small style={{ opacity: 0.55, marginTop: 4, display: 'block' }}>0 = sin mínimo.</small>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div className="section-num">Zonas de despacho</div>
            {!showAddZone && (
              <button className="btn btn-secondary btn-sm" onClick={() => setShowAddZone(true)}>+ Agregar</button>
            )}
          </div>

          {showAddZone && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input className="input" placeholder="Ej: Sopocachi, Calacoto..." value={newZone}
                onChange={e => setNewZone(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addZone()} />
              <button className="btn btn-primary btn-sm" onClick={addZone}>Agregar</button>
              <button className="btn btn-secondary btn-sm" onClick={() => { setShowAddZone(false); setNewZone(''); }}>✕</button>
            </div>
          )}

          {config.zones.length === 0 ? (
            <div style={{ padding: '20px 0', textAlign: 'center', opacity: 0.45, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
              Sin zonas — el chatbot despachará a cualquier dirección
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {config.zones.map(zone => (
                <span key={zone} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--ink)', color: 'var(--bone)', borderRadius: 6, padding: '5px 10px', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
                  {zone}
                  <button onClick={() => removeZone(zone)}
                    style={{ background: 'none', border: 'none', color: 'var(--bone)', cursor: 'pointer', padding: 0, lineHeight: 1, opacity: 0.7, fontSize: 14 }}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <small style={{ opacity: 0.5, marginTop: 12, display: 'block', fontSize: 11 }}>
            El chatbot informará estas zonas al cliente antes de tomar el pedido.
          </small>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
        <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar configuración'}
        </button>
      </div>
    </>
  );
};

export default SalesPanel;
