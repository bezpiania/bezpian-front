import React, { useState } from 'react';
import { message, Modal } from 'antd';
import Chatbot from '../../services/Chatbot.js';

const IntegrationCard = ({ icon, title, description, connected, onConnect, onDisconnect, loading, onConfigure }) => (
  <div
    className="card"
    style={{
      padding: '20px',
      border: connected ? '2px solid var(--forest)' : '1px solid var(--rule)',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'start', gap: 16, marginBottom: 16 }}>
      <div
        style={{
          width: 48,
          height: 48,
          background: connected ? 'var(--forest-light)' : 'var(--bone-2)',
          borderRadius: 10,
          display: 'grid',
          placeItems: 'center',
          color: connected ? 'var(--forest)' : 'var(--carbon)',
        }}
      >
        <svg style={{ width: 24, height: 24 }}>
          <use href={icon} />
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
          {title}
        </div>
        <div style={{ fontSize: 13, opacity: 0.7, lineHeight: 1.4 }}>
          {description}
        </div>
      </div>
      <div
        style={{
          padding: '4px 12px',
          background: connected ? 'var(--forest-light)' : 'var(--bone-2)',
          color: connected ? 'var(--forest)' : 'var(--carbon)',
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 600,
          whiteSpace: 'nowrap',
        }}
      >
        {connected ? '✓ Conectado' : 'No conectado'}
      </div>
    </div>

    <div style={{ display: 'flex', gap: 8 }}>
      {connected ? (
        <>
          <button
            className="btn btn-sm"
            onClick={onConfigure}
            disabled={loading}
            style={{
              flex: 1,
              background: 'var(--voltage-light)',
              color: 'var(--voltage)',
              border: 'none',
              cursor: loading ? 'wait' : 'pointer',
            }}
          >
            Configurar
          </button>
          <button
            className="btn btn-sm"
            onClick={onDisconnect}
            disabled={loading}
            style={{
              flex: 1,
              background: 'var(--magma-light)',
              color: 'var(--magma)',
              border: 'none',
              cursor: loading ? 'wait' : 'pointer',
            }}
          >
            {loading ? '...' : 'Desconectar'}
          </button>
        </>
      ) : (
        <button
          className="btn btn-primary btn-sm"
          onClick={onConnect}
          disabled={loading}
          style={{
            flex: 1,
            cursor: loading ? 'wait' : 'pointer',
          }}
        >
          {loading ? '...' : 'Conectar'}
        </button>
      )}
    </div>
  </div>
);

const WhatsAppBusinessModal = ({ visible, onClose, onSave, loading }) => {
  const [form, setForm] = useState({
    businessAccountId: '',
    phoneNumberId: '',
    accessToken: '',
  });

  const handleSubmit = async () => {
    if (!form.businessAccountId || !form.phoneNumberId || !form.accessToken) {
      message.error('Completa todos los campos');
      return;
    }
    await onSave(form);
    setForm({ businessAccountId: '', phoneNumberId: '', accessToken: '' });
  };

  return (
    <Modal
      title="Configurar WhatsApp Business API"
      visible={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      <div style={{ display: 'grid', gap: 12 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: 13 }}>
            Business Account ID
          </label>
          <input
            type="text"
            className="input"
            placeholder="Ej: 12345678901234567"
            value={form.businessAccountId}
            onChange={(e) => setForm({ ...form, businessAccountId: e.target.value })}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: 13 }}>
            Phone Number ID
          </label>
          <input
            type="text"
            className="input"
            placeholder="Ej: 123456789012345"
            value={form.phoneNumberId}
            onChange={(e) => setForm({ ...form, phoneNumberId: e.target.value })}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: 13 }}>
            Access Token
          </label>
          <input
            type="password"
            className="input"
            placeholder="Tu token de acceso de WhatsApp Business API"
            value={form.accessToken}
            onChange={(e) => setForm({ ...form, accessToken: e.target.value })}
          />
        </div>
      </div>
    </Modal>
  );
};

