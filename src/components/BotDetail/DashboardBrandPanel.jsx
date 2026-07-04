import React, { useState, useEffect } from 'react';
import { message, Spin } from 'antd';
import Chatbot from '../../services/Chatbot.js';

/**
 * DashboardBrandPanel — marca blanca del DASHBOARD del cliente final.
 * Solo se muestra en planes "manager" (Empresa). El manager define, por cada
 * bot/cliente: si está activa, el nombre, el color de acento y el logo del panel.
 * Si no está activa, el cliente ve el panel con la marca Øpia por defecto.
 */
const DashboardBrandPanel = ({ workspaceId, botId }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [brand, setBrand] = useState({ enabled: false, name: '', color: '#534AB7', logo: '' });

  useEffect(() => {
    let active = true;
    Chatbot.getById(workspaceId, botId)
      .then((res) => {
        const b = res?.data?.dashboardBrand || res?.data?.data?.dashboardBrand;
        if (active && b) setBrand({ enabled: !!b.enabled, name: b.name || '', color: b.color || '#534AB7', logo: b.logo || '' });
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [workspaceId, botId]);

  const set = (k, v) => setBrand(prev => ({ ...prev, [k]: v }));

  const handleLogo = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) { message.error('Debe ser una imagen'); return; }
    try {
      setUploading(true);
      const res = await Chatbot.uploadLogo(botId, file);
      if (res?.success && res.data?.url) set('logo', res.data.url);
      else message.error(res?.message || 'No se pudo subir el logo');
    } catch (err) { message.error('Error al subir el logo'); }
    finally { setUploading(false); }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await Chatbot.update(workspaceId, botId, { dashboardBrand: brand });
      message.success('Marca del panel guardada');
    } catch (err) { message.error('Error al guardar'); }
    finally { setSaving(false); }
  };

  if (loading) return <Spin />;

  return (
    <div className="card" style={{ marginBottom: 24, border: '1px solid var(--rule)', borderRadius: 12, padding: '1.25rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div className="form-card-title" style={{ margin: 0 }}>Marca del panel del cliente</div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
          <input type="checkbox" checked={brand.enabled} onChange={(e) => set('enabled', e.target.checked)} />
          Activar
        </label>
      </div>
      <p style={{ fontSize: 12, opacity: 0.6, marginBottom: 16 }}>
        Cuando está activa, el cliente final ve su dashboard con esta marca (sin Øpia). Si está desactivada, ve la marca Øpia.
      </p>

      <div style={{ opacity: brand.enabled ? 1 : 0.45, pointerEvents: brand.enabled ? 'auto' : 'none' }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Logo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ width: 80, height: 80, borderRadius: 14, border: '1px solid var(--rule)', background: '#f7f7f7', display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
              {brand.logo ? <img src={brand.logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 26, opacity: 0.35 }}>🖼️</span>}
            </div>
            <label className="btn btn-ghost" style={{ cursor: uploading ? 'wait' : 'pointer', margin: 0, fontSize: 12 }}>
              {uploading ? 'Subiendo…' : (brand.logo ? 'Cambiar logo' : 'Subir logo')}
              <input type="file" accept="image/*" onChange={handleLogo} disabled={uploading} style={{ display: 'none' }} />
            </label>
          </div>

          {/* Nombre + color */}
          <div style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Nombre a mostrar</label>
              <input type="text" className="input" value={brand.name} placeholder="Nombre de la marca del cliente" onChange={(e) => set('name', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Color de acento del panel</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="color" value={brand.color || '#534AB7'} onChange={(e) => set('color', e.target.value)} style={{ width: 44, height: 36, border: '1px solid var(--rule)', borderRadius: 8, cursor: 'pointer', background: 'none' }} />
                <input type="text" className="input" value={brand.color} placeholder="#534AB7" onChange={(e) => set('color', e.target.value)} style={{ maxWidth: 140 }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ marginTop: 16 }}>
        {saving ? 'Guardando…' : 'Guardar marca del panel'}
      </button>
    </div>
  );
};

export default DashboardBrandPanel;
