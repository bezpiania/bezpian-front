import React, { useState, useRef } from 'react';
import { Spin, message } from 'antd';
import Papa from 'papaparse';
import Product from '../../services/Product.js';

const ImportCSVModal = ({ visible, onClose, workspaceId, chatbotId, onSuccess }) => {
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const products = results.data.map((row, idx) => ({
          rowIndex: idx + 1,
          name: row.name || row.nombre || row.producto || '',
          sku: row.sku || row.codigo || '',
          price: parseFloat(row.price || row.precio || 0),
          description: row.description || row.descripción || '',
          imageUrl: row.imageUrl || row.imagen || '',
          category: row.category || row.categoría || '',
          tags: typeof row.tags === 'string' ? row.tags.split(',').map(t => t.trim()).join(',') : '',
          stock: row.stock ? parseInt(row.stock) : 0,
        }));

        setCsvData(products);
        setParsed(true);
        setLoading(false);
      },
      error: (error) => {
        message.error(`Error al procesar CSV: ${error.message}`);
        setLoading(false);
      }
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await Product.bulkCreate(workspaceId, chatbotId, csvData);

      message.success(`✅ ${csvData.length} productos importados exitosamente`);
      onSuccess?.();
      handleClose();
    } catch (error) {
      message.error(error?.response?.data?.message || 'Error al importar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCsvData([]);
    setParsed(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    handleReset();
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
          maxWidth: 700,
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 24,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, marginBottom: 20 }}>
          Importar Productos (CSV)
        </div>

        <Spin spinning={loading}>
          {!parsed ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, marginBottom: 8 }}>
                  Carga un archivo CSV
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, opacity: 0.6, marginBottom: 16 }}>
                  Columnas esperadas: nombre, sku, precio, descripción, imagen, categoría, stock, tags
                </div>
              </div>

              <div
                style={{
                  background: 'var(--bone-2)',
                  padding: '20px',
                  borderRadius: 8,
                  marginBottom: 20,
                  textAlign: 'left',
                }}
              >
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 12, marginBottom: 10 }}>
                  Formato esperado:
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 12, opacity: 0.7 }}>
                  <div>nombre,sku,precio,descripción,imagen,categoría,tags</div>
                  <div style={{ marginTop: 6 }}>Laptop,DELL-01,1500,Laptop rápida,https://...,Electrónica,laptop;dell</div>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                disabled={loading}
                style={{
                  padding: '10px',
                  border: '2px solid var(--rule)',
                  borderRadius: 8,
                  cursor: 'pointer',
                  width: '100%',
                  marginBottom: 16,
                }}
              />

              <div style={{ display: 'flex', gap: 10 }}>
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
          ) : (
            <div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
                  ✅ {csvData.length} productos listos para importar
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, opacity: 0.6 }}>
                  Revisa los datos antes de confirmar
                </div>
              </div>

              <div style={{ background: 'var(--bone)', borderRadius: 8, overflow: 'auto', marginBottom: 20, maxHeight: 300 }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: 12,
                  }}
                >
                  <thead>
                    <tr style={{ background: 'var(--bone-2)' }}>
                      <th style={{ padding: 8, textAlign: 'left', fontWeight: 600 }}>Nombre</th>
                      <th style={{ padding: 8, textAlign: 'left', fontWeight: 600 }}>SKU</th>
                      <th style={{ padding: 8, textAlign: 'left', fontWeight: 600 }}>Precio</th>
                      <th style={{ padding: 8, textAlign: 'left', fontWeight: 600 }}>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.slice(0, 10).map((product, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--rule)' }}>
                        <td style={{ padding: 8 }}>{product.name}</td>
                        <td style={{ padding: 8 }}>{product.sku}</td>
                        <td style={{ padding: 8 }}>${product.price.toFixed(2)}</td>
                        <td style={{ padding: 8 }}>{product.stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ flex: 1 }}>
                  Importar {csvData.length} productos
                </button>
                <button
                  onClick={handleReset}
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
                  Volver
                </button>
              </div>
            </div>
          )}
        </Spin>
      </div>
    </div>
  );
};

export default ImportCSVModal;
