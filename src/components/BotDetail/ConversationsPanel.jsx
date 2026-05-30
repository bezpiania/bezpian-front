import React, { useState } from 'react';
import { Spin, message } from 'antd';
import { useGetConversations, useGetConversationMessages } from '../../hooks/useConversation.js';

const ConversationsPanel = ({ workspaceId, botId }) => {
  const { data: response, isLoading } = useGetConversations(workspaceId, botId);
  const conversations = response?.data || [];
  const [selectedConversation, setSelectedConversation] = useState(null);
  const { data: messagesResponse, isLoading: messagesLoading } = useGetConversationMessages(
    workspaceId,
    botId,
    selectedConversation?._id
  );
  const messages = messagesResponse?.data || [];

  if (selectedConversation) {
    return (
      <>
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            className="btn btn-sm"
            onClick={() => setSelectedConversation(null)}
            style={{ background: 'var(--rule)', border: 'none', color: 'var(--carbon)' }}
          >
            <svg style={{ width: 12, height: 12, marginRight: 4 }}>
              <use href="#i-arrow-left" />
            </svg>
            Volver
          </button>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16 }}>
              Conversación con {selectedConversation.visitorId}
            </div>
            <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>
              {new Date(selectedConversation.createdAt).toLocaleDateString('es-CL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </div>

        <div
          className="card"
          style={{
            padding: '16px',
            height: '500px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            background: 'var(--bone-2)',
          }}
        >
          {messagesLoading ? (
            <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
              <Spin />
            </div>
          ) : messages.length === 0 ? (
            <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
              <div style={{ textAlign: 'center', opacity: 0.6 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 8 }}>
                  Sin mensajes
                </div>
                <div style={{ fontSize: 12, fontStyle: 'italic' }}>
                  Esta conversación no tiene mensajes.
                </div>
              </div>
            </div>
          ) : (
            messages.map(msg => (
              <div
                key={msg._id}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  gap: 8,
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    padding: '10px 14px',
                    borderRadius: 12,
                    background:
                      msg.role === 'user'
                        ? 'var(--voltage)'
                        : 'var(--carbon)',
                    color: msg.role === 'user' ? '#fff' : 'var(--bone)',
                    wordWrap: 'break-word',
                  }}
                >
                  <div style={{ fontSize: 13, lineHeight: 1.4 }}>
                    {msg.content}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      marginTop: 6,
                      opacity: 0.7,
                    }}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString('es-CL', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="section-head">
        <div>
          <div className="section-num">Conversaciones</div>
          <div className="section-title">Historial de chats con <em>tus visitantes</em></div>
        </div>
        {conversations.length > 0 && (
          <div style={{ fontSize: 12, opacity: 0.6 }}>
            Total: <strong>{conversations.length}</strong>
          </div>
        )}
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin />
        </div>
      ) : conversations.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <svg style={{ width: 48, height: 48, opacity: 0.3, marginBottom: 16 }}>
            <use href="#i-chat" />
          </svg>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, marginBottom: 8 }}>
            Sin conversaciones
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', opacity: 0.6 }}>
            Las conversaciones aparecerán cuando visitantes interactúen con el widget.
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
          {conversations.map(conv => (
            <div
              key={conv._id}
              className="card"
              onClick={() => setSelectedConversation(conv)}
              style={{
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14 }}>
                  {conv.visitorId === 'anonymous' ? 'Anónimo' : conv.visitorId}
                </div>
                <div
                  style={{
                    background: conv.status === 'active' ? 'var(--forest-light)' : 'var(--rule)',
                    color: conv.status === 'active' ? 'var(--forest)' : 'var(--carbon)',
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {conv.status === 'active' ? 'Activa' : 'Cerrada'}
                </div>
              </div>

              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12 }}>
                <div>{conv.messageCount || 0} mensajes</div>
                <div style={{ marginTop: 4 }}>
                  {new Date(conv.createdAt).toLocaleDateString('es-CL')}
                </div>
              </div>

              <button
                className="btn btn-sm"
                style={{
                  width: '100%',
                  background: 'var(--voltage)',
                  color: '#fff',
                  border: 'none',
                  fontSize: 12,
                }}
                onClick={() => setSelectedConversation(conv)}
              >
                Ver conversación
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ConversationsPanel;
