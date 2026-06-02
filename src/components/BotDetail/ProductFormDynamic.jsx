/**
 * ProductFormDynamic — Formulario de producto/servicio adaptado al businessType.
 * Lee la configuración de campos desde businessTypes.js y renderiza
 * solo los campos relevantes para el rubro, con los labels correctos.
 */
import React, { useState } from 'react';
import { getBusinessType } from '../../config/businessTypes.js';

const inputStyle = {
  width: '100%', padding: '9px 12px', border: '1px solid var(--rule)',
  borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 13,
  background: 'var(--bone)', boxSizing: 'border-box',
};

const FieldWrap = ({ label, required, hint, children }) => (
  <div className="field" style={{ margin: 0 }}>
    <label className="field-label">
      {label}
      {required && <span style={{ color: 'var(--magma)', marginLeft: 4 }}>*</span>}
    </label>
    {children}
    {hint && <small style={{ opacity: 0.55, marginTop: 4, display: 'block' }}>{hint}</small>}
  </div>
);

// Tag input (for ingredients, allergens, etc.)
const TagInput = ({ value = [], onChange, placeholder, options }) => {
  const [input, setInput] = useState('');
  const add = (tag) => {
    const t = tag.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setInput('');
  };
  const remove = (t) => onChange(value.filter(v => v !== t));
  return (
    <div>
      {options ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          {options.map(opt => (
            <button key={opt} type="button"
              onClick={() => value.includes(opt) ? remove(opt) : add(opt)}
              style={{ padding: '4px 10px', borderRadius: 20, border: `1px solid ${value.includes(opt) ? 'var(--ink)' : 'var(--rule)'}`, background: value.includes(opt) ? 'var(--ink)' : 'transparent', color: value.includes(opt) ? 'var(--bone)' : 'inherit', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-mono)' }}>
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          <input style={{ ...inputStyle, flex: 1 }} placeholder={placeholder || 'Agregar...'} value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(input); } }} />
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => add(input)}>+</button>
        </div>
      )}
      {value.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {value.map(t => (
            <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--bone-3)', borderRadius: 6, padding: '3px 8px', fontSize: 12 }}>
              {t}
              <button type="button" onClick={() => remove(t)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, opacity: 0.5, fontSize: 14, lineHeight: 1 }}>×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// Variants editor (store only)
const VariantsEditor = ({ value = [], onChange }) => {
  const addVariant = () => onChange([...value, { name: '', options: [], stock: 0, price: null }]);
  const updateVariant = (i, key, val) => {
    const next = [...value];
    next[i] = { ...next[i], [key]: val };
    onChange(next);
  };
  const removeVariant = (i) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {value.map((v, i) => (
        <div key={i} style={{ border: '1px solid var(--rule)', borderRadius: 8, padding: 12, display: 'grid', gridTemplateColumns: '1fr 1fr 80px 80px auto', gap: 8, alignItems: 'center' }}>
          <input style={inputStyle} placeholder="Tipo (ej: Talla)" value={v.name} onChange={e => updateVariant(i, 'name', e.target.value)} />
          <input style={inputStyle} placeholder="Opciones (S,M,L)" value={(v.options || []).join(',')} onChange={e => updateVariant(i, 'options', e.target.value.split(',').map(o => o.trim()).filter(Boolean))} />
          <input style={inputStyle} type="number" placeholder="Stock" value={v.stock ?? ''} onChange={e => updateVariant(i, 'stock', parseInt(e.target.value) || 0)} />
          <input style={inputStyle} type="number" placeholder="Precio" value={v.price ?? ''} onChange={e => updateVariant(i, 'price', parseFloat(e.target.value) || null)} />
          <button type="button" onClick={() => removeVariant(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--magma)', fontSize: 18 }}>×</button>
        </div>
      ))}
      <button type="button" className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }} onClick={addVariant}>+ Agregar variante</button>
    </div>
  );
};

const ProductFormDynamic = ({ businessType, initial = {}, onSave, onCancel, saving }) => {
  const biz = getBusinessType(businessType);
  const fields = biz.catalog.fields;

  const [form, setForm] = useState({
    name: '', description: '', price: '', category: '', available: true,
    sku: '', brand: '', barcode: '', stock: 0, salePrice: '', weight: '', variants: [],
    ingredients: [], allergens: [], dietaryTags: [], portionSize: '', prepTime: '', availableFor: [], calories: '',
    duration: '', specialty: '', requiresPrep: false, prepInstructions: '', insuranceCoverage: '', sessionCount: 1,
    ...initial,
  });

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));
  const show = (key) => fields[key]?.show !== false;
  const required = (key) => fields[key]?.required === true;
  const label = (key) => fields[key]?.label || key;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Row 1: name + category */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <FieldWrap label={label('name')} required={required('name')}>
          <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder={`Ej: ${biz.catalog.itemLabel} principal`} />
        </FieldWrap>
        <FieldWrap label={label('category')} required={required('category')}>
          <select style={inputStyle} value={form.category} onChange={e => set('category', e.target.value)}>
            <option value="">Seleccionar...</option>
            {biz.catalog.categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </FieldWrap>
      </div>

      {/* Description */}
      {show('description') && (
        <FieldWrap label={label('description')}>
          <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Descripción..." />
        </FieldWrap>
      )}

      {/* Row: price + extra price fields */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
        <FieldWrap label={label('price')} required={required('price')} hint={businessType === 'clinic' ? '0 = Consultar' : ''}>
          <input style={inputStyle} type="number" min={0} value={form.price} onChange={e => set('price', e.target.value)} placeholder="0" />
        </FieldWrap>
        {show('salePrice') && (
          <FieldWrap label={label('salePrice')}>
            <input style={inputStyle} type="number" min={0} value={form.salePrice} onChange={e => set('salePrice', e.target.value)} placeholder="0" />
          </FieldWrap>
        )}
        {show('stock') && (
          <FieldWrap label={label('stock')} required={required('stock')}>
            <input style={inputStyle} type="number" min={0} value={form.stock} onChange={e => set('stock', parseInt(e.target.value) || 0)} />
          </FieldWrap>
        )}
        {show('sku') && (
          <FieldWrap label={label('sku')}>
            <input style={inputStyle} value={form.sku} onChange={e => set('sku', e.target.value)} placeholder="SKU-001" />
          </FieldWrap>
        )}
      </div>

      {/* Store fields */}
      {show('brand') && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <FieldWrap label={label('brand')}><input style={inputStyle} value={form.brand} onChange={e => set('brand', e.target.value)} /></FieldWrap>
          {show('barcode') && <FieldWrap label={label('barcode')}><input style={inputStyle} value={form.barcode} onChange={e => set('barcode', e.target.value)} /></FieldWrap>}
          {show('weight') && <FieldWrap label={label('weight')}><input style={inputStyle} type="number" step="0.01" value={form.weight} onChange={e => set('weight', e.target.value)} placeholder="0.5" /></FieldWrap>}
        </div>
      )}

      {/* Variants */}
      {show('variants') && (
        <FieldWrap label={label('variants')} hint="Nombre del tipo, opciones separadas por coma, stock y precio opcional por variante">
          <VariantsEditor value={form.variants} onChange={v => set('variants', v)} />
        </FieldWrap>
      )}

      {/* Restaurant fields */}
      {show('ingredients') && (
        <FieldWrap label={label('ingredients')} hint="Presiona Enter o coma para agregar">
          <TagInput value={form.ingredients} onChange={v => set('ingredients', v)} placeholder="Ej: Tomate, Cebolla..." />
        </FieldWrap>
      )}
      {show('allergens') && (
        <FieldWrap label={label('allergens')}>
          <TagInput value={form.allergens} onChange={v => set('allergens', v)} options={fields.allergens?.options} />
        </FieldWrap>
      )}
      {show('tags') && (
        <FieldWrap label={label('tags')}>
          <TagInput value={form.dietaryTags} onChange={v => set('dietaryTags', v)} options={fields.tags?.options} />
        </FieldWrap>
      )}
      {(show('portionSize') || show('prepTime') || show('availableFor')) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          {show('portionSize') && (
            <FieldWrap label={label('portionSize')}>
              <select style={inputStyle} value={form.portionSize} onChange={e => set('portionSize', e.target.value)}>
                <option value="">Seleccionar...</option>
                {fields.portionSize?.options?.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </FieldWrap>
          )}
          {show('prepTime') && (
            <FieldWrap label={label('prepTime')}>
              <input style={inputStyle} type="number" min={0} value={form.prepTime} onChange={e => set('prepTime', e.target.value)} placeholder="15" />
            </FieldWrap>
          )}
          {show('availableFor') && (
            <FieldWrap label={label('availableFor')}>
              <TagInput value={form.availableFor} onChange={v => set('availableFor', v)} options={fields.availableFor?.options} />
            </FieldWrap>
          )}
        </div>
      )}

      {/* Clinic fields */}
      {show('duration') && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          <FieldWrap label={label('duration')} required={required('duration')}>
            <input style={inputStyle} type="number" min={5} step={5} value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="30" />
          </FieldWrap>
          {show('specialty') && (
            <FieldWrap label={label('specialty')} required={required('specialty')}>
              <input style={inputStyle} value={form.specialty} onChange={e => set('specialty', e.target.value)} placeholder="Ej: Traumatología" />
            </FieldWrap>
          )}
          {show('sessionCount') && (
            <FieldWrap label={label('sessionCount')}>
              <input style={inputStyle} type="number" min={1} value={form.sessionCount} onChange={e => set('sessionCount', parseInt(e.target.value) || 1)} />
            </FieldWrap>
          )}
        </div>
      )}
      {show('insuranceCoverage') && (
        <FieldWrap label={label('insuranceCoverage')}>
          <input style={inputStyle} value={form.insuranceCoverage} onChange={e => set('insuranceCoverage', e.target.value)} placeholder="Ej: Fonasa, Isapre Cruz Blanca" />
        </FieldWrap>
      )}
      {show('requiresPrep') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
            <input type="checkbox" checked={form.requiresPrep} onChange={() => set('requiresPrep', !form.requiresPrep)} />
            {label('requiresPrep')}
          </label>
          {form.requiresPrep && show('prepInstructions') && (
            <FieldWrap label={label('prepInstructions')}>
              <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 60 }} value={form.prepInstructions} onChange={e => set('prepInstructions', e.target.value)} placeholder="Ej: Ayuno de 8 horas, traer exámenes previos..." />
            </FieldWrap>
          )}
        </div>
      )}

      {/* Available toggle */}
      {show('available') && (
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
          <input type="checkbox" checked={form.available} onChange={() => set('available', !form.available)} />
          {label('available')}
        </label>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8 }}>
        <button className="btn btn-secondary" onClick={onCancel} disabled={saving}>Cancelar</button>
        <button className="btn btn-primary" onClick={() => onSave(form)} disabled={saving || !form.name}>
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </div>
  );
};

export default ProductFormDynamic;