const InstagramModal = ({ visible, onClose, onSave, loading }) => {
  const [form, setForm] = useState({
    instagramBusinessAccountId: '',
    accessToken: '',
  });

  const handleSubmit = async () => {
    if (!form.instagramBusinessAccountId || !form.accessToken) {
      message.error('Completa todos los campos');
      return;
    }
    await onSave(form);
    setForm({ instagramBusinessAccountId: '', accessToken: '' });
  };

  return (
    <Modal
      title="Configurar Instagram Business (Meta)"
      visible={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      <div style={{ display: 'grid', gap: 12 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: 13 }}>
            Instagram Business Account ID
          </label>
          <input
            type="text"
            className="input"
            placeholder="ID de tu cuenta de negocio"
            value={form.instagramBusinessAccountId}
            onChange={(e) => setForm({ ...form, instagramBusinessAccountId: e.target.value })}
          />
          <div style={{ fontSize: 11, color: 'var(--carbon-light)', marginTop: 4 }}>
            Encuentra esto en: Meta Business Suite → Configuración → Cuentas
          </div>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: 13 }}>
            Access Token (Meta)
          </label>
          <input
            type="password"
            className="input"
            placeholder="Token de acceso de Meta"
            value={form.accessToken}
            onChange={(e) => setForm({ ...form, accessToken: e.target.value })}
          />
          <div style={{ fontSize: 11, color: 'var(--carbon-light)', marginTop: 4 }}>
            Obtén esto en: Meta App Dashboard → Settings → Tokens
          </div>
        </div>
      </div>
    </Modal>
  );
};

