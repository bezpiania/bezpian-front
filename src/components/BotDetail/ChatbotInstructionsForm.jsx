import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import api from '../../apis/app.js';

const TONES = [
  { value: 'amigable',    label: 'Amigable',     desc: 'Cálido y cercano, genera confianza' },
  { value: 'profesional', label: 'Profesional',  desc: 'Formal pero accesible, confiable' },
  { value: 'casual',      label: 'Casual',       desc: 'Relajado, como un amigo que ayuda' },
  { value: 'formal',      label: 'Formal',       desc: 'Corporativo, trato de usted' },
];

const LANGUAGES = [
  { value: 'auto', label: 'Automático', desc: 'Responde en el idioma del cliente' },
  { value: 'es',   label: 'Español',    desc: 'Siempre en español' },
  { value: 'en',   label: 'English',    desc: 'Always in English' },
];

const RulesList = ({ label, hint, items, onChange, placeholder }) => {
  const [newItem, setNewItem] = useState('');

  const add = () => {
    if (!newItem.trim()) return;
    onChange([...items, newItem.trim()]);
    setNewItem('');
  };

  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));

  const update = (i, val) => {
    const next = [...items];
    next[i] = val;
    onChange(next);
  };

  return (
    <div>
      <div className="section-num" style={{ marginBottom: 6 }}>{label}</div>
      {hint && <small style={{ opacity: 0.55, display: 'block', marginBottom: 10 }}>{hint}</small>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input className="input" value={item} style={{ flex: 1 }}
              onChange={e => update(i, e.target.value)} />
            <button onClick={() => remove(i)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--magma)', fontSize: 18, padding: '0 4px' }}>×</button>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input className="input" value={newItem} placeholder={placeholder}
          onChange={e => setNewItem(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          style={{ flex: 1 }} />
        <button className="btn btn-secondary btn-sm" onClick={add}>+ Agregar</button>
      </div>
    </div>
  );
};

const ChatbotInstructionsForm = ({ workspaceId, botId }) => {
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [form, setForm] = useState({
    assistantName:  '',
    tone:           'amigable',
    language:       'auto',
    welcomeMessage: '',
    fallbackMessage:'',
    closingQuestion:'¿En qué más puedo ayudarte?',
    customRules:    [],
    restrictions:   [],
  });

  useEffect(() => { fetchConfig(); }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/workspaces/${workspaceId}/chatbots/${botId}/config`);
      const instr = res?.data?.instructions || res?.instructions || {};
      // Also fetch bot for welcomeMessage/fallbackMessage
      const botRes = await api.get(`/api/workspaces/${workspaceId}/chatbots/${botId}`);
      const bot = botRes?.data || botRes;
      setForm({
        assistantName:  instr.assistantName  || '',
        tone:           instr.tone           || 'amigable',
        language:       instr.language       || 'auto',
        welcomeMessage: instr.welcomeMessage || bot?.personality?.welcomeMessage || '',
        fallbackMessage:instr.fallbackMessage|| bot?.personality?.fallbackMessage|| '',
        closingQuestion:instr.closingQuestion|| '¿En qué más puedo ayudarte?',
        customRules:    instr.customRules    || [],
        restrictions:   instr.restrictions  || [],
      });
    } catch (e) {
      console.error('Error fetching instructions:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.post(`/api/workspaces/${workspaceId}/chatbots/${botId}/config`, {
        instructions: {
          assistantName:  form.assistantName,
          tone:           form.tone,
          language:       form.language,
          welcomeMessage: form.welcomeMessage,
          fallbackMessage:form.fallbackMessage,
          closingQuestion:form.closingQuestion,
          customRules:    form.customRules.filter(r => r.trim()),
          restrictions:   form.restrictions.filter(r => r.trim()),
        },
      });
      // Also update bot personality fields
      await api.patch(`/api/workspaces/${workspaceId}/chatbots/${botId}`, {
        $set: {
          'personality.welcomeMessage':  form.welcomeMessage,
          'personality.fallbackMessage': form.fallbackMessage,
        },
      });
      message.success('Instrucciones guardadas');
    } catch (e) {
      message.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  if (loading) return <div style={{ padding: 40, textAlign: 'center', opacity: 0.5, fontFamily: 'var(--font-mono)', fontSize: 12 }}>Cargando...</div>;

  return (
    <>
      <div className="section-head">
        <div>
          <div className="section-num">Instrucciones</div>
          <div className="section-title">Personalidad y <em>comportamiento</em> del bot</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Identity */}
        <div className="card">
          <div className="section-num" style={{ marginBottom: 14 }}>Identidad del asistente</div>
          <div className="grid-2-eq" style={{ gap: 16 }}>
            <div className="field">
              <label className="field-label">Nombre del asistente (opcional)</label>
              <input className="input" placeholder={`Ej: Rafi, Max, Sofia`}
                value={form.assistantName} onChange={e => set('assistantName', e.target.value)} />
              <small style={{ opacity: 0.55, marginTop: 4, display: 'block' }}>Si está vacío, usa el nombre del chatbot.</small>
            </div>
            <div className="field">
              <label className="field-label">Idioma de respuesta</label>
              <select className="select" value={form.language} onChange={e => set('language', e.target.value)}>
                {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label} — {l.desc}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Tone */}
        <div className="card">
          <div className="section-num" style={{ marginBottom: 14 }}>Tono de voz</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {TONES.map(t => (
              <label key={t.value} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                border: `1.5px solid ${form.tone === t.value ? 'var(--carbon)' : 'var(--rule)'}`,
                background: form.tone === t.value ? 'var(--carbon)' : 'var(--bone)',
                color: form.tone === t.value ? 'var(--bone)' : 'inherit',
                transition: 'all .15s',
              }}>
                <input type="radio" name="tone" value={t.value} checked={form.tone === t.value}
                  onChange={() => set('tone', t.value)} style={{ marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{t.label}</div>
                  <div style={{ fontSize: 12, opacity: 0.65, marginTop: 2 }}>{t.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="card">
          <div className="section-num" style={{ marginBottom: 14 }}>Mensajes</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="field">
              <label className="field-label">Mensaje de bienvenida</label>
              <textarea className="input" rows={2} value={form.welcomeMessage}
                onChange={e => set('welcomeMessage', e.target.value)}
                placeholder="¡Hola! Soy tu asistente. ¿En qué puedo ayudarte?" />
            </div>
            <div className="field">
              <label className="field-label">Mensaje cuando no sabe responder</label>
              <textarea className="input" rows={2} value={form.fallbackMessage}
                onChange={e => set('fallbackMessage', e.target.value)}
                placeholder="No tengo información sobre eso. ¿Te paso el contacto directo?" />
            </div>
            <div className="field">
              <label className="field-label">Pregunta de cierre</label>
              <input className="input" value={form.closingQuestion}
                onChange={e => set('closingQuestion', e.target.value)}
                placeholder="¿En qué más puedo ayudarte?" />
            </div>
          </div>
        </div>

        {/* Rules */}
        <div className="card">
          <div className="section-num" style={{ marginBottom: 14 }}>Reglas de comportamiento</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <RulesList
              label="✅ El bot SIEMPRE debe:"
              hint="Ej: Recomendar el menú del día, Mencionar el estacionamiento gratuito"
              items={form.customRules}
              onChange={v => set('customRules', v)}
              placeholder="Agregar una regla..."
            />
            <RulesList
              label="❌ El bot NUNCA debe:"
              hint="Ej: Mencionar precios sin IVA, Hablar de la competencia"
              items={form.restrictions}
              onChange={v => set('restrictions', v)}
              placeholder="Agregar una restricción..."
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar instrucciones'}
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatbotInstructionsForm;
