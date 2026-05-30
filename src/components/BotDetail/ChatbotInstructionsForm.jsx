import React, { useState, useEffect } from 'react';
import { message, Spin } from 'antd';
import Chatbot from '../../services/Chatbot.js';
import '../../styles/company-instructions.css';

const ChatbotInstructionsForm = ({ workspaceId, botId }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    mustDo: [],
    mustNotDo: []
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await Chatbot.getConfig(workspaceId, botId);
      if (response.data?.data?.instructions) {
        setForm(prev => ({ ...prev, ...response.data.data.instructions }));
      }
    } catch (error) {
      console.error('Error fetching config:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMustDoField = () => {
    setForm(prev => ({ ...prev, mustDo: [...prev.mustDo, ''] }));
  };

  const removeMustDoField = (index) => {
    setForm(prev => ({ ...prev, mustDo: prev.mustDo.filter((_, i) => i !== index) }));
  };

  const updateMustDoField = (index, value) => {
    setForm(prev => {
      const newMustDo = [...prev.mustDo];
      newMustDo[index] = value;
      return { ...prev, mustDo: newMustDo };
    });
  };

  const addMustNotDoField = () => {
    setForm(prev => ({ ...prev, mustNotDo: [...prev.mustNotDo, ''] }));
  };

  const removeMustNotDoField = (index) => {
    setForm(prev => ({ ...prev, mustNotDo: prev.mustNotDo.filter((_, i) => i !== index) }));
  };

  const updateMustNotDoField = (index, value) => {
    setForm(prev => {
      const newMustNotDo = [...prev.mustNotDo];
      newMustNotDo[index] = value;
      return { ...prev, mustNotDo: newMustNotDo };
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await Chatbot.saveConfig(workspaceId, botId, { instructions: form });
      if (response.data?.success) {
        message.success('Instrucciones guardadas');
      }
    } catch (error) {
      message.error('Error al guardar instrucciones');
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
          <div className="section-num">Instrucciones del Chatbot</div>
          <div className="section-title">Define lo que tu bot debe <em>hacer</em> y <em>evitar</em></div>
        </div>
      </div>

      {/* LO QUE SÍ DEBE HACER */}
      <div className="card">
        <div className="form-card-title">Lo que SÍ Debe Hacer</div>
        <div className="form-card-section">
          {form.mustDo.map((instruction, index) => (
            <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <textarea
                value={instruction}
                onChange={(e) => updateMustDoField(index, e.target.value)}
                placeholder="Ej: Siempre mencionar los horarios de atención"
                className="input input--medium"
                style={{ flex: 1, minHeight: '60px' }}
              />
              {form.mustDo.length > 0 && (
                <button
                  type="button"
                  onClick={() => removeMustDoField(index)}
                  className="btn btn-ghost"
                  style={{ padding: '8px 12px', height: '60px', alignSelf: 'center' }}
                >
                  Remover
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addMustDoField}
          className="btn btn-secondary"
          style={{ marginTop: '12px', width: '100%' }}
        >
          + Agregar Instrucción
        </button>
      </div>

      {/* LO QUE NO DEBE HACER */}
      <div className="card">
        <div className="form-card-title">Lo que NO Debe Hacer</div>
        <div className="form-card-section">
          {form.mustNotDo.map((restriction, index) => (
            <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <textarea
                value={restriction}
                onChange={(e) => updateMustNotDoField(index, e.target.value)}
                placeholder="Ej: Nunca inventar información sobre productos"
                className="input input--medium"
                style={{ flex: 1, minHeight: '60px' }}
              />
              {form.mustNotDo.length > 0 && (
                <button
                  type="button"
                  onClick={() => removeMustNotDoField(index)}
                  className="btn btn-ghost"
                  style={{ padding: '8px 12px', height: '60px', alignSelf: 'center' }}
                >
                  Remover
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addMustNotDoField}
          className="btn btn-secondary"
          style={{ marginTop: '12px', width: '100%' }}
        >
          + Agregar Restricción
        </button>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="btn btn-primary"
      >
        {saving ? 'Guardando...' : 'Guardar Instrucciones'}
      </button>
    </div>
  );
};

export default ChatbotInstructionsForm;
