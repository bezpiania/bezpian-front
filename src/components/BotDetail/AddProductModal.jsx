import React, { useState } from 'react';
import { Spin, message } from 'antd';
import Product from '../../services/Product.js';

const AddProductModal = ({ visible, onClose, workspaceId, chatbotId, onSuccess }) => {
  const [form, setForm] = useState({
    name: '',
    sku: '',
    price: '',
    description: '',
    imageUrl: '',
    category: '',
    tags: '',
    stock: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.sku || !form.price) {
      message.error('Nombre, SKU y precio son requeridos');
      return;
    }

    try {
      setLoading(true);
      await Product.create(workspaceId, chatbotId, {
        ...form,
        price: parseFloat(form.price),
        stock: form.stock ? parseInt(form.stock) : 0,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      });

      message.success('Producto creado exitosamente');
      onSuccess?.();
      handleClose();
    } catch (error) {
      message.error(error?.response?.data?.message || 'Error al crear producto');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({ name: '', sku: '', price: '', description: '', imageUrl: '', category: '', tags: '', stock: '' });
    onClose();
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={handleClose}
    >
      <div
        className="card"
        style={{
          width: '90%',
          maxWidth: 500,
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 24,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, marginBottom: 20 }}>
          Agregar Producto
        </div>

        <Spin spinning={loading}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, display: 'block', marginBottom: 6 }}>
                Nombre *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Nombre del producto"
                className="input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, display: 'block', marginBottom: 6 }}>
                  SKU *
                </label>
                <input
                  type="text"
                  value={form.sku}
                  onChange={(e) => handleChange('sku', e.target.value)}
                  placeholder="SKU único"
                  className="input"
                />
              </div>
              <div>
                <label style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, display: 'block', marginBottom: 6 }}>
                  Precio *
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  className="input"
                />
              </div>
            </div>

            <div>
              <label style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, display: 'block', marginBottom: 6 }}>
                Descripción
              </label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Descripción del producto"
                className="input"
                style={{ minHeight: 80, fontFamily: 'var(--font-body)' }}
              />
            </div>

            <div>
              <label style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, display: 'block', marginBottom: 6 }}>
                URL de Imagen
              </label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => handleChange('imageUrl', e.target.value)}
                placeholder="https://..."
                className="input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, display: 'block', marginBottom: 6 }}>
                  Categoría
                </label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  placeholder="Ej: Electrónica"
                  className="input"
                />
              </div>
              <div>
                <label style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, display: 'block', marginBottom: 6 }}>
                  Stock
                </label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => handleChange('stock', e.target.value)}
                  placeholder="0"
                  className="input"
                />
              </div>
            </div>

            <div>
              <label style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, display: 'block', marginBottom: 6 }}>
                Tags (separados por coma)
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => handleChange('tags', e.target.value)}
                placeholder="tag1, tag2, tag3"
                className="input"
              />
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ flex: 1 }}>
                Crear Producto
              </button>
              <button
                onClick={handleClose}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  border: '1px solid var(--rule)',
                  background: 'transparent',
                  borderRadius: 8,
                  fontFamily: 'var(--font-display)',
                  fontWeight: 500,
                  cursor: 'pointer',
                  color: 'var(--carbon)',
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </Spin>
      </div>
    </div>
  );
};

export default AddProductModal;
