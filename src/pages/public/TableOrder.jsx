import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Chatbot from '../../services/Chatbot.js';
import ChatWidget from '../../components/ChatWidget/ChatWidget.jsx';

/**
 * TableOrder — página pública que se abre al escanear el QR de una mesa.
 * URL: /mesa/:tableToken
 * Resuelve el token → obtiene embedKey + tableId → abre el widget automáticamente.
 */
const TableOrder = () => {
  const { tableToken } = useParams();
  const [info, setInfo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Chatbot.get(`/api/embed/table/${tableToken}`)
      .then(res => {
        if (res.success) setInfo(res.data);
        else setError('Mesa no encontrada');
      })
      .catch(() => setError('Error al cargar la mesa'))
      .finally(() => setLoading(false));
  }, [tableToken]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F4F0E8' }}>
      <div style={{ fontFamily: 'sans-serif', opacity: 0.5 }}>Cargando...</div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F4F0E8' }}>
      <div style={{ textAlign: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
        <div style={{ fontWeight: 700, fontSize: 20 }}>{error}</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F4F0E8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🍽️</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 28, margin: '0 0 4px' }}>{info.chatbotName}</h1>
        <p style={{ fontFamily: 'sans-serif', fontSize: 15, opacity: 0.6, margin: 0 }}>{info.tableName}</p>
      </div>
      <p style={{ fontFamily: 'sans-serif', fontSize: 14, opacity: 0.55, textAlign: 'center', maxWidth: 280 }}>
        Haz clic en el botón de chat para ver el menú, realizar tu pedido o solicitar la cuenta.
      </p>

      {/* The widget opens automatically in this context */}
      <ChatWidget
        embedKey={info.embedKey}
        tableId={info.tableId}
        autoOpen={true}
        position="bottom-right"
      />
    </div>
  );
};

export default TableOrder;
