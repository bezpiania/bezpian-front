import React, { useState, useEffect } from 'react';
import { message, Spin } from 'antd';
import Chatbot from '../../services/Chatbot.js';

const EmbedCodePanel = ({ workspaceId, botId, botName }) => {
  const [embedCode, setEmbedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchEmbedCode();
  }, [botId]);

  const fetchEmbedCode = async () => {
    try {
      setLoading(true);
      const response = await Chatbot.get(`/api/workspaces/${workspaceId}/chatbots/${botId}/embed-code`);

      if (response.data?.success) {
        setEmbedCode(response.data.data.embedCode);
      } else {
        message.error('Error al obtener código de integración');
      }
    } catch (error) {
      console.error('Error fetching embed code:', error);
      message.error('Error al cargar el código de integración');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    message.success('Código copiado al portapapeles');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="section-head">
        <div>
          <div className="section-num">Código de Integración</div>
          <div className="section-title">Copia este código en tu sitio web para <em>incrustar el chat</em></div>
        </div>
      </div>

      <Spin spinning={loading}>
        <div className="card">
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 13, opacity: 0.7, margin: 0 }}>
              Copia el siguiente código HTML y pégalo en tu sitio web para incrustar el chat de Zapien. El chat aparecerá en la esquina inferior derecha.
            </p>
          </div>

          {embedCode && (
            <div style={{
              background: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: 16,
              fontFamily: 'monospace',
              fontSize: 12,
              overflow: 'auto',
              maxHeight: '400px',
              marginBottom: 16,
              position: 'relative'
            }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                {embedCode}
              </pre>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="btn btn-primary"
              onClick={handleCopy}
              disabled={loading || !embedCode}
            >
              {copied ? '✓ Copiado' : '📋 Copiar Código'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={fetchEmbedCode}
              disabled={loading}
            >
              🔄 Actualizar
            </button>
          </div>

          <div style={{
            marginTop: 20,
            padding: 16,
            background: '#f0f8ff',
            border: '1px solid #b3d9ff',
            borderRadius: 8
          }}>
            <strong style={{ fontSize: 13 }}>💡 Instrucciones:</strong>
            <ol style={{ margin: '8px 0 0 0', paddingLeft: 20, fontSize: 12, opacity: 0.8 }}>
              <li>Copia el código de arriba</li>
              <li>Abre tu editor HTML o tu sitio web</li>
              <li>Pega el código antes de cerrar la etiqueta &lt;/body&gt;</li>
              <li>Guarda los cambios</li>
              <li>El chat de Zapien aparecerá automáticamente en tu página</li>
            </ol>
          </div>
        </div>
      </Spin>
    </>
  );
};

export default EmbedCodePanel;
