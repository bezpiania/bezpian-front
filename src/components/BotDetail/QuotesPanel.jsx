import React, { useState, useEffect } from 'react';
import { message, Spin } from 'antd';
import Chatbot from '../../services/Chatbot.js';
import api from '../../apis/app.js';
import { getBusinessType } from '../../config/businessTypes.js';

const FIELD_TYPES = [
  { value: 'text', label: 'Texto' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Teléfono' },
  { value: 'number', label: 'Número' },
  { value: 'date', label: 'Fecha' },
  { value: 'textarea', label: 'Texto largo' },
  { value: 'select', label: 'Selección' },
];

// ── Quote config by business type ───────────────────────────────────────────
const QuoteBusinessConfig = ({ workspaceId, botId, bot, qFeatures, businessType }) => {
  const [saving, setSaving] = useState(false);
  const [cfg, setCfg] = useState({
    enabled:           bot?.quoteConfig?.enabled           ?? false,
    validDays:         bot?.quoteConfig?.validDays         ?? 30,
    paymentTerms:      bot?.quoteConfig?.paymentTerms      ?? '',
    taxIncluded:       bot?.quoteConfig?.taxIncluded       ?? true,
    taxRate:           bot?.quoteConfig?.taxRate           ?? 0,
    termsText:         bot?.quoteConfig?.termsText         ?? '',
    sessionCount:      bot?.quoteConfig?.sessionCount      ?? 1,
    insuranceCoverage: bot?.quoteConfig?.insuranceCoverage ?? '',
    autoQuoteMinQty:   bot?.quoteConfig?.autoQuoteMinQty   ?? 10,
    volumeDiscounts:   bot?.quoteConfig?.volumeDiscounts   ?? [],
  });

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.patch(`/api/workspaces/${workspaceId}/chatbots/${botId}`, { $set: { quoteConfig: cfg } });
      message.success('Configuración de cotizaciones guardada');
    } catch { message.error('Error al guardar'); }
    finally { setSaving(false); }
  };

  const inStyle = { width: '100%', padding: '9px 12px', border: '1px solid var(--rule)', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 13, background: 'var(--bone)', boxSizing: 'border-box' };

  return (
    <div style={{ marginTop: 32 }}>
      <div className="section-head">
        <div>
          <div className="section-num">Opciones de cotización</div>
          <div className="section-title">Configura <em>condiciones comerciales</em></div>
        </div>
      </div>
      <div className="grid-2-eq" style={{ marginTop: 16 }}>
        {qFeatures.expiry && (
          <div className="card">
            <div className="section-num" style={{ marginBottom: 12 }}>Validez y condiciones</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="field">
                <label className="field-label">Validez (días)</label>
                <input style={inStyle} type="number" min={1} value={cfg.validDays} onChange={e => setCfg(p => ({ ...p, validDays: parseInt(e.target.value) || 30 }))} />
              </div>
              {qFeatures.paymentTerms && (
                <div className="field">
                  <label className="field-label">Términos de pago</label>
                  <select style={inStyle} value={cfg.paymentTerms} onChange={e => setCfg(p => ({ ...p, paymentTerms: e.target.value }))}>
                    <option value="">Sin especificar</option>
                    <option value="Contado">Contado</option>
                    <option value="30 días">30 días</option>
                    <option value="60 días">60 días</option>
                    <option value="50% adelanto">50% adelanto + saldo entrega</option>
                    <option value="Personalizado">Personalizado</option>
                  </select>
                </div>
              )}
              {qFeatures.termsText && (
                <div className="field">
                  <label className="field-label">Términos y condiciones</label>
                  <textarea style={{ ...inStyle, resize: 'vertical', minHeight: 60 }} value={cfg.termsText} onChange={e => setCfg(p => ({ ...p, termsText: e.target.value }))} placeholder="Precios sujetos a variación, tiempo de entrega 5-7 días hábiles..." />
                </div>
              )}
            </div>
          </div>
        )}
        {qFeatures.taxConfig && (
          <div className="card">
            <div className="section-num" style={{ marginBottom: 12 }}>Impuestos</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                <input type="checkbox" checked={cfg.taxIncluded} onChange={() => setCfg(p => ({ ...p, taxIncluded: !p.taxIncluded }))} />
                Precio incluye impuesto (IVA)
              </label>
              {!cfg.taxIncluded && (
                <div className="field">
                  <label className="field-label">Tasa de impuesto (%)</label>
                  <input style={inStyle} type="number" min={0} max={100} value={cfg.taxRate} onChange={e => setCfg(p => ({ ...p, taxRate: parseFloat(e.target.value) || 0 }))} placeholder="19" />
                </div>
              )}
            </div>
          </div>
        )}
        {qFeatures.sessionBreakdown && (
          <div className="card">
            <div className="section-num" style={{ marginBottom: 12 }}>Configuración clínica</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="field">
                <label className="field-label">Nº de sesiones por defecto</label>
                <input style={inStyle} type="number" min={1} value={cfg.sessionCount} onChange={e => setCfg(p => ({ ...p, sessionCount: parseInt(e.target.value) || 1 }))} />
              </div>
              {qFeatures.insuranceCoverage && (
                <div className="field">
                  <label className="field-label">Cobertura de seguro</label>
                  <input style={inStyle} value={cfg.insuranceCoverage} onChange={e => setCfg(p => ({ ...p, insuranceCoverage: e.target.value }))} placeholder="Fonasa, Isapre, Particular" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Store-only: auto-quote + volume discounts */}
      {businessType === 'store' && (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="section-num" style={{ marginBottom: 14 }}>Cotización automática por volumen</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 10 }}>
                <input type="checkbox" checked={cfg.enabled} onChange={() => setCfg(p => ({ ...p, enabled: !p.enabled }))} />
                <span style={{ fontWeight: 600, fontSize: 13 }}>Activar cotizaciones automáticas</span>
              </label>
              {cfg.enabled && (
                <div className="field">
                  <label className="field-label">Ofrecer cotización cuando la cantidad supere</label>
                  <input className="input" type="number" min={1} value={cfg.autoQuoteMinQty}
                    onChange={e => setCfg(p => ({ ...p, autoQuoteMinQty: parseInt(e.target.value) || 10 }))} />
                  <small style={{ opacity: 0.55, marginTop: 4, display: 'block' }}>unidades de un mismo producto</small>
                </div>
              )}
            </div>
          </div>
          {cfg.enabled && (
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.6, marginBottom: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Descuentos por volumen</div>
              {cfg.volumeDiscounts.map((tier, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, opacity: 0.6, whiteSpace: 'nowrap' }}>Desde</span>
                  <input className="input" type="number" min={1} value={tier.minQty} style={{ width: 80 }}
                    onChange={e => { const d = [...cfg.volumeDiscounts]; d[i] = { ...d[i], minQty: parseInt(e.target.value)||1 }; setCfg(p => ({ ...p, volumeDiscounts: d })); }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, opacity: 0.6, whiteSpace: 'nowrap' }}>uds →</span>
                  <input className="input" type="number" min={0} max={100} value={tier.discountPct} style={{ width: 80 }}
                    onChange={e => { const d = [...cfg.volumeDiscounts]; d[i] = { ...d[i], discountPct: parseFloat(e.target.value)||0 }; setCfg(p => ({ ...p, volumeDiscounts: d })); }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, opacity: 0.6 }}>% descuento</span>
                  <button onClick={() => setCfg(p => ({ ...p, volumeDiscounts: p.volumeDiscounts.filter((_, j) => j !== i) }))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--magma)', fontSize: 16 }}>×</button>
                </div>
              ))}
              <button className="btn btn-secondary btn-sm" onClick={() => setCfg(p => ({ ...p, volumeDiscounts: [...p.volumeDiscounts, { minQty: 10, discountPct: 10 }] }))}>
                + Agregar tier
              </button>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar opciones'}
        </button>
      </div>
    </div>
  );
};

