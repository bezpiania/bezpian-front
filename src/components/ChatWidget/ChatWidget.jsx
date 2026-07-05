import React, { useState, useRef, useEffect } from 'react';
import './ChatWidget.css';
import Chatbot from '../../services/Chatbot.js';
import QuoteFormModal from '../QuoteFormModal.jsx';
import AppointmentBookingModal from './AppointmentBookingModal.jsx';

const ChatWidget = ({ embedKey, tableId = null, position = 'bottom-right', autoOpen = false }) => {
  const [isOpen, isOpenSet] = useState(autoOpen);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [botId, setBotId] = useState(null);
  const [botInfo, setBotInfo] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [quoteFields, setQuoteFields] = useState([]);
  const [appointmentEnabled, setAppointmentEnabled] = useState(false);
  const messagesEndRef = useRef(null);

  const visitorId = useRef(Math.random().toString(36).substring(7)).current;

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startConversation = async () => {
    try {
      const response = await Chatbot.post('/api/embed/conversations', { embedKey, visitorId, tableId });

      if (response.data?.success) {
        const { conversationId: convId, botId: bid, welcomeMessage, bot, features, tableName: tName, isDineIn } = response.data.data;
        setConversationId(convId);
        setBotId(bid);
        setBotInfo(bot);
        setMessages([{ role: 'assistant', content: welcomeMessage, _id: '0' }]);
        setAppointmentEnabled(features?.appointmentsEnabled || false);
        if (features?.quotesEnabled) await fetchQuoteFields();
      } else if (response.data?.limitReached) {
        setMessages([{
          role: 'assistant',
          content: '🚫 Este servicio ha alcanzado su límite de conversaciones del mes. Por favor intenta nuevamente el próximo mes o contacta al negocio directamente.',
          _id: 'limit-0'
        }]);
      } else {
        setMessages([{ role: 'assistant', content: '❌ ' + (response.data?.message || 'Error iniciando la conversación'), _id: 'error-0' }]);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      setMessages([{ role: 'assistant', content: '❌ Error iniciando la conversación. Por favor, intenta más tarde.', _id: 'error-0' }]);
    }
  };

  const fetchQuoteFields = async () => {
    try {
      const response = await Chatbot.get(`/api/embed/quote-fields?embedKey=${embedKey}`);
      if (response.data?.success) setQuoteFields(response.data.data || []);
    } catch {}
  };

  const handleQuoteSubmit = async (formData) => {
    try {
      const response = await Chatbot.post('/api/embed/quote', {
        conversationId, items: [], subtotal: 0, tax: 0, total: 0, currency: 'CLP', customerData: formData,
      });
      if (response.data?.success) {
        setMessages(prev => [...prev, {
          role: 'system',
          content: `✅ Cotización #${response.data.data.quote.quoteNumber} creada. Te enviaremos los detalles al email proporcionado.`,
          _id: 'quote-success-' + Date.now(),
        }]);
        setShowQuoteModal(false);
      } else {
        setMessages(prev => [...prev, { role: 'system', content: '❌ Error al crear la cotización.', _id: 'quote-error-' + Date.now() }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'system', content: '❌ Error al procesar la cotización.', _id: 'quote-error-' + Date.now() }]);
    }
  };

  const handleAppointmentBooked = (appointment) => {
    setMessages(prev => [...prev, {
      role: 'system',
      content: `✅ ¡Reserva confirmada! ${appointment.customerName}, te esperamos el ${new Date(appointment.scheduledAt).toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} a las ${new Date(appointment.scheduledAt).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}. Recibirás una confirmación por email.`,
      _id: 'appt-success-' + Date.now(),
    }]);
    setShowAppointmentModal(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || !conversationId || !botId) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage, _id: Date.now().toString() }]);
    setLoading(true);

    try {
      const response = await Chatbot.post('/api/embed/messages', { conversationId, content: userMessage, botId });

      if (response.data?.success) {
        const botMessage = response.data.data.botMessage;
        setMessages(prev => [...prev, { role: 'assistant', content: botMessage.content, _id: botMessage._id }]);

        if (response.data?.warning && response.data?.warningMessage) {
          setTimeout(() => {
            setMessages(prev => [...prev, { role: 'system', content: response.data.warningMessage, _id: 'warning-' + Date.now() }]);
          }, 500);
        }
      } else {
        const errorCode = response.data?.errorCode;
        const errorMsg =
          errorCode === 'OPENAI_QUOTA_EXCEEDED'
            ? '⚠️ Este asistente no puede responder en este momento porque los créditos de IA se han agotado. Por favor, contacta al negocio para más información.'
            : errorCode === 'OPENAI_INVALID_KEY'
            ? '⚠️ Este asistente tiene un problema de configuración. Por favor, contacta al negocio directamente.'
            : '❌ ' + (response.data?.message || 'Error procesando tu mensaje');
        setMessages(prev => [...prev, { role: 'assistant', content: errorMsg, _id: 'error-' + Date.now() }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Error enviando tu mensaje. Por favor, intenta de nuevo.', _id: 'error-' + Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleOpen = () => {
    isOpenSet(true);
    if (messages.length === 0) startConversation();
  };

  const hasActions = quoteFields.length > 0 || appointmentEnabled;

  return (
    <div className={`zapien-widget ${isOpen ? 'open' : 'closed'} position-${position}`}>
      {isOpen && (
        <div className="zapien-chat-window">
          <div className="zapien-header">
            <div className="zapien-header-content">
              <div className="zapien-bot-name">{botInfo?.name || 'Øpia Chat'}</div>
              <div className="zapien-bot-status">En línea</div>
            </div>
            <button className="zapien-close-btn" onClick={() => isOpenSet(false)} aria-label="Close chat">✕</button>
          </div>

          <div className="zapien-messages">
            {messages.map(msg => (
              <div key={msg._id} className={`zapien-message zapien-message-${msg.role}`}>
                <div className={`zapien-message-content ${msg.role === 'system' ? 'zapien-system-message' : ''}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="zapien-message zapien-message-assistant">
                <div className="zapien-typing"><span></span><span></span><span></span></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Action buttons */}
          {hasActions && (
            <div style={{ padding: '8px 12px', borderTop: '1px solid #e0e0e0', display: 'flex', gap: 8 }}>
              {quoteFields.length > 0 && (
                <button onClick={() => setShowQuoteModal(true)} style={actionBtnStyle}>
                  📋 Cotización
                </button>
              )}
              {appointmentEnabled && (
                <button onClick={() => setShowAppointmentModal(true)} style={actionBtnStyle}>
                  📅 Reservar
                </button>
              )}
            </div>
          )}

          <div className="zapien-input-area">
            <textarea
              className="zapien-input"
              placeholder="Escribe tu mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              rows="2"
              disabled={loading}
            />
            <button className="zapien-send-btn" onClick={sendMessage} disabled={loading || !input.trim()} aria-label="Send message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
              </svg>
            </button>
          </div>

          <QuoteFormModal
            visible={showQuoteModal}
            onClose={() => setShowQuoteModal(false)}
            fields={quoteFields}
            onSubmit={handleQuoteSubmit}
            loading={loading}
          />

          {showAppointmentModal && (
            <AppointmentBookingModal
              embedKey={embedKey}
              conversationId={conversationId}
              onClose={() => setShowAppointmentModal(false)}
              onBooked={handleAppointmentBooked}
            />
          )}
        </div>
      )}

      {!isOpen && (
        <button className="zapien-toggle-btn" onClick={handleOpen} aria-label="Open chat">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2 22l6-2.05C9.48 21.3 10.7 21.95 12 21.95c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
          </svg>
        </button>
      )}
    </div>
  );
};

const actionBtnStyle = {
  flex: 1,
  padding: '8px 12px',
  backgroundColor: '#f0f0f0',
  border: '1px solid #ddd',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: '500',
};

export default ChatWidget;
