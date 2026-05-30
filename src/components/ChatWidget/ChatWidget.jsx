import React, { useState, useRef, useEffect } from 'react';
import './ChatWidget.css';
import Chatbot from '../../services/Chatbot.js';
import QuoteFormModal from '../QuoteFormModal.jsx';

const ChatWidget = ({ embedKey, position = 'bottom-right' }) => {
  const [isOpen, isOpenSet] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [botId, setBotId] = useState(null);
  const [botInfo, setBotInfo] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteFields, setQuoteFields] = useState([]);
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
      const response = await Chatbot.post('/api/embed/conversations', {
        embedKey,
        visitorId,
      });

      if (response.data?.success) {
        const { conversationId: convId, botId: bid, welcomeMessage } = response.data.data;
        setConversationId(convId);
        setBotId(bid);
        setMessages([{ role: 'assistant', content: welcomeMessage, _id: '0' }]);

        // Cargar campos de cotización
        await fetchQuoteFields();
      } else {
        setMessages([{
          role: 'assistant',
          content: '❌ ' + (response.data?.message || 'Error iniciando la conversación'),
          _id: 'error-0'
        }]);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      setMessages([{
        role: 'assistant',
        content: '❌ Error iniciando la conversación. Por favor, intenta más tarde.',
        _id: 'error-0'
      }]);
    }
  };

  const fetchQuoteFields = async () => {
    try {
      const response = await Chatbot.get(`/api/embed/quote-fields?embedKey=${embedKey}`);
      if (response.data?.success) {
        setQuoteFields(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching quote fields:', error);
    }
  };

  const handleRequestQuote = () => {
    setShowQuoteModal(true);
  };

  const handleQuoteSubmit = async (formData) => {
    try {
      const response = await Chatbot.post('/api/embed/quote', {
        conversationId,
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
        currency: 'CLP',
        customerData: formData
      });

      if (response.data?.success) {
        setMessages(prev => [...prev, {
          role: 'system',
          content: `✅ Cotización #${response.data.data.quote.quoteNumber} creada exitosamente. Te enviaremos los detalles al email proporcionado.`,
          _id: 'quote-success-' + Date.now(),
        }]);
        setShowQuoteModal(false);
      } else {
        setMessages(prev => [...prev, {
          role: 'system',
          content: '❌ Error al crear la cotización: ' + (response.data?.message || 'Error desconocido'),
          _id: 'quote-error-' + Date.now(),
        }]);
      }
    } catch (error) {
      console.error('Error requesting quote:', error);
      setMessages(prev => [...prev, {
        role: 'system',
        content: '❌ Error al procesar tu solicitud de cotización.',
        _id: 'quote-error-' + Date.now(),
      }]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !conversationId || !botId) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      _id: Date.now().toString(),
    }]);

    setLoading(true);

    try {
      const response = await Chatbot.post('/api/embed/messages', {
        conversationId,
        content: userMessage,
        botId,
      });

      if (response.data?.success) {
        const botMessage = response.data.data.botMessage;
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: botMessage.content,
          _id: botMessage._id,
        }]);

        // Si hay warning (e.g., appointment sin Google Calendar, WhatsApp no configurado)
        if (response.data?.warning && response.data?.warningMessage) {
          setTimeout(() => {
            setMessages(prev => [...prev, {
              role: 'system',
              content: response.data.warningMessage,
              _id: 'warning-' + Date.now(),
            }]);
          }, 500);
        }
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '❌ ' + (response.data?.message || 'Error procesando tu mensaje'),
          _id: 'error-' + Date.now(),
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Error enviando tu mensaje. Por favor, intenta de nuevo.',
        _id: 'error-' + Date.now(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleOpen = () => {
    isOpenSet(true);
    if (messages.length === 0) {
      startConversation();
    }
  };

  return (
    <div className={`zapien-widget ${isOpen ? 'open' : 'closed'} position-${position}`}>
      {/* Chat Window */}
      {isOpen && (
        <div className="zapien-chat-window">
          {/* Header */}
          <div className="zapien-header">
            <div className="zapien-header-content">
              <div className="zapien-bot-name">
                {botInfo?.personality?.welcomeMessage ? '🤖 Asistente' : 'Zapien Chat'}
              </div>
              <div className="zapien-bot-status">En línea</div>
            </div>
            <button
              className="zapien-close-btn"
              onClick={() => isOpenSet(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages Container */}
          <div className="zapien-messages">
            {messages.map(msg => (
              <div
                key={msg._id}
                className={`zapien-message zapien-message-${msg.role}`}
              >
                <div className={`zapien-message-content ${msg.role === 'system' ? 'zapien-system-message' : ''}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="zapien-message zapien-message-assistant">
                <div className="zapien-typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quote Request Button */}
          {quoteFields.length > 0 && (
            <div style={{ padding: '8px 12px', borderTop: '1px solid #e0e0e0' }}>
              <button
                onClick={handleRequestQuote}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#e8e8e8'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#f0f0f0'}
              >
                📋 Solicitar Cotización
              </button>
            </div>
          )}

          {/* Input Area */}
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
            <button
              className="zapien-send-btn"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
              </svg>
            </button>
          </div>

          {/* Quote Modal */}
          <QuoteFormModal
            visible={showQuoteModal}
            onClose={() => setShowQuoteModal(false)}
            fields={quoteFields}
            onSubmit={handleQuoteSubmit}
            loading={loading}
          />
        </div>
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <button
          className="zapien-toggle-btn"
          onClick={handleOpen}
          aria-label="Open chat"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2 22l6-2.05C9.48 21.3 10.7 21.95 12 21.95c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
          </svg>
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
