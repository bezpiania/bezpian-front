import React, { useState, useEffect } from 'react';
import { message, Spin } from 'antd';
import Chatbot from '../../services/Chatbot.js';
import '../../styles/company-instructions.css';

const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const dayLabels = { monday: 'Lunes', tuesday: 'Martes', wednesday: 'Miércoles', thursday: 'Jueves', friday: 'Viernes', saturday: 'Sábado', sunday: 'Domingo' };

const CompanyInfoForm = ({ workspaceId, botId }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    company: { name: '', address: '', city: '', country: '', phone: '', email: '', website: '' },
    hours: dayNames.map(day => ({ day, open: '09:00', close: '18:00', isClosed: ['saturday', 'sunday'].includes(day) })),
    hoursDisplay: dayNames,
    dispatches: { available: true, specialCases: '' },
    payments: { creditCard: true, transfer: true, paypal: true, cash: true, webpay: false, flow: false, mercadopago: false, maquinaPos: false },
    social: { instagram: '', whatsapp: '', facebook: '', tiktok: '', linkedin: '', youtube: '', twitter: '', telegram: '', wechat: '', viber: '', line: '', messenger: '' }
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await Chatbot.getConfig(workspaceId, botId);
      if (response.data?.data?.company) {
        setForm(prev => ({ ...prev, ...response.data.data.company }));
      }
    } catch (error) {
      console.error('Error fetching config:', error);
    } finally {
      setLoading(false);
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

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await Chatbot.saveConfig(workspaceId, botId, { company: form });
      if (response?.success) {
        message.success('Información de empresa guardada');
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

      {/* HORARIOS */}
      <div className="card">
        <div className="form-card-title">Horarios de Atención</div>
        <div className="form-card-section">
          {form.hoursDisplay.map((dayName) => {
            const dayData = form.hours.find(h => h.day === dayName);
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
                      const newHours = form.hours.map(h => h.day === dayName ? { ...h, open: e.target.value } : h);
                      setForm(prev => ({ ...prev, hours: newHours }));
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
                      const newHours = form.hours.map(h => h.day === dayName ? { ...h, close: e.target.value } : h);
                      setForm(prev => ({ ...prev, hours: newHours }));
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
                        const newHours = form.hours.map(h => h.day === dayName ? { ...h, isClosed: !h.isClosed } : h);
                        setForm(prev => ({ ...prev, hours: newHours }));
                      }}
                    />
                    <span className="form-checkbox-label">Cerrado</span>
                  </label>
                  {form.hoursDisplay.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setForm(prev => ({
                          ...prev,
                          hoursDisplay: prev.hoursDisplay.filter(d => d !== dayName)
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
        {form.hoursDisplay.length < dayNames.length && (
          <div style={{ marginTop: '12px' }}>
            <select
              onChange={(e) => {
                if (e.target.value && !form.hoursDisplay.includes(e.target.value)) {
                  setForm(prev => ({
                    ...prev,
                    hoursDisplay: [...prev.hoursDisplay, e.target.value]
                  }));
                }
                e.target.value = '';
              }}
              className="input input--select"
              style={{ width: '100%' }}
            >
              <option value="">Agregar día...</option>
              {dayNames.map(d => !form.hoursDisplay.includes(d) && <option key={d} value={d}>{dayLabels[d]}</option>)}
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
