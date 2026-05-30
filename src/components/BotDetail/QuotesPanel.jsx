import React, { useState, useEffect } from 'react';
import { message, Spin } from 'antd';
import Chatbot from '../../services/Chatbot.js';

const FIELD_TYPES = [
  { value: 'text', label: 'Texto' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Teléfono' },
  { value: 'number', label: 'Número' },
  { value: 'date', label: 'Fecha' },
  { value: 'textarea', label: 'Texto largo' },
  { value: 'select', label: 'Selección' },
];

const QuotesPanel = ({ workspaceId, botId, bot }) => {
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

    </>
  );
};

export default QuotesPanel;
