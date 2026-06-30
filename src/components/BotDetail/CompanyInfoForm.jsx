import React, { useState, useEffect } from 'react';
import { message, Spin } from 'antd';
import Chatbot from '../../services/Chatbot.js';
import '../../styles/company-instructions.css';

const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const dayLabels = { monday: 'Lunes', tuesday: 'Martes', wednesday: 'Miércoles', thursday: 'Jueves', friday: 'Viernes', saturday: 'Sábado', sunday: 'Domingo' };

// Normalize day key — accepts Spanish or English, returns English key
const ES_TO_EN = { lunes:'monday', martes:'tuesday', miércoles:'wednesday', miercoles:'wednesday', jueves:'thursday', viernes:'friday', sábado:'saturday', sabado:'saturday', domingo:'sunday' };
const normDay = (d) => {
  if (!d) return d;
  const lower = d.toLowerCase();
  return ES_TO_EN[lower] || lower; // already english or unknown → pass through
};

// Normalize an operationHours array so all .day values are English keys
const normalizeHours = (hours = []) =>
  hours.map(h => ({ ...h, day: normDay(h.day) }));

// Normalize operationHoursDisplay (array of day strings)
const normalizeDisplay = (display = []) =>
  display.map(d => normDay(d));

const CompanyInfoForm = ({ workspaceId, botId }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [form, setForm] = useState({
    company: { name: '', address: '', city: '', country: '', phone: '', email: '', website: '', logo: '' },
    operationHours: dayNames.map(day => ({ day, open: '09:00', close: '18:00', isClosed: ['saturday', 'sunday'].includes(day) })),
    operationHoursDisplay: dayNames,
    dispatches: { available: true, specialCases: '' },
    payments: { creditCard: true, transfer: true, paypal: true, cash: true, webpay: false, flow: false, mercadopago: false, maquinaPos: false },
    social: { instagram: '', whatsapp: '', facebook: '', tiktok: '', linkedin: '', youtube: '', twitter: '', telegram: '', wechat: '', viber: '', line: '', messenger: '' },
    additionalInfo: [] // Información adicional: pares pregunta-respuesta
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await Chatbot.getConfig(workspaceId, botId);
      if (response?.data?.company) {
        const companyData = response.data.company;
        setForm({
          company: companyData.company || {},
          operationHours: (() => {
            if (!companyData.operationHours?.length) return dayNames.map(day => ({ day, open: '09:00', close: '18:00', isClosed: ['saturday', 'sunday'].includes(day) }));
            const normalized = normalizeHours(companyData.operationHours);
            // Ensure all 7 days exist (fill missing with defaults)
            const existing = new Set(normalized.map(h => h.day));
            const missing = dayNames.filter(d => !existing.has(d)).map(d => ({ day: d, open: '09:00', close: '18:00', isClosed: ['saturday','sunday'].includes(d) }));
            return [...normalized, ...missing];
          })(),
          operationHoursDisplay: (() => {
            if (!companyData.operationHours?.length) return dayNames;
            // Rebuild display from the actual day keys (normalized), in week order
            const normalized = normalizeHours(companyData.operationHours);
            const keys = new Set(normalized.map(h => h.day));
            return dayNames.filter(d => keys.has(d));
          })(),
          dispatches: companyData.dispatches || {},
          payments: companyData.payments || {},
          social: companyData.social || {},
          additionalInfo: companyData.additionalInfo || []
        });
      }
    } catch (error) {
      console.error('Error fetching config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // permite re-subir el mismo archivo
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      message.error('El logo debe ser una imagen (PNG, JPG, WEBP o SVG)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      message.error('La imagen no debe superar 5 MB');
      return;
    }
    try {
      setUploadingLogo(true);
      const res = await Chatbot.uploadLogo(botId, file);
      if (res?.success && res.data?.url) {
        setForm(prev => ({ ...prev, company: { ...prev.company, logo: res.data.url } }));
        message.success('Logo subido. No olvides guardar.');
      } else {
        message.error(res?.message || 'No se pudo subir el logo');
      }
    } catch (error) {
      message.error('Error al subir el logo: ' + (error?.message || ''));
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setForm(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleCheckboxChange = (section, field) => {
    setForm(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: !prev[section][field] }
    }));
  };

  const addAdditionalInfo = () => {
    setForm(prev => ({
      ...prev,
      additionalInfo: [...prev.additionalInfo, { question: '', answer: '' }]
    }));
  };

  const updateAdditionalInfo = (index, field, value) => {
    setForm(prev => ({
      ...prev,
      additionalInfo: prev.additionalInfo.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeAdditionalInfo = (index) => {
    setForm(prev => ({
      ...prev,
      additionalInfo: prev.additionalInfo.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await Chatbot.saveConfig(workspaceId, botId, {
        company: {
          ...form,
          additionalInfo: form.additionalInfo.filter(item => item.question && item.answer) // Solo guardar pares completos
        }
      });
      if (response?.success) {
        message.success('Información de empresa guardada');
        // Refrescar los datos después de guardar
        await fetchConfig();
      } else {
        message.error(response?.message || 'Error al guardar');
      }
    } catch (error) {
      message.error('Error al guardar: ' + (error?.message || ''));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spin />;

  return (
    <div className="form-section">
      {/* SECTION HEADER */}
      <div className="section-head">
        <div>
          <div className="section-num">Información de Empresa</div>
          <div className="section-title">Datos y configuración de tu <em>negocio</em></div>
        </div>
      </div>

      {/* LOGO */}
      <div className="card">
        <div className="form-card-title">Logo del Asistente</div>
        <p style={{ fontSize: 12, opacity: 0.6, marginBottom: 16 }}>
          Imagen cuadrada (se ajustará automáticamente a 500×500 px). PNG, JPG, WEBP o SVG, máx. 5 MB.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{
            width: 96, height: 96, borderRadius: 16, border: '1px solid #e0e0e0',
            background: '#f7f7f7', display: 'grid', placeItems: 'center', overflow: 'hidden', flexShrink: 0
          }}>
            {form.company.logo
              ? <img src={form.company.logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: 30, opacity: 0.35 }}>🖼️</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label className="btn btn-ghost" style={{ cursor: uploadingLogo ? 'wait' : 'pointer', margin: 0 }}>
              {uploadingLogo ? 'Subiendo…' : (form.company.logo ? 'Cambiar logo' : 'Subir logo')}
              <input type="file" accept="image/*" onChange={handleLogoChange} disabled={uploadingLogo} style={{ display: 'none' }} />
            </label>
            {form.company.logo && (
              <button
                type="button"
                onClick={() => setForm(prev => ({ ...prev, company: { ...prev.company, logo: '' } }))}
                className="btn btn-ghost"
                style={{ color: '#ff4444', padding: '4px 8px', fontSize: 12 }}
              >
                Quitar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* DATOS BÁSICOS */}
      <div className="card">
        <div className="form-card-title">Datos Básicos</div>
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label form-label--required">Nombre de la Empresa</label>
            <input
              type="text"
              value={form.company.name}
              onChange={(e) => handleInputChange('company', 'name', e.target.value)}
              placeholder="Nombre de tu negocio"
              className="input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Teléfono</label>
            <input
              type="text"
              value={form.company.phone}
              onChange={(e) => handleInputChange('company', 'phone', e.target.value)}
              placeholder="+1 (555) 1234-5678"
              className="input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Dirección</label>
            <input
              type="text"
              value={form.company.address}
              onChange={(e) => handleInputChange('company', 'address', e.target.value)}
              placeholder="Calle y número"
              className="input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={form.company.email}
              onChange={(e) => handleInputChange('company', 'email', e.target.value)}
              placeholder="contacto@empresa.com"
              className="input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Ciudad</label>
            <input
              type="text"
              value={form.company.city}
              onChange={(e) => handleInputChange('company', 'city', e.target.value)}
              placeholder="Ej: Buenos Aires"
              className="input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">País / Región</label>
            <input
              type="text"
              value={form.company.country}
              onChange={(e) => handleInputChange('company', 'country', e.target.value)}
              placeholder="Ej: Argentina"
              className="input"
            />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Sitio Web</label>
            <input
              type="url"
              value={form.company.website}
              onChange={(e) => handleInputChange('company', 'website', e.target.value)}
              placeholder="https://www.ejemplo.com"
              className="input"
            />
          </div>
        </div>
      </div>

      {/* HORARIOS DE OPERACIÓN */}
      <div className="card">
        <div className="form-card-title">Horarios de Operación</div>
        <p style={{ fontSize: 12, opacity: 0.6, marginBottom: 12 }}>
          Cuándo está abierto tu negocio. Nota: Los horarios para agendar citas se configuran en la pestaña "Agendamiento"
        </p>
        <div className="form-card-section">
          {form.operationHoursDisplay.map((dayName) => {
            const dayData = form.operationHours.find(h => h.day === dayName);
            if (!dayData) return null;
            return (
              <div key={dayName} style={{ display: 'grid', gridTemplateColumns: '120px 100px 100px 1fr', gap: '12px', alignItems: 'end', paddingBottom: '12px', borderBottom: '1px solid #eee' }}>
                <div className="form-group">
                  <label className="form-label">{dayLabels[dayName]}</label>
                </div>
                <div className="form-group">
                  <label className="form-label">Apertura</label>
                  <input
                    type="time"
                    value={dayData.open}
                    disabled={dayData.isClosed}
                    onChange={(e) => {
                      const newHours = form.operationHours.map(h => h.day === dayName ? { ...h, open: e.target.value } : h);
                      setForm(prev => ({ ...prev, operationHours: newHours }));
                    }}
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Cierre</label>
                  <input
                    type="time"
                    value={dayData.close}
                    disabled={dayData.isClosed}
                    onChange={(e) => {
                      const newHours = form.operationHours.map(h => h.day === dayName ? { ...h, close: e.target.value } : h);
                      setForm(prev => ({ ...prev, operationHours: newHours }));
                    }}
                    className="input"
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <label className="form-checkbox">
                    <input
                      type="checkbox"
                      checked={dayData.isClosed}
                      onChange={() => {
                        const newHours = form.operationHours.map(h => h.day === dayName ? { ...h, isClosed: !h.isClosed } : h);
                        setForm(prev => ({ ...prev, operationHours: newHours }));
                      }}
                    />
                    <span className="form-checkbox-label">Cerrado</span>
                  </label>
                  {form.operationHoursDisplay.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setForm(prev => ({
                          ...prev,
                          operationHoursDisplay: prev.operationHoursDisplay.filter(d => d !== dayName)
                        }));
                      }}
                      className="btn btn-ghost"
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                    >
                      Remover
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {form.operationHoursDisplay.length < dayNames.length && (
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
            <select
              onChange={(e) => {
                const selectedDay = e.target.value;
                if (selectedDay && !form.operationHoursDisplay.includes(selectedDay)) {
                  setForm(prev => ({
                    ...prev,
                    operationHoursDisplay: [...prev.operationHoursDisplay, selectedDay],
                    operationHours: [...prev.operationHours, {
                      day: selectedDay,
                      open: '09:00',
                      close: '18:00',
                      isClosed: false
                    }]
                  }));
                }
                e.target.value = '';
              }}
              className="input input--select"
              style={{ flex: 1 }}
            >
              <option value="">Agregar día...</option>
              {dayNames.map(d => !form.operationHoursDisplay.includes(d) && <option key={d} value={d}>{dayLabels[d]}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* DESPACHOS */}
      <div className="card">
        <div className="form-card-title">Despachos y Entregas</div>
        <div className="form-group">
          <label className="form-label">¿Realizas despachos/entregas?</label>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <label className="form-checkbox">
              <input
                type="radio"
                name="dispatch-available"
                checked={form.dispatches.available === true}
                onChange={() => setForm(prev => ({ ...prev, dispatches: { ...prev.dispatches, available: true } }))}
              />
              <span className="form-checkbox-label">Sí</span>
            </label>
            <label className="form-checkbox">
              <input
                type="radio"
                name="dispatch-available"
                checked={form.dispatches.available === false}
                onChange={() => setForm(prev => ({ ...prev, dispatches: { ...prev.dispatches, available: false } }))}
              />
              <span className="form-checkbox-label">No</span>
            </label>
          </div>
        </div>
        {form.dispatches.available && (
          <div className="form-group">
            <label className="form-label">Casos Especiales o Restricciones</label>
            <textarea
              placeholder="Ej: Solo RM. No hacemos entregas a islas. Entregamos de lunes a viernes."
              value={form.dispatches.specialCases}
              onChange={(e) => setForm(prev => ({ ...prev, dispatches: { ...prev.dispatches, specialCases: e.target.value } }))}
              className="input input--medium"
            />
          </div>
        )}
      </div>

      {/* PAGOS */}
      <div className="card">
        <div className="form-card-title">Formas de Pago Disponibles</div>
        <div className="form-card-section">
          {[
            { key: 'creditCard', label: 'Tarjeta de Crédito' },
            { key: 'transfer', label: 'Transferencia Bancaria' },
            { key: 'paypal', label: 'PayPal' },
            { key: 'cash', label: 'Efectivo contra Entrega' },
            { key: 'webpay', label: 'Webpay' },
            { key: 'flow', label: 'Flow' },
            { key: 'mercadopago', label: 'Mercado Pago' },
            { key: 'maquinaPos', label: 'Máquina POS' }
          ].map(item => (
            <label key={item.key} className="form-checkbox">
              <input
                type="checkbox"
                checked={form.payments[item.key]}
                onChange={() => handleCheckboxChange('payments', item.key)}
              />
              <span className="form-checkbox-label">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* REDES SOCIALES */}
      <div className="card">
        <div className="form-card-title">Redes Sociales y Contacto</div>
        <div className="form-grid-2">
          {[
            { key: 'instagram', label: 'Instagram', placeholder: '@usuario' },
            { key: 'facebook', label: 'Facebook', placeholder: 'usuario' },
            { key: 'tiktok', label: 'TikTok', placeholder: '@usuario' },
            { key: 'youtube', label: 'YouTube', placeholder: '@canal' },
            { key: 'twitter', label: 'Twitter / X', placeholder: '@usuario' },
            { key: 'linkedin', label: 'LinkedIn', placeholder: 'empresa' },
            { key: 'whatsapp', label: 'WhatsApp', placeholder: '+1 (555) 1234-5678' },
            { key: 'telegram', label: 'Telegram', placeholder: '@usuario' },
            { key: 'wechat', label: 'WeChat', placeholder: 'ID usuario' },
            { key: 'viber', label: 'Viber', placeholder: '+1 (555) 1234-5678' },
            { key: 'line', label: 'LINE', placeholder: '@usuario' },
            { key: 'messenger', label: 'Messenger', placeholder: 'usuario' }
          ].map(item => (
            <div key={item.key} className="form-group">
              <label className="form-label">{item.label}</label>
              <input
                type="text"
                value={form.social[item.key]}
                onChange={(e) => handleInputChange('social', item.key, e.target.value)}
                placeholder={item.placeholder}
                className="input"
              />
            </div>
          ))}
        </div>
      </div>

      {/* INFORMACIÓN ADICIONAL */}
      <div className="card">
        <div className="form-card-title">Información Adicional para el Chat</div>
        <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 16 }}>
          Agrega pares de pregunta-respuesta que el chatbot usará para mejorar sus respuestas
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
          {form.additionalInfo.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                gap: 12,
                padding: 12,
                background: '#f9f9f9',
                border: '1px solid #e0e0e0',
                borderRadius: 8,
                alignItems: 'flex-start'
              }}
            >
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input
                  type="text"
                  placeholder="Pregunta (ej: ¿Envían a todo Chile?)"
                  value={item.question}
                  onChange={(e) => updateAdditionalInfo(index, 'question', e.target.value)}
                  className="input"
                  style={{ fontSize: 13 }}
                />
                <input
                  type="text"
                  placeholder="Respuesta (ej: Sí, enviamos a todo el país excepto zonas remotas)"
                  value={item.answer}
                  onChange={(e) => updateAdditionalInfo(index, 'answer', e.target.value)}
                  className="input"
                  style={{ fontSize: 13 }}
                />
              </div>
              <button
                onClick={() => removeAdditionalInfo(index)}
                style={{
                  padding: '8px 12px',
                  background: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                  marginTop: 2
                }}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addAdditionalInfo}
          style={{
            padding: '10px 16px',
            background: '#f0f0f0',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            transition: 'all 0.2s'
          }}
        >
          + Agregar Información
        </button>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="btn btn-primary"
      >
        {saving ? 'Guardando...' : 'Guardar Información'}
      </button>
    </div>
  );
};

export default CompanyInfoForm;