const QuotesPanel = ({ workspaceId, botId, bot }) => {
  const bizConfig  = getBusinessType(bot?.businessType);
  const qFeatures  = bizConfig.quotes?.features || {};
  const [saving, setSaving] = useState(false);
  const [quoteFields, setQuoteFields] = useState(bot?.quoteFields || []);
  const [editingField, setEditingField] = useState(null);
  const [newFieldModal, setNewFieldModal] = useState(false);

  useEffect(() => {
    if (bot?.quoteFields) {
      setQuoteFields(bot.quoteFields);
    }
  }, [bot]);

  const addField = () => {
    const newField = {
      fieldId: `field_${Date.now()}`,
      label: '',
      fieldType: 'text',
      required: false,
      placeholder: '',
      options: [],
      order: quoteFields.length,
      helpText: ''
    };
    setEditingField(newField);
    setNewFieldModal(true);
  };

  const saveField = async () => {
    if (!editingField.label) {
      message.error('El nombre del campo es requerido');
      return;
    }

    if (editingField.fieldType === 'select' && editingField.options.length === 0) {
      message.error('Debes agregar al menos una opción para campos de selección');
      return;
    }

    const existingIndex = quoteFields.findIndex(f => f.fieldId === editingField.fieldId);
    let updatedFields;

    if (existingIndex >= 0) {
      updatedFields = [...quoteFields];
      updatedFields[existingIndex] = editingField;
    } else {
      updatedFields = [...quoteFields, editingField];
    }

    try {
      setSaving(true);
      await Chatbot.update(workspaceId, botId, { quoteFields: updatedFields });
      setQuoteFields(updatedFields);
      message.success('Campo guardado exitosamente');
      setNewFieldModal(false);
      setEditingField(null);
    } catch (error) {
      message.error('Error al guardar el campo');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const deleteField = async (fieldId) => {
    try {
      setSaving(true);
      const updatedFields = quoteFields.filter(f => f.fieldId !== fieldId);
      await Chatbot.update(workspaceId, botId, { quoteFields: updatedFields });
      setQuoteFields(updatedFields);
      message.success('Campo eliminado');
    } catch (error) {
      message.error('Error al eliminar el campo');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };



  return (
    <>
      <div className="section-head">
        <div>
          <div className="section-num">Cotizaciones</div>
          <div className="section-title">Define qué datos pedirle al cliente <em>para generar cotizaciones</em></div>
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={addField}
          disabled={saving}
        >
          + Agregar Campo
        </button>
      </div>

      <Spin spinning={saving}>
        {quoteFields.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, marginBottom: 8 }}>
              Sin campos configurados
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', opacity: 0.6, marginBottom: 16 }}>
              Agrega los campos que deseas solicitar cuando el cliente solicite una cotización.
            </div>
            <button className="btn btn-voltage" onClick={addField}>
              Agregar primer campo
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
            {quoteFields.map((field) => (
              <div
                key={field.fieldId}
                style={{
                  background: 'var(--bone)',
                  border: '1px solid var(--rule)',
                  borderRadius: 11,
                  padding: '18px',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto auto',
                  gap: 12,
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                    {field.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, opacity: 0.6 }}>
                    {FIELD_TYPES.find(t => t.value === field.fieldType)?.label} {field.required && '(requerido)'}
                    {field.helpText && ` · ${field.helpText}`}
                  </div>
                </div>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setEditingField(field);
                    setNewFieldModal(true);
                  }}
                >
                  Editar
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => deleteField(field.fieldId)}
                  style={{ color: 'var(--magma)' }}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </Spin>

      {/* Modal para editar/crear campo */}
      {newFieldModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: 12,
            padding: 24,
            maxWidth: 500,
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{ margin: 0, marginBottom: 20, fontSize: 18, fontWeight: 600 }}>
              {editingField?.fieldId && quoteFields.some(f => f.fieldId === editingField.fieldId) ? 'Editar Campo' : 'Nuevo Campo'}
            </h3>

            {editingField && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 6 }}>
                    Nombre del campo *
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={editingField.label}
                    onChange={(e) => setEditingField({ ...editingField, label: e.target.value })}
                    placeholder="Ej: Nombre del cliente"
                  />
                </div>

                <div>
                  <label style={{ fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 6 }}>
                    Tipo de campo
                  </label>
                  <select
                    className="select"
                    value={editingField.fieldType}
                    onChange={(e) => setEditingField({ ...editingField, fieldType: e.target.value, options: [] })}
                  >
                    {FIELD_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 6 }}>
                    Placeholder (ayuda de ejemplo)
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={editingField.placeholder}
                    onChange={(e) => setEditingField({ ...editingField, placeholder: e.target.value })}
                    placeholder="Ej: Juan Pérez"
                  />
                </div>

                <div>
                  <label style={{ fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 6 }}>
                    Texto de ayuda (opcional)
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={editingField.helpText}
                    onChange={(e) => setEditingField({ ...editingField, helpText: e.target.value })}
                    placeholder="Información adicional para el usuario"
                  />
                </div>

                {editingField.fieldType === 'select' && (
                  <div>
                    <label style={{ fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 6 }}>
                      Opciones (una por línea) *
                    </label>
                    <textarea
                      className="input"
                      value={editingField.options.join('\n')}
                      onChange={(e) => setEditingField({
                        ...editingField,
                        options: e.target.value.split('\n').filter(Boolean)
                      })}
                      placeholder="Opción 1&#10;Opción 2&#10;Opción 3"
                      style={{ minHeight: 100, fontFamily: 'monospace' }}
                    />
                  </div>
                )}

                <label style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={editingField.required}
                    onChange={(e) => setEditingField({ ...editingField, required: e.target.checked })}
                  />
                  <span style={{ fontWeight: 500 }}>Campo requerido</span>
                </label>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setNewFieldModal(false);
                      setEditingField(null);
                    }}
                    disabled={saving}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={saveField}
                    disabled={saving}
                  >
                    {saving ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Business-type specific quote config */}
      {(qFeatures.expiry || qFeatures.paymentTerms || qFeatures.taxConfig || qFeatures.sessionBreakdown) && (
        <QuoteBusinessConfig workspaceId={workspaceId} botId={botId} bot={bot} qFeatures={qFeatures} businessType={bot?.businessType} />
      )}

    </>
  );
};

export default QuotesPanel;
