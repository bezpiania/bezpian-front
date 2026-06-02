import React, { useState } from 'react';
import { Spin, message } from 'antd';
import Product from '../../services/Product.js';
import ProductFormDynamic from './ProductFormDynamic.jsx';

const AddProductModal = ({ visible, onClose, workspaceId, chatbotId, onSuccess, editingProduct, businessType }) => {
  const [form, setForm] = useState({
    name: '',
    sku: '',
    price: '',
    description: '',
    imageUrl: '',
    category: '',
    tags: '',
    stock: '',
    giftOccasion: [],
  });
  const [loading, setLoading] = useState(false);

  // Cargar datos del producto a editar
  React.useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name || '',
        sku: editingProduct.sku || '',
        price: editingProduct.price || '',
        description: editingProduct.description || '',
        imageUrl: editingProduct.imageUrl || '',
        category: editingProduct.category || '',
        tags: editingProduct.tags ? editingProduct.tags.join(', ') : '',
        stock: editingProduct.stock || '',
        giftOccasion: (editingProduct.giftOccasion || []).map(g => g.occasion),
      });
    } else {
      handleClose();
    }
  }, [editingProduct]);

  const giftOccasions = [
    { value: 'mothers_day', label: 'Día de mamá' },
    { value: 'fathers_day', label: 'Día de papá' },
    { value: 'birthday', label: 'Cumpleaños' },
    { value: 'anniversary', label: 'Aniversario' },
    { value: 'christmas', label: 'Navidad' },
    { value: 'valentines', label: 'San Valentín' },
    { value: 'graduation', label: 'Graduación' },
    { value: 'newborn', label: 'Bienvenida bebé' },
    { value: 'get_well', label: 'Recuperación' },
    { value: 'thank_you', label: 'Agradecimiento' },
  ];

  const toggleGiftOccasion = (occasion) => {
    setForm(prev => {
      const current = prev.giftOccasion || [];
      const isSelected = current.includes(occasion);
      return {
        ...prev,
        giftOccasion: isSelected
          ? current.filter(o => o !== occasion)
          : [...current, occasion]
      };
    });
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price) {
      message.error('Nombre y precio son requeridos');
      return;
    }

    try {
      setLoading(true);
      const productData = {
        ...form,
        price: parseFloat(form.price) || 0,
        stock: form.stock ? parseInt(form.stock) : 0,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        giftOccasion: (form.giftOccasion || []).map(occasion => ({ occasion, reason: '' })),
      };

      if (editingProduct) {
        await Product.update(workspaceId, chatbotId, editingProduct._id, productData);
        message.success('Actualizado exitosamente');
      } else {
        await Product.create(workspaceId, chatbotId, productData);
        message.success('Creado exitosamente');
      }

      onSuccess?.();
      handleClose();
    } catch (error) {
      message.error(error?.response?.data?.message || `Error al ${editingProduct ? 'actualizar' : 'crear'}`);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic save handler for ProductFormDynamic
  const handleDynamicSave = async (formData) => {
    try {
      setLoading(true);
      const productData = { ...formData, price: parseFloat(formData.price) || 0 };
      if (editingProduct) {
        await Product.update(workspaceId, chatbotId, editingProduct._id, productData);
        message.success('Actualizado exitosamente');
      } else {
        await Product.create(workspaceId, chatbotId, productData);
        message.success('Creado exitosamente');
      }
      onSuccess?.();
      handleClose();
    } catch (error) {
      message.error(error?.response?.data?.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({ name: '', sku: '', price: '', description: '', imageUrl: '', category: '', tags: '', stock: '', giftOccasion: [] });
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
          {editingProduct ? 'Editar' : 'Agregar'} {businessType && businessType !== 'generic' ? '' : 'Producto'}
        </div>

        {/* Dynamic form for typed business — replaces legacy form */}
        {businessType && businessType !== 'generic' ? (
          <ProductFormDynamic
            businessType={businessType}
            initial={editingProduct || {}}
            onSave={handleDynamicSave}
            onCancel={handleClose}
            saving={loading}
          />
        ) : (

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

            <div>
              <label style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, display: 'block', marginBottom: 10 }}>
                🎁 Ocasiones de Regalo
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {giftOccasions.map(occasion => (
                  <label key={occasion.value} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                    <input
                      type="checkbox"
                      checked={(form.giftOccasion || []).includes(occasion.value)}
                      onChange={() => toggleGiftOccasion(occasion.value)}
                      style={{ cursor: 'pointer', width: 16, height: 16 }}
                    />
                    <span style={{ fontFamily: 'var(--font-body)' }}>{occasion.label}</span>
                  </label>
                ))}
              </div>
              <p style={{ fontSize: 11, opacity: 0.6, marginTop: 8, fontStyle: 'italic' }}>
                Marca las ocasiones para las que este producto es un buen regalo
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ flex: 1 }}>
                {editingProduct ? 'Actualizar Producto' : 'Crear Producto'}
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
        )} {/* end legacy form conditional */}
      </div>
    </div>
  );
};

export default AddProductModal;
