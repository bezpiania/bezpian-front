import React, { useState } from 'react';
import { Modal, Spin, message } from 'antd';

const FIELD_TYPES = {
  text: 'text',
  email: 'email',
  phone: 'tel',
  number: 'number',
  date: 'date',
  textarea: 'textarea',
  select: 'select'
};

const QuoteFormModal = ({ visible, onClose, fields, onSubmit, loading }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    fields.forEach(field => {
      const value = formData[field.fieldId];

      if (field.required && !value) {
        newErrors[field.fieldId] = `${field.label} es requerido`;
      }

      if (value && field.fieldType === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[field.fieldId] = 'Email inválido';
        }
      }

      if (value && field.fieldType === 'phone') {
        const phoneRegex = /^[\d\+\-\s\(\)]{6,}$/;
        if (!phoneRegex.test(value)) {
          newErrors[field.fieldId] = 'Teléfono inválido';
        }
      }

      if (value && field.fieldType === 'number') {
        if (isNaN(value)) {
          newErrors[field.fieldId] = 'Debe ser un número';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(formData);
      setFormData({});
      setErrors({});
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({});
    setErrors({});
    onClose();
  };

  return (
    <Modal
      title="Solicitar Cotización"
      open={visible}
      onCancel={handleClose}
      onOk={handleSubmit}
      confirmLoading={submitting}
      okText="Enviar Solicitud"
      cancelText="Cancelar"
      width={500}
    >
      <Spin spinning={loading}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {fields && fields.length > 0 ? (
            fields
              .sort((a, b) => a.order - b.order)
              .map(field => (
                <div key={field.fieldId}>
                  <label style={{ fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 6 }}>
                    {field.label} {field.required && <span style={{ color: 'var(--magma)' }}>*</span>}
                  </label>

                  {field.fieldType === 'textarea' ? (
                    <textarea
                      value={formData[field.fieldId] || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, [field.fieldId]: e.target.value });
                        if (errors[field.fieldId]) {
                          setErrors({ ...errors, [field.fieldId]: '' });
                        }
                      }}
                      placeholder={field.placeholder}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: errors[field.fieldId] ? '1px solid var(--magma)' : '1px solid var(--rule)',
                        borderRadius: 8,
                        fontFamily: 'var(--font-body)',
                        minHeight: 80,
                        resize: 'vertical',
                        boxSizing: 'border-box'
                      }}
                    />
                  ) : field.fieldType === 'select' ? (
                    <select
                      value={formData[field.fieldId] || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, [field.fieldId]: e.target.value });
                        if (errors[field.fieldId]) {
                          setErrors({ ...errors, [field.fieldId]: '' });
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: errors[field.fieldId] ? '1px solid var(--magma)' : '1px solid var(--rule)',
                        borderRadius: 8,
                        fontFamily: 'var(--font-body)',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">-- Seleccionar --</option>
                      {field.options && field.options.map((option, idx) => (
                        <option key={idx} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={FIELD_TYPES[field.fieldType] || 'text'}
                      value={formData[field.fieldId] || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, [field.fieldId]: e.target.value });
                        if (errors[field.fieldId]) {
                          setErrors({ ...errors, [field.fieldId]: '' });
                        }
                      }}
                      placeholder={field.placeholder}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: errors[field.fieldId] ? '1px solid var(--magma)' : '1px solid var(--rule)',
                        borderRadius: 8,
                        fontFamily: 'var(--font-body)',
                        boxSizing: 'border-box'
                      }}
                    />
                  )}

                  {errors[field.fieldId] && (
                    <div style={{ color: 'var(--magma)', fontSize: 12, marginTop: 4 }}>
                      {errors[field.fieldId]}
                    </div>
                  )}

                  {field.helpText && !errors[field.fieldId] && (
                    <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4 }}>
                      {field.helpText}
                    </div>
                  )}
                </div>
              ))
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', opacity: 0.6 }}>
              No hay campos configurados para esta cotización
            </div>
          )}
        </div>
      </Spin>
    </Modal>
  );
};

export default QuoteFormModal;