const IntegrationsPanel = ({ workspaceId, botId, bot, onUpdate }) => {
  const [loading, setLoading] = React.useState({});
  const [whatsAppModal, setWhatsAppModal] = useState(false);
  const [instagramModal, setInstagramModal] = useState(false);

  const toggleLoading = (key) => {
    setLoading(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleWhatsAppBusinessSave = async (form) => {
    try {
      toggleLoading('whatsapp');
      await Chatbot.patch(`/api/workspaces/${workspaceId}/chatbots/${botId}`, {
        integrations: {
          ...bot.integrations,
          whatsapp: {
            enabled: true,
            provider: 'meta',
            businessAccountId: form.businessAccountId,
            phoneNumberId: form.phoneNumberId,
            accessToken: form.accessToken,
            connectedAt: new Date(),
          },
        },
      });
      message.success('WhatsApp Business API conectado exitosamente');
      setWhatsAppModal(false);
      onUpdate?.();
    } catch (error) {
      message.error('Error al guardar credenciales de WhatsApp Business API');
    } finally {
      toggleLoading('whatsapp');
    }
  };

  const handleInstagramSave = async (form) => {
    try {
      toggleLoading('instagram');
      await Chatbot.patch(`/api/workspaces/${workspaceId}/chatbots/${botId}`, {
        integrations: {
          ...bot.integrations,
          instagram: {
            enabled: true,
            instagramBusinessAccountId: form.instagramBusinessAccountId,
            accessToken: form.accessToken,
            connectedAt: new Date(),
          },
        },
      });
      message.success('Instagram conectado exitosamente');
      setInstagramModal(false);
      onUpdate?.();
    } catch (error) {
      message.error('Error al guardar credenciales de Instagram');
    } finally {
      toggleLoading('instagram');
    }
  };

  const handleDisconnectWhatsApp = async () => {
    try {
      toggleLoading('whatsapp');
      await Chatbot.patch(`/api/workspaces/${workspaceId}/chatbots/${botId}`, {
        integrations: {
          ...bot.integrations,
          whatsapp: { enabled: false },
        },
      });
      message.success('WhatsApp desconectado');
      onUpdate?.();
    } catch (error) {
      message.error('Error al desconectar');
    } finally {
      toggleLoading('whatsapp');
    }
  };

  const handleDisconnectInstagram = async () => {
    try {
      toggleLoading('instagram');
      await Chatbot.patch(`/api/workspaces/${workspaceId}/chatbots/${botId}`, {
        integrations: {
          ...bot.integrations,
          instagram: { enabled: false },
        },
      });
      message.success('Instagram desconectado');
      onUpdate?.();
    } catch (error) {
      message.error('Error al desconectar');
    } finally {
      toggleLoading('instagram');
    }
  };

  // Advertencias de integraciones faltantes
  const showWhatsAppWarning = bot?.features?.chat && !bot?.integrations?.whatsapp?.enabled;
  const showInstagramWarning = bot?.features?.chat && !bot?.integrations?.instagram?.enabled;

  return (
    <>
      <div className="section-head">
        <div>
          <div className="section-num">Canales</div>
          <div className="section-title">Configura dónde <em>interactúan tus clientes</em> con el chatbot</div>
        </div>
      </div>

      {/* Advertencia de canales faltantes */}
      {(showWhatsAppWarning || showInstagramWarning) && (
        <div style={{
          padding: '16px',
          background: '#fffacd',
          border: '2px solid #ffd700',
          borderRadius: 'var(--border-radius)',
          marginBottom: 16,
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, marginBottom: 8, color: '#cc6600' }}>
            ⚠️ Canales Pendientes
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.6, color: '#666' }}>
            {showWhatsAppWarning && (
              <div style={{ marginBottom: 8 }}>
                💬 <strong>WhatsApp Business API no configurado:</strong> Tu chatbot no podrá responder mensajes de WhatsApp Business. Los clientes verán un mensaje de error si intentan contactarte.
              </div>
            )}
            {showInstagramWarning && (
              <div>
                📸 <strong>Instagram no configurado:</strong> Tu chatbot no podrá responder mensajes de Instagram.
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: 16 }}>
        <IntegrationCard
          icon="#i-whatsapp"
          title="WhatsApp Business API"
          description="Responde mensajes de WhatsApp automáticamente usando WhatsApp Business API oficial de Meta."
          connected={bot?.integrations?.whatsapp?.enabled}
          onConnect={() => setWhatsAppModal(true)}
          onDisconnect={handleDisconnectWhatsApp}
          onConfigure={() => setWhatsAppModal(true)}
          loading={loading.whatsapp}
        />

        <IntegrationCard
          icon="#i-instagram"
          title="Instagram (Meta)"
          description="Responde mensajes de Instagram automáticamente usando Meta Business Platform."
          connected={bot?.integrations?.instagram?.enabled}
          onConnect={() => setInstagramModal(true)}
          onDisconnect={handleDisconnectInstagram}
          onConfigure={() => setInstagramModal(true)}
          loading={loading.instagram}
        />
      </div>

      <WhatsAppBusinessModal
        visible={whatsAppModal}
        onClose={() => setWhatsAppModal(false)}
        onSave={handleWhatsAppBusinessSave}
        loading={loading.whatsapp}
      />

      <InstagramModal
        visible={instagramModal}
        onClose={() => setInstagramModal(false)}
        onSave={handleInstagramSave}
        loading={loading.instagram}
      />

      <GuideSection />
    </>
  );
};

const GuideSection = () => (
  <div style={{ marginTop: 32 }}>
    <div className="section-head">
      <div>
        <div className="section-num">Guía de configuración</div>
        <div className="section-title">Cómo obtener tus <em>credenciales</em></div>
      </div>
    </div>

    <div style={{ display: 'grid', gap: 16 }}>
      {/* WhatsApp */}
      <details style={{ padding: '16px', border: '1px solid var(--rule)', borderRadius: 'var(--border-radius)' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600, userSelect: 'none' }}>
          💬 WhatsApp Business API
        </summary>
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--rule-strong)', fontSize: 13, lineHeight: 1.6, opacity: 0.8 }}>
          <ol style={{ marginLeft: 20 }}>
            <li><strong>1. Configurar WhatsApp Business:</strong>
              <br />• Ve a <a href="https://developers.facebook.com/" target="_blank" rel="noopener noreferrer">developers.facebook.com</a>
              <br />• Crea una app de tipo Business
            </li>
            <li><strong>2. Obtener credenciales:</strong>
              <br />• Business Account ID: Facebook Business Manager
              <br />• Phone Number ID: WhatsApp → Configuración
              <br />• Access Token: Settings → Tokens de acceso de sistema
            </li>
            <li><strong>3. Conectar en Pielo:</strong>
              <br />• Haz clic en "Conectar"
              <br />• Completa los 3 campos
              <br />• ¡Listo!
            </li>
          </ol>
        </div>
      </details>

      {/* Meta */}
      <details style={{ padding: '16px', border: '1px solid var(--rule)', borderRadius: 'var(--border-radius)' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600, userSelect: 'none' }}>
          📸 Instagram (Meta Business)
        </summary>
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--rule-strong)', fontSize: 13, lineHeight: 1.6, opacity: 0.8 }}>
          <ol style={{ marginLeft: 20 }}>
            <li><strong>1. Crear Meta Business Account:</strong>
              <br />• Ve a <a href="https://business.facebook.com" target="_blank" rel="noopener noreferrer">business.facebook.com</a>
              <br />• Crea una cuenta de negocio (vincula tu Instagram)
            </li>
            <li><strong>2. Conectar Instagram:</strong>
              <br />• Settings → Instagram Accounts
              <br />• Conecta tu cuenta de Instagram de negocio
            </li>
            <li><strong>3. Obtener credenciales:</strong>
              <br />• Business Account ID: Settings → Business Settings → Account Details
              <br />• Access Token: Apps → Crear app → App type: Business
              <br />• Ve a Tools → Meta App Manager
              <br />• Genera un Access Token con permisos: instagram_basic, instagram_manage_messages
            </li>
            <li><strong>4. Conectar en Pielo:</strong>
              <br />• Haz clic en "Conectar"
              <br />• Completa los 2 campos
              <br />• ¡Listo!
            </li>
          </ol>
        </div>
      </details>
    </div>
  </div>
);

export default IntegrationsPanel;
