import React, { useState, useRef, useEffect } from 'react';
import { generateFullChatHtml } from '../../../utils/generateFullChatHtml.js';
import { generateBubbleWidgetHtml } from '../../../utils/generateBubbleWidgetHtml.js';
import { generateVoiceWidgetHtml } from '../../../utils/generateVoiceWidgetHtml.js';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Spin, message, Modal } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import AppLayout from '../../../components/AppLayout.jsx';
import { useGetChatbot, useUpdateChatbot, useActivateChatbot, usePauseChatbot, useDeleteChatbot } from '../../../hooks/useChatbot.js';
import { useGetDocuments, useUploadDocument, useDeleteDocument } from '../../../hooks/useDocument.js';
import { useGetProducts, useSyncProducts } from '../../../hooks/useProduct.js';
import Chatbot from '../../../services/Chatbot.js';
import LeadsPanel from '../../../components/BotDetail/LeadsPanel.jsx';
import QuotesPanel from '../../../components/BotDetail/QuotesPanel.jsx';
import AppointmentsPanel from '../../../components/BotDetail/AppointmentsPanel.jsx';
import SalesPanel from '../../../components/BotDetail/SalesPanel.jsx';
import IntegrationsPanel from '../../../components/BotDetail/IntegrationsPanel.jsx';
import WoocommercePanel from '../../../components/BotDetail/WoocommercePanel.jsx';
import AddProductModal from '../../../components/BotDetail/AddProductModal.jsx';
import ImportCSVModal from '../../../components/BotDetail/ImportCSVModal.jsx';
import CompanyInfoForm from '../../../components/BotDetail/CompanyInfoForm.jsx';
import ChatbotInstructionsForm from '../../../components/BotDetail/ChatbotInstructionsForm.jsx';
import DashboardBrandPanel from '../../../components/BotDetail/DashboardBrandPanel.jsx';
import { getBusinessType } from '../../../config/businessTypes.js';
import { getPlanConfig } from '../../../config/plans.js';

/**
 * Detalle de bot · 05
 * Pestañas (Configuración / Conocimiento / Catálogo / Apariencia / Embed),
 * cards de config, toggles de capacidades y zona de peligro.
 */
const Toggle = ({ on }) => (
  <div
    style={{
      width: 36,
      height: 22,
      background: on ? 'var(--carbon)' : 'var(--rule-strong)',
      borderRadius: 999,
      position: 'relative',
      cursor: 'pointer',
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: 3,
        [on ? 'right' : 'left']: 3,
        width: 16,
        height: 16,
        background: on ? 'var(--voltage)' : 'var(--bone)',
        borderRadius: '50%',
      }}
    />
  </div>
);

const Capability = ({ icon, title, hint, on, onClick, disabled }) => (
  <div
    onClick={!disabled ? onClick : undefined}
    style={{
      background: on ? 'var(--bone)' : 'var(--bone-2)',
      border: `1px solid ${on ? 'var(--carbon)' : 'var(--rule)'}`,
      borderRadius: 11,
      padding: '14px 18px',
      display: 'grid',
      gridTemplateColumns: '36px 1fr auto',
      gap: 12,
      alignItems: 'center',
      cursor: !disabled ? 'pointer' : 'default',
      transition: 'all 0.2s ease',
      opacity: disabled ? 0.5 : 1,
    }}
  >
    <div style={{ width: 36, height: 36, background: on ? 'var(--voltage)' : 'var(--bone)', borderRadius: 9, display: 'grid', placeItems: 'center' }}>
      <svg style={{ width: 18, height: 18 }}><use href={icon} /></svg>
    </div>
    <div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14 }}>{title}</div>
      <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 12.5, opacity: 0.65 }}>{hint}</div>
    </div>
    <Toggle on={on} />
  </div>
);

const TabBtn = ({ active, children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      background: 'transparent',
      border: 'none',
      padding: '11px 16px',
      fontFamily: 'var(--font-display)',
      fontWeight: active ? 600 : 500,
      fontSize: 14,
      cursor: 'pointer',
      borderBottom: active ? '2px solid var(--carbon)' : '2px solid transparent',
      color: 'var(--carbon)',
      opacity: active ? 1 : 0.5,
    }}
  >
    {children}
  </button>
);

const BotDetail = () => {
  const { id } = useParams();
  const workspaceId = localStorage.getItem('workspaceId');
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('config');
  const [productMethod, setProductMethod] = useState('manual');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showImportCSVModal, setShowImportCSVModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const fileInputRef = useRef(null);

  const refetchProducts = () => {
    queryClient.invalidateQueries({ queryKey: ['products', workspaceId, id] });
  };

  const { data: response, isLoading, error } = useGetChatbot(workspaceId, id);
  const bot = response?.data?.data || response?.data || null;
  const bizConfig = getBusinessType(bot?.businessType);

  const { data: docsResponse, isLoading: docsLoading } = useGetDocuments(workspaceId, id);
  const documents = docsResponse?.data?.data || docsResponse?.data || [];

  const { mutate: uploadDocument, isPending: isUploading } = useUploadDocument(workspaceId, id);
  const { mutate: deleteDocument } = useDeleteDocument(workspaceId, id);

  const { data: productsResponse, isLoading: productsLoading } = useGetProducts(workspaceId, id);
  const products = productsResponse?.data?.data || productsResponse?.data || [];

  const { mutate: syncProducts, isPending: isSyncing } = useSyncProducts(workspaceId, id);

  const { mutate: updateChatbot, isPending: isUpdating } = useUpdateChatbot();
  const navigate = useNavigate();
  const { mutate: activateBot } = useActivateChatbot();
  const { mutate: pauseBot } = usePauseChatbot();
  const { mutate: deleteBot, isPending: isDeleting } = useDeleteChatbot();

  const handleTogglePause = () => {
    const active = bot?.status === 'active';
    const fn = active ? pauseBot : activateBot;
    fn({ workspaceId, id }, {
      onSuccess: () => message.success(active ? 'Chatbot pausado' : 'Chatbot reactivado'),
      onError: (e) => message.error(e?.response?.data?.message || 'No se pudo cambiar el estado'),
    });
  };

  const handleDelete = () => {
    Modal.confirm({
      title: `¿Eliminar "${bot?.name}"?`,
      content: 'Se borrarán todas sus conversaciones, leads y cotizaciones. Esta acción no se puede deshacer.',
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: () => new Promise((resolve, reject) => {
        deleteBot({ workspaceId, id }, {
          onSuccess: () => { message.success('Chatbot eliminado'); navigate('/bots'); resolve(); },
          onError: (e) => { message.error(e?.response?.data?.message || 'No se pudo eliminar'); reject(); },
        });
      }),
    });
  };

  const [configForm, setConfigForm] = useState({
    name: bot?.name || '',
    customPrompt: bot?.personality?.customPrompt || '',
    tone: bot?.personality?.tone || 'Neutral',
    welcomeMessage: bot?.personality?.welcomeMessage || ''
  });

  const [appearanceForm, setAppearanceForm] = useState({
    color: bot?.widget?.color || '#DCFF1E',
    position: bot?.widget?.position || 'bottom-right',
    avatar: bot?.widget?.avatar || '🤖',
    proactiveMessage: bot?.widget?.proactiveMessage || '',
    proactiveDelaySeconds: bot?.widget?.proactiveDelaySeconds || 0,
    pattern: bot?.widget?.pattern || 'dots',
    patternOpacity: bot?.widget?.patternOpacity ?? 0.45,
  });

  const [voiceVoice, setVoiceVoice] = useState('alloy');

  const [embedCode, setEmbedCode]       = useState('');
  const [loadingEmbed, setLoadingEmbed] = useState(false);
  const [fullChatCode, setFullChatCode] = useState('');
  const [loadingFull, setLoadingFull]   = useState(false);
  const [copiedFull, setCopiedFull]     = useState(false);

  const [openaiForm, setOpenaiForm] = useState({
    openaiApiKey: '',
    openaiModel: 'gpt-3.5-turbo',
    openaiSettings: {
      temperature: 0.7,
      maxTokens: 500,
      topP: 1,
    },
    hasApiKey: false
  });
  const [savingOpenai, setSavingOpenai] = useState(false);

  useEffect(() => {
    if (bot) {
      setConfigForm({
        name: bot.name || '',
        customPrompt: bot.personality?.customPrompt || '',
        tone: bot.personality?.tone || 'Neutral',
        welcomeMessage: bot.personality?.welcomeMessage || ''
      });
      setAppearanceForm({
        color: bot.widget?.color || '#DCFF1E',
        position: bot.widget?.position || 'bottom-right',
        avatar: bot.widget?.avatar || '🤖',
        proactiveMessage: bot.widget?.proactiveMessage || '',
        proactiveDelaySeconds: bot.widget?.proactiveDelaySeconds || 0,
        pattern: bot.widget?.pattern || 'dots',
        patternOpacity: bot.widget?.patternOpacity ?? 0.45,
      });
      setVoiceVoice(bot.voiceSettings?.voice || 'alloy');
    }
  }, [bot]);

  const fetchOpenaiConfig = async () => {
    try {
      const response = await Chatbot.getOpenaiConfig(workspaceId, id);
      const configData = response.data?.data || response.data || response;

      if (configData?.openaiModel || configData?.success) {
        setOpenaiForm(prev => ({
          ...prev,
          openaiModel: configData.openaiModel || 'gpt-3.5-turbo',
          openaiSettings: {
            temperature: configData.openaiSettings?.temperature ?? 0.7,
            maxTokens: configData.openaiSettings?.maxTokens ?? 500,
            topP: configData.openaiSettings?.topP ?? 1
          },
          hasApiKey: configData.hasApiKey || false
        }));
      }
    } catch (error) {
      console.error('Error loading OpenAI config:', error);
    }
  };

  // Load OpenAI config when component mounts or id/workspaceId changes
  useEffect(() => {
    if (id && workspaceId) {
      fetchOpenaiConfig();
    }
  }, [id, workspaceId]);

  const handleConfigChange = (field, value) => {
    setConfigForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveConfig = () => {
    updateChatbot(
      {
        workspaceId,
        id,
        data: {
          name: configForm.name,
        }
      },
      {
        onSuccess: () => {
          message.success('Configuración guardada');
        },
        onError: (error) => {
          message.error(error?.response?.data?.message || 'Error al guardar');
        }
      }
    );
  };

  const handleAppearanceChange = (field, value) => {
    setAppearanceForm(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleFeature = (featureName) => {
    const newValue = !bot.features?.[featureName];
    const newFeatures = { ...bot.features, [featureName]: newValue };

    // Sync integrations flags with feature toggles
    const data = { features: newFeatures };
    if (featureName === 'appointments') {
      data.integrations = {
        ...bot.integrations,
        calendar: { ...(bot.integrations?.calendar || {}), enabled: newValue }
      };
    }

    updateChatbot(
      { workspaceId, id, data },
      {
        onSuccess: () => {
          message.success(`${featureName} ${newValue ? 'activado' : 'desactivado'}`);
          // Invalidate sidebar features cache so it re-renders immediately
          queryClient.invalidateQueries({ queryKey: ['bot-features', id] });
        },
        onError: (error) => {
          message.error(error?.response?.data?.message || 'Error al actualizar');
        }
      }
    );
  };

  const handleSaveAppearance = () => {
    updateChatbot(
      {
        workspaceId,
        id,
        data: {
          widget: {
            color: appearanceForm.color,
            position: appearanceForm.position,
            avatar: appearanceForm.avatar,
            proactiveMessage: appearanceForm.proactiveMessage,
            proactiveDelaySeconds: appearanceForm.proactiveDelaySeconds,
            pattern: appearanceForm.pattern,
            patternOpacity: appearanceForm.patternOpacity
          }
        }
      },
      {
        onSuccess: () => {
          message.success('Apariencia actualizada');
        },
        onError: (error) => {
          message.error(error?.response?.data?.message || 'Error al actualizar');
        }
      }
    );
  };

  const handleSaveVoice = (newVoice) => {
    setVoiceVoice(newVoice);
    updateChatbot(
      { workspaceId, id, data: { 'voiceSettings.voice': newVoice } },
      {
        onSuccess: () => message.success('Voz actualizada'),
        onError: (error) => message.error(error?.response?.data?.message || 'Error al actualizar la voz'),
      }
    );
  };

  const handleSaveOpenai = async () => {
    if (!openaiForm.openaiApiKey.trim() && !openaiForm.hasApiKey) {
      message.error('Por favor ingresa tu API key de OpenAI');
      return;
    }

    setSavingOpenai(true);
    try {
      const configUpdate = {
        openaiModel: openaiForm.openaiModel,
        openaiSettings: openaiForm.openaiSettings
      };

      // Solo incluir la API key si fue ingresada (no mantener la anterior silenciosamente)
      if (openaiForm.openaiApiKey.trim()) {
        configUpdate.openaiApiKey = openaiForm.openaiApiKey;
      }

      await Chatbot.updateOpenaiConfig(workspaceId, id, configUpdate);
      message.success('Configuración OpenAI guardada');
      // Recargar la configuración para reflejar el estado actualizado
      await fetchOpenaiConfig();
    } catch (error) {
      message.error(error?.response?.data?.message || 'Error al guardar configuración');
    } finally {
      setSavingOpenai(false);
    }
  };

  const handleLoadEmbed = async () => {
    setLoadingEmbed(true);
    try {
      const response = await Chatbot.getEmbedCode(workspaceId, id);
      setEmbedCode(response?.data?.embedCode || '');
    } catch (error) {
      message.error('Error al cargar código embed');
    } finally {
      setLoadingEmbed(false);
    }
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    message.success('Código copiado al portapapeles');
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadDocument(file, {
      onSuccess: () => {
        message.success('Documento cargado exitosamente');
        fileInputRef.current.value = '';
      },
      onError: (error) => {
        message.error(error?.response?.data?.message || 'Error al cargar documento');
      },
    });
  };

  const handleDeleteDocument = (docId) => {
    if (!window.confirm('¿Está seguro que desea eliminar este documento?')) return;
    deleteDocument(docId, {
      onSuccess: () => {
        message.success('Documento eliminado');
      },
      onError: (error) => {
        message.error(error?.response?.data?.message || 'Error al eliminar documento');
      },
    });
  };

  const handleSyncProducts = () => {
    syncProducts(undefined, {
      onSuccess: (response) => {
        message.success(response?.message || 'Productos sincronizados');
      },
      onError: (error) => {
        message.error(error?.response?.data?.message || 'Error al sincronizar productos');
      },
    });
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Spin size="large" />
        </div>
      </AppLayout>
    );
  }

  if (error || !bot) {
    return (
      <AppLayout>
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <h3>Error al cargar el chatbot</h3>
          <p>{error?.response?.data?.message || error?.message || 'Chatbot no encontrado'}</p>
        </div>
      </AppLayout>
    );
  }

  const statusColor = bot.status === 'active' ? 'green' : bot.status === 'paused' ? 'amber' : 'muted';

  return (
    <AppLayout>
      <div className="page-head with-halo">
        <div>
          <div className="page-eyebrow">
            <Link to="/chatbots" style={{ cursor: 'pointer', borderBottom: '1px solid var(--rule-strong)' }}>Chatbots</Link>
            <span className="dot"></span>
            <span>{bot.name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 6 }}>
            <div style={{ width: 54, height: 54, background: bot.widget?.color || '#DCFF1E', borderRadius: 14, display: 'grid', placeItems: 'center', fontSize: 26 }}>
              {bot.widget?.avatar || '🤖'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h1 className="page-title" style={{ fontSize: 32 }}>{bot.name}</h1>
                <span className={`pill ${statusColor}`}>
                  {bot.status === 'active' ? 'Activo' : bot.status === 'paused' ? 'Pausado' : 'Borrador'}
                </span>
                {bot.openaiError?.code === 'OPENAI_QUOTA_EXCEEDED' && (
                  <span className="pill red" style={{ marginLeft: 6 }}>
                    ⚠️ Sin créditos OpenAI — recarga tu cuenta en platform.openai.com
                  </span>
                )}
                {bot.openaiError?.code === 'OPENAI_INVALID_KEY' && (
                  <span className="pill red" style={{ marginLeft: 6 }}>
                    ⚠️ API key de OpenAI inválida — revisa la configuración
                  </span>
                )}
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 14, opacity: 0.7, marginTop: 2 }}>
                {bot.workspaceId} · creado el {new Date(bot.createdAt).toLocaleDateString('es-CL', { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost btn-sm" onClick={handleTogglePause}>
            <svg><use href={bot.status === 'active' ? '#i-pause' : '#i-play'} /></svg>
            {bot.status === 'active' ? 'Pausar' : 'Reactivar'}
          </button>
          <Link to={`/chatbots/${bot._id}/embed`} className="btn btn-primary btn-sm">
            <svg><use href="#i-copy" /></svg>Copiar embed
          </Link>
        </div>
      </div>

      <div className="page-body">
        {/* KPIs */}
        <div className="kpis">
          <div className="kpi voltage">
            <div className="kpi-label">Chats (7d)</div>
            <div className="kpi-value">{bot.stats?.totalConversations || 0}</div>
            <div></div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Cotizaciones</div>
            <div className="kpi-value">{bot.stats?.totalQuotes || 0}</div>
            <div></div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Leads capturados</div>
            <div className="kpi-value">{bot.stats?.totalLeads || 0}</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Citas agendadas</div>
            <div className="kpi-value">{bot.stats?.totalAppointments || 0}</div>
          </div>
        </div>

        {/* Tabs — dinámicas según businessType */}
        <div style={{ borderBottom: '1px solid var(--rule)', marginBottom: 24, display: 'flex', gap: 4, overflowX: 'auto' }}>
          {/* Pestañas siempre visibles */}
          <TabBtn active={tab === 'config'}        onClick={() => setTab('config')}>Configuración</TabBtn>
          <TabBtn active={tab === 'empresa'}       onClick={() => setTab('empresa')}>Empresa</TabBtn>
          <TabBtn active={tab === 'instrucciones'} onClick={() => setTab('instrucciones')}>Instrucciones</TabBtn>
          <TabBtn active={tab === 'openai'}        onClick={() => setTab('openai')}>OpenAI</TabBtn>
          <TabBtn active={tab === 'appearance'}    onClick={() => setTab('appearance')}>Apariencia</TabBtn>
          <TabBtn active={tab === 'embed'}         onClick={() => setTab('embed')}>Código embed</TabBtn>

          {/* Pestañas por módulo según businessType */}
          {bizConfig.modules.catalog && (
            <TabBtn active={tab === 'catalog'} onClick={() => setTab('catalog')}>
              {bizConfig.catalog.label}
            </TabBtn>
          )}
          {/* {bizConfig.modules.leads && (
            <TabBtn active={tab === 'leads'} onClick={() => setTab('leads')}>Leads</TabBtn>
          )} */}
          {bizConfig.modules.quotes && (
            <TabBtn active={tab === 'quotes'} onClick={() => setTab('quotes')}>Cotizaciones</TabBtn>
          )}
          {bizConfig.modules.appointments && (
            <TabBtn active={tab === 'appointments'} onClick={() => setTab('appointments')}>Agendamiento</TabBtn>
          )}
          {bizConfig.modules.sales && (
            <TabBtn active={tab === 'sales'} onClick={() => setTab('sales')}>Ventas</TabBtn>
          )}
          <TabBtn active={tab === 'integrations'} onClick={() => setTab('integrations')}>Canales</TabBtn>
        </div>

        {tab === 'empresa' && (
          <CompanyInfoForm workspaceId={workspaceId} botId={id} />
        )}

        {tab === 'instrucciones' && (
          <ChatbotInstructionsForm workspaceId={workspaceId} botId={id} />
        )}

        {tab === 'config' && (
          <>
            <div className="section-head">
              <div>
                <div className="section-num">Configuración general</div>
                <div className="section-title">Nombre, tono y <em>capacidades</em></div>
              </div>
            </div>

            <div className="card" style={{ maxWidth: 480 }}>
              <div className="section-num">Nombre del chatbot</div>
              <div className="field" style={{ marginTop: 12, marginBottom: 0 }}>
                <div className="field-label">Nombre</div>
                <input
                  type="text"
                  className="input"
                  value={configForm.name}
                  onChange={(e) => handleConfigChange('name', e.target.value)}
                />
                <small style={{ opacity: 0.5, marginTop: 4, display: 'block' }}>
                  El tono, mensajes y personalidad se configuran en la pestaña <strong>Instrucciones</strong>.
                </small>
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={handleSaveConfig}
              disabled={isUpdating}
              style={{ marginTop: 16 }}
            >
              {isUpdating ? 'Guardando...' : 'Guardar configuración'}
            </button>

            <div className="section-head" style={{ marginTop: 8 }}>
              <div>
                <div className="section-num">Capacidades activas</div>
                <div className="section-title">Lo que <em>hace tu bot</em></div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
              <Capability icon="#i-chat" title="Conversación general" hint="Siempre encendida" on disabled />
              <Capability icon="#i-quote" title="Cotizaciones" hint={`${bot.stats?.totalQuotes || 0} cotizaciones`} on={bot.features?.quotes || false} onClick={() => handleToggleFeature('quotes')} />
              <Capability icon="#i-cal" title="Agendamiento" hint={`${bot.stats?.totalAppointments || 0} citas`} on={bot.features?.appointments || false} onClick={() => handleToggleFeature('appointments')} />
              <Capability icon="#i-money" title="Ventas / Pedidos" hint={`${bot.stats?.totalOrders || 0} pedidos`} on={bot.features?.sales || false} onClick={() => handleToggleFeature('sales')} />
              {/* <Capability icon="#i-lead" title="Captura de leads" hint={`${bot.stats?.totalLeads || 0} leads`} on={bot.features?.leadCapture || false} onClick={() => handleToggleFeature('leadCapture')} /> */}
            </div>

            <div style={{ background: 'var(--bone-2)', border: '1px solid rgba(255, 77, 31, 0.3)', borderRadius: 12, padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14.5, color: 'var(--magma)' }}>Eliminar este chatbot</div>
                <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 13, opacity: 0.7, lineHeight: 1.4, marginTop: 2 }}>
                  Esta acción borra todas las conversaciones, leads y cotizaciones de {bot.name}. <em>No hay marcha atrás.</em>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" style={{ color: 'var(--magma)', borderColor: 'rgba(255, 77, 31, 0.3)' }} onClick={handleDelete} disabled={isDeleting}>
                <svg><use href="#i-trash" /></svg>{isDeleting ? 'Eliminando…' : 'Eliminar'}
              </button>
            </div>
          </>
        )}

        {tab === 'openai' && (
          <>
            <div className="section-head">
              <div>
                <div className="section-num">Configuración OpenAI</div>
                <div className="section-title">Inteligencia artificial <em>de tu chatbot</em></div>
              </div>
            </div>

            <div className="grid-2-eq">
              <div className="card">
                <div className="section-num">Credenciales</div>
                <div className="field" style={{ marginTop: 12 }}>
                  <div className="field-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    API Key de OpenAI
                    {openaiForm.hasApiKey && (
                      <span style={{ fontSize: '12px', color: '#4CAF50', fontWeight: 'normal' }}>
                        ✓ Configurada
                      </span>
                    )}
                  </div>
                  <input
                    type="password"
                    className="input"
                    placeholder={openaiForm.hasApiKey ? '••••••••••••••••' : 'sk-...'}
                    value={openaiForm.openaiApiKey}
                    onChange={(e) => setOpenaiForm(prev => ({ ...prev, openaiApiKey: e.target.value }))}
                  />
                  <small style={{ marginTop: 6, display: 'block', opacity: 0.7 }}>
                    {openaiForm.hasApiKey ? (
                      <>Deja en blanco para mantener la actual. Obtén tu clave en <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">platform.openai.com/api-keys</a></>
                    ) : (
                      <>Obtén tu clave en <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">platform.openai.com/api-keys</a></>
                    )}
                  </small>
                </div>
              </div>

              <div className="card">
                <div className="section-num">Modelo</div>
                <div className="field" style={{ marginTop: 12, marginBottom: 0 }}>
                  <div className="field-label">Selecciona modelo</div>
                  <select
                    className="select"
                    value={openaiForm.openaiModel}
                    onChange={(e) => setOpenaiForm(prev => ({ ...prev, openaiModel: e.target.value }))}
                  >
                    <option value="gpt-4o-mini">GPT-4o Mini (Rápido y económico) ⭐</option>
                    <option value="gpt-4o">GPT-4o (Más inteligente y rápido)</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Legado)</option>
                    <option value="gpt-4">GPT-4 (Legado)</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo (Legado)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid-2-eq">
              <div className="card">
                <div className="section-num">Parámetros</div>
                <div className="field" style={{ marginTop: 12 }}>
                  <div className="field-label">Temperatura: {openaiForm.openaiSettings.temperature.toFixed(1)}</div>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={openaiForm.openaiSettings.temperature}
                    onChange={(e) => setOpenaiForm(prev => ({
                      ...prev,
                      openaiSettings: { ...prev.openaiSettings, temperature: parseFloat(e.target.value) }
                    }))}
                    style={{ width: '100%' }}
                  />
                  <small style={{ marginTop: 6, display: 'block', opacity: 0.7 }}>Controla creatividad (0=determinista, 2=muy creativo)</small>
                </div>
              </div>

              <div className="card">
                <div className="section-num">Longitud</div>
                <div className="field" style={{ marginTop: 12 }}>
                  <div className="field-label">Máximo de tokens: {openaiForm.openaiSettings.maxTokens}</div>
                  <input
                    type="range"
                    min="50"
                    max="4000"
                    step="50"
                    value={openaiForm.openaiSettings.maxTokens}
                    onChange={(e) => setOpenaiForm(prev => ({
                      ...prev,
                      openaiSettings: { ...prev.openaiSettings, maxTokens: parseInt(e.target.value) }
                    }))}
                    style={{ width: '100%' }}
                  />
                  <small style={{ marginTop: 6, display: 'block', opacity: 0.7 }}>Máxima longitud de respuesta</small>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
              <button className="btn btn-primary" onClick={handleSaveOpenai} disabled={savingOpenai}>
                {savingOpenai ? 'Guardando...' : 'Guardar configuración'}
              </button>
            </div>
          </>
        )}

        {/* KB (Conocimiento) ya no se usa - la info viene de los campos de Empresa
        {tab === 'kb' && (
          <>
            <div className="section-head">
              <div>
                <div className="section-num">Base de conocimiento</div>
                <div className="section-title">Documentos que <em>lee tu bot</em></div>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <svg><use href="#i-upload" /></svg>
                {isUploading ? 'Cargando...' : 'Cargar documento'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
                accept=".pdf,.txt,.doc,.docx"
              />
            </div>

            {docsLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Spin />
              </div>
            ) : documents.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, marginBottom: 8 }}>
                  Sin documentos cargados
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', opacity: 0.6, marginBottom: 16 }}>
                  Carga documentos para que el bot pueda acceder a tu base de conocimiento.
                </div>
                <button
                  className="btn btn-voltage"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <svg><use href="#i-upload" /></svg>
                  Cargar primer documento
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 10 }}>
                {documents.map((doc) => (
                  <div
                    key={doc._id}
                    style={{
                      background: 'var(--bone)',
                      border: '1px solid var(--rule)',
                      borderRadius: 11,
                      padding: '14px 18px',
                      display: 'grid',
                      gridTemplateColumns: '40px 1fr auto',
                      gap: 12,
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        background: 'var(--bone-2)',
                        borderRadius: 8,
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <svg style={{ width: 20, height: 20 }}>
                        <use href="#i-file" />
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14 }}>
                        {doc.filename}
                      </div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, opacity: 0.6, marginTop: 2 }}>
                        {doc.sizeBytes ? `${(doc.sizeBytes / 1024).toFixed(2)} KB` : 'Tamaño desconocido'} · Estado:{' '}
                        <span
                          style={{
                            fontWeight: 600,
                            color:
                              doc.status === 'ready'
                                ? 'var(--forest)'
                                : doc.status === 'processing'
                                  ? 'var(--voltage)'
                                  : doc.status === 'failed'
                                    ? 'var(--magma)'
                                    : 'var(--carbon)',
                          }}
                        >
                          {doc.status === 'ready'
                            ? 'Listo'
                            : doc.status === 'processing'
                              ? 'Procesando'
                              : doc.status === 'failed'
                                ? 'Error'
                                : 'Subiendo'}
                        </span>
                      </div>
                    </div>
                    {doc.status === 'ready' && (
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleDeleteDocument(doc._id)}
                      >
                        <svg><use href="#i-trash" /></svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        */}

        {tab === 'catalog' && (
          <>
            <div className="section-head">
              <div>
                <div className="section-num">Catálogo de productos</div>
                <div className="section-title">Productos que <em>vende tu bot</em></div>
              </div>
            </div>

            {/* PASO 1: Selector de método de carga (Botones) */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 32, padding: '6px', background: 'var(--bone)', borderRadius: 10, width: 'fit-content' }}>
              <button
                onClick={() => setProductMethod('manual')}
                style={{
                  padding: '10px 18px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: productMethod === 'manual' ? 600 : 500,
                  fontSize: 14,
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  background: productMethod === 'manual' ? 'var(--carbon)' : 'transparent',
                  color: productMethod === 'manual' ? 'var(--voltage)' : 'var(--carbon)',
                  transition: 'all 0.2s ease',
                }}
              >
                📝 Manual
              </button>

              <button
                onClick={() => setProductMethod('csv')}
                style={{
                  padding: '10px 18px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: productMethod === 'csv' ? 600 : 500,
                  fontSize: 14,
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  background: productMethod === 'csv' ? 'var(--carbon)' : 'transparent',
                  color: productMethod === 'csv' ? 'var(--voltage)' : 'var(--carbon)',
                  transition: 'all 0.2s ease',
                }}
              >
                📥 CSV
              </button>

              <button
                onClick={() => setProductMethod('woocommerce')}
                style={{
                  padding: '10px 18px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: productMethod === 'woocommerce' ? 600 : 500,
                  fontSize: 14,
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  background: productMethod === 'woocommerce' ? 'var(--carbon)' : 'transparent',
                  color: productMethod === 'woocommerce' ? 'var(--voltage)' : 'var(--carbon)',
                  transition: 'all 0.2s ease',
                }}
              >
                🛒 WooCommerce
              </button>
            </div>

            {/* PASO 2: Contenido según el método */}
            {productMethod === 'manual' && (
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, opacity: 0.6, marginBottom: 16 }}>
                  Crea productos de forma manual, uno a uno
                </div>
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <svg style={{ width: 18, height: 18 }}><use href="#i-plus" /></svg>
                  Agregar Producto
                </button>
              </div>
            )}

            {productMethod === 'csv' && (
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, opacity: 0.6, marginBottom: 16 }}>
                  Importa múltiples productos desde un archivo CSV
                </div>
                <button
                  onClick={() => setShowImportCSVModal(true)}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <svg style={{ width: 18, height: 18 }}><use href="#i-download" /></svg>
                  Importar CSV
                </button>
              </div>
            )}

            {productMethod === 'woocommerce' && (
              <WoocommercePanel workspaceId={workspaceId} botId={id} />
            )}

            {/* PASO 3: Grid de productos */}
            {productsLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Spin />
              </div>
            ) : products.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, marginBottom: 8 }}>
                  Sin productos cargados
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', opacity: 0.6, marginBottom: 16 }}>
                  {bot?.productLoadingMethod === 'manual' || !bot?.productLoadingMethod
                    ? 'Crea o importa productos para que el bot pueda recomendarlos.'
                    : 'Sincroniza tu catálogo para que el bot pueda recomendar productos.'}
                </div>
                <button
                  className="btn btn-voltage"
                  onClick={handleSyncProducts}
                  disabled={isSyncing}
                >
                  <svg><use href="#i-refresh" /></svg>
                  {isSyncing ? 'Sincronizando...' : 'Sincronizar catálogo'}
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                {products.map((product) => (
                  <div
                    key={product._id}
                    style={{
                      background: 'var(--bone)',
                      border: '1px solid var(--rule)',
                      borderRadius: 12,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {product.images?.[0] ? (
                      <div
                        style={{
                          height: 140,
                          background: 'var(--bone-2)',
                          backgroundImage: `url(${product.images[0]})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          height: 140,
                          background: 'var(--bone-2)',
                          display: 'grid',
                          placeItems: 'center',
                          color: 'var(--rule-strong)',
                        }}
                      >
                        <svg style={{ width: 40, height: 40 }}>
                          <use href="#i-box" />
                        </svg>
                      </div>
                    )}
                    <div style={{ padding: '14px' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                        {product.name}
                      </div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, opacity: 0.6, marginBottom: 8, lineHeight: 1.3 }}>
                        {product.description || 'Sin descripción'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>
                          ${product.price?.toLocaleString('es-CL') || '0'}
                        </div>
                        <div
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 11,
                            padding: '2px 8px',
                            background: product.stock > 0 ? 'var(--forest-light)' : 'var(--magma-light)',
                            color: product.stock > 0 ? 'var(--forest)' : 'var(--magma)',
                            borderRadius: 6,
                            fontWeight: 600,
                          }}
                        >
                          {product.stock > 0 ? `${product.stock} en stock` : 'Sin stock'}
                        </div>
                      </div>
                      <button
                        onClick={() => setEditingProduct(product)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          background: 'var(--carbon)',
                          color: 'var(--bone)',
                          border: 'none',
                          borderRadius: 6,
                          fontFamily: 'var(--font-display)',
                          fontWeight: 600,
                          fontSize: 12,
                          cursor: 'pointer',
                        }}
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Modales para agregar/editar productos */}
            <AddProductModal
              visible={showAddProductModal || !!editingProduct}
              onClose={() => {
                setShowAddProductModal(false);
                setEditingProduct(null);
              }}
              workspaceId={workspaceId}
              chatbotId={id}
              editingProduct={editingProduct}
              businessType={bot?.businessType}
              onSuccess={() => {
                setShowAddProductModal(false);
                setEditingProduct(null);
                refetchProducts();
              }}
            />

            <ImportCSVModal
              visible={showImportCSVModal}
              onClose={() => setShowImportCSVModal(false)}
              workspaceId={workspaceId}
              chatbotId={id}
              onSuccess={() => {
                setShowImportCSVModal(false);
                refetchProducts();
              }}
            />
          </>
        )}

        {tab === 'appearance' && (
          <>
            {getPlanConfig(localStorage.getItem('workspacePlan') || 'free').manager && (
              <DashboardBrandPanel workspaceId={workspaceId} botId={id} />
            )}
            <div className="section-head">
              <div>
                <div className="section-num">Personalizacion visual</div>
                <div className="section-title">Cómo se ve tu <em>bot</em></div>
              </div>
            </div>

            <div className="grid-2-eq">
              <div className="card">
                <div className="section-num">Colores y posición</div>

                <div className="field" style={{ marginTop: 12 }}>
                  <div className="field-label">Color principal</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      type="color"
                      value={appearanceForm.color}
                      onChange={(e) => handleAppearanceChange('color', e.target.value)}
                      style={{ width: 50, height: 40, border: 'none', borderRadius: 8, cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      value={appearanceForm.color}
                      onChange={(e) => handleAppearanceChange('color', e.target.value)}
                      className="input"
                      placeholder="#DCFF1E"
                    />
                  </div>
                </div>

                <div className="field">
                  <div className="field-label">Posición en pantalla</div>
                  <select
                    className="select"
                    value={appearanceForm.position}
                    onChange={(e) => handleAppearanceChange('position', e.target.value)}
                  >
                    <option value="bottom-right">Abajo a la derecha</option>
                    <option value="bottom-left">Abajo a la izquierda</option>
                    <option value="top-right">Arriba a la derecha</option>
                    <option value="top-left">Arriba a la izquierda</option>
                  </select>
                </div>
              </div>

              <div className="card">
                <div className="section-num">Identidad del bot</div>

                <div className="field" style={{ marginTop: 12 }}>
                  <div className="field-label">Avatar (emoji)</div>
                  <input
                    type="text"
                    value={appearanceForm.avatar}
                    onChange={(e) => handleAppearanceChange('avatar', e.target.value)}
                    className="input"
                    placeholder="🤖"
                    maxLength="2"
                  />
                </div>

                <div className="field" style={{ marginBottom: 0 }}>
                  <div className="field-label">Mensaje de bienvenida proactivo</div>
                  <textarea
                    className="textarea"
                    value={appearanceForm.proactiveMessage}
                    onChange={(e) => handleAppearanceChange('proactiveMessage', e.target.value)}
                    placeholder="¿En qué te puedo ayudar?"
                  />
                </div>

                <div className="field">
                  <div className="field-label">Patrón de fondo del chat</div>
                  <select
                    className="input"
                    value={appearanceForm.pattern}
                    onChange={(e) => handleAppearanceChange('pattern', e.target.value)}
                  >
                    <option value="dots">Puntos</option>
                    <option value="grid">Cuadrícula</option>
                    <option value="cross">Cruces</option>
                    <option value="diagonal">Diagonales</option>
                    <option value="topo">Topográfico</option>
                    <option value="doodle">Doodle IA</option>
                    <option value="hex">Hexágonos</option>
                    <option value="glow">Glow</option>
                    <option value="none">Sin patrón</option>
                  </select>
                </div>

                <div className="field" style={{ marginBottom: 0 }}>
                  <div className="field-label">Intensidad del patrón — {Math.round(appearanceForm.patternOpacity * 100)}%</div>
                  <input
                    type="range"
                    min="0" max="1" step="0.05"
                    value={appearanceForm.patternOpacity}
                    onChange={(e) => handleAppearanceChange('patternOpacity', parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--voltage)' }}
                  />
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={handleSaveAppearance}
              disabled={isUpdating}
              style={{ marginTop: 16 }}
            >
              {isUpdating ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </>
        )}

        {tab === 'embed' && bot?.embedKey && (() => {
          const apiUrl  = import.meta.env.VITE_API_APP || 'http://localhost:5001';
          const appUrl  = import.meta.env.VITE_APP_URL || 'http://localhost:5173';
          const color   = bot.widget?.color   || '#667eea';
          const avatar  = bot.widget?.avatar  || '🤖';
          const name    = bot.name            || 'Asistente';
          const pattern        = bot.widget?.pattern        || 'dots';
          const patternOpacity = bot.widget?.patternOpacity ?? 0.45;

          // HTML completos listos para copiar y guardar como .html
          const bubbleHtml = generateBubbleWidgetHtml({
            botId: id, embedKey: bot.embedKey,
            color, avatar, name, apiUrl, appUrl,
          });
          const fullChatHtml = generateFullChatHtml({
            embedKey: bot.embedKey, apiUrl, color, avatar, name, pattern, patternOpacity,
          });
          const voiceColor = bot.voiceSettings?.color || color;
          const voiceHtml = generateVoiceWidgetHtml({
            botId: id, embedKey: bot.embedKey,
            color: voiceColor, avatar, name, apiUrl, appUrl,
          });
          const voiceNeedsKey = !openaiForm.hasApiKey;

          const copy = (code, label) => {
            navigator.clipboard.writeText(code);
            message.success(`${label} copiado`);
          };

          const codeBlockStyle = {
            background: 'var(--carbon)', borderRadius: 10, padding: 16,
            marginBottom: 14, maxHeight: 220, overflow: 'auto',
          };
          const preStyle = {
            margin: 0, fontSize: 11, fontFamily: 'monospace',
            color: 'var(--bone)', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
            opacity: 0.8,
          };
          const hintStyle = {
            marginTop: 14, padding: '12px 14px', background: 'var(--bone-2)',
            borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 13,
            opacity: 0.7, lineHeight: 1.6,
          };

          return (
            <>
              <div className="section-head">
                <div>
                  <div className="section-num">Widgets · HTML listo para usar</div>
                  <div className="section-title">Instala tu <em>Øpia.</em></div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, opacity: 0.7, lineHeight: 1.6, marginTop: 8, maxWidth: 620 }}>
                    Elige cómo quieres mostrar tu asistente. Copia el código y pégalo en tu sitio — no necesitas saber programar.
                  </div>
                </div>
              </div>

              {(() => {
                const demoUrl = `${window.location.origin}/demo/${bot.embedKey}`;
                return (
                  <div style={{ background: 'var(--carbon)', borderRadius: 14, padding: 20, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 240 }}>
                      <div className="section-num" style={{ color: 'var(--voltage)', marginBottom: 4 }}>🔗 Link de demo</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--bone)', opacity: 0.8, lineHeight: 1.5 }}>
                        Compártelo con tu cliente: prueba los 3 modos (texto, voz y widget) en un solo enlace.
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--bone)', opacity: 0.6, marginTop: 8, wordBreak: 'break-all' }}>{demoUrl}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-primary btn-sm" onClick={() => copy(demoUrl, 'Link de demo')}>
                        <svg><use href="#i-copy" /></svg>Copiar link
                      </button>
                      <a className="btn btn-ghost btn-sm" href={demoUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--bone)', borderColor: 'var(--bone)' }}>Abrir ↗</a>
                    </div>
                  </div>
                );
              })()}

              <div className="grid-3" style={{ gap: 20 }}>

                {/* ── Bubble widget ── */}
                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 50, background: color, display: 'grid', placeItems: 'center', fontSize: 20, flexShrink: 0 }}>
                      {avatar}
                    </div>
                    <div>
                      <div className="section-num" style={{ marginBottom: 2 }}>Widget de burbuja</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, opacity: 0.55 }}>
                        El botón flotante de siempre
                      </div>
                    </div>
                  </div>

                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.65, opacity: 0.8, marginBottom: 16 }}>
                    Aparece como un botón en la esquina de tu sitio. Al hacer clic, se abre el chat encima de tu contenido sin interrumpir la navegación. Ideal para dar soporte, responder dudas y captar clientes en tu página actual.
                  </div>

                  <div style={codeBlockStyle}>
                    <pre style={preStyle}>{bubbleHtml}</pre>
                  </div>

                  <button className="btn btn-primary btn-sm" onClick={() => copy(bubbleHtml, 'HTML del bubble widget')}>
                    <svg><use href="#i-copy" /></svg>Copiar HTML completo
                  </button>

                  <div style={hintStyle}>
                    <strong>Cómo instalarlo:</strong> copia el código y pégalo antes de <code>&lt;/body&gt;</code>. El botón aparece solo, con el color y la posición que configuraste.
                  </div>
                </div>

                {/* ── Full screen chat ── */}
                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: color, display: 'grid', placeItems: 'center', fontSize: 20, flexShrink: 0 }}>
                      {avatar}
                    </div>
                    <div>
                      <div className="section-num" style={{ marginBottom: 2 }}>Widget de pantalla completa</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, opacity: 0.55 }}>
                        Tu propio ChatGPT
                      </div>
                    </div>
                  </div>

                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.65, opacity: 0.8, marginBottom: 16 }}>
                    Una interfaz de chat completa, igual que ChatGPT — pero entrenada con la información de tu negocio. Responde sobre tus productos, precios, horarios y todo lo que cargaste, con la inteligencia de GPT y el contexto de tu empresa.
                    <br /><br />
                    Úsala como página independiente, compártela con un enlace directo, o ponla en tu intranet como asistente interno para tu equipo. No es solo un chat de soporte: es un asistente conversacional con tu marca.
                  </div>

                  <div style={codeBlockStyle}>
                    <pre style={preStyle}>{fullChatHtml}</pre>
                  </div>

                  <button className="btn btn-primary btn-sm" onClick={() => copy(fullChatHtml, 'HTML del chat completo')}>
                    <svg><use href="#i-copy" /></svg>Copiar HTML completo
                  </button>

                  <div style={hintStyle}>
                    <strong>Cómo instalarlo:</strong> pégalo en una página vacía o dentro de un <code>&lt;iframe&gt;</code>. Ocupa todo el espacio disponible y funciona como una app de chat dedicada.
                  </div>
                </div>

                {/* ── Voice widget ── */}
                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 50, background: voiceColor, display: 'grid', placeItems: 'center', fontSize: 20, flexShrink: 0, color: '#fff' }}>
                      🎙️
                    </div>
                    <div>
                      <div className="section-num" style={{ marginBottom: 2 }}>Widget de voz</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, opacity: 0.55 }}>
                        Conversación en tiempo real
                      </div>
                    </div>
                  </div>

                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.65, opacity: 0.8, marginBottom: 16 }}>
                    Un botón de micrófono flotante: tus clientes hablan y el bot responde con voz al instante, con todo el conocimiento de tu negocio. Una barra muestra la última frase en vivo y, al tocarla, se abre el historial completo de la conversación.
                  </div>

                  {voiceNeedsKey && (
                    <div style={{ marginBottom: 14, padding: '10px 12px', background: 'var(--bone-2)', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 12.5, lineHeight: 1.55, border: '1px solid rgba(0,0,0,0.06)' }}>
                      ⚠️ El widget de voz requiere una <strong>API key de OpenAI</strong> configurada. Agrégala en la pestaña <em>OpenAI</em> para activarlo.
                    </div>
                  )}

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>
                      Voz del asistente
                    </label>
                    <select
                      value={voiceVoice}
                      onChange={(e) => handleSaveVoice(e.target.value)}
                      disabled={isUpdating}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--bone-2)', fontFamily: 'var(--font-body)', fontSize: 13, background: '#fff', cursor: 'pointer' }}
                    >
                      <option value="alloy">Alloy — neutral, versátil</option>
                      <option value="ash">Ash — cálida, cercana</option>
                      <option value="ballad">Ballad — suave, expresiva</option>
                      <option value="coral">Coral — amable, animada</option>
                      <option value="echo">Echo — clara, profesional</option>
                      <option value="sage">Sage — serena, madura</option>
                      <option value="shimmer">Shimmer — brillante, enérgica</option>
                      <option value="verse">Verse — natural, conversacional</option>
                    </select>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 11.5, opacity: 0.55, marginTop: 5 }}>
                      Se guarda al instante y aplica en la próxima llamada — no necesitas volver a copiar el HTML.
                    </div>
                  </div>

                  <div style={codeBlockStyle}>
                    <pre style={preStyle}>{voiceHtml}</pre>
                  </div>

                  <button className="btn btn-primary btn-sm" onClick={() => copy(voiceHtml, 'HTML del widget de voz')}>
                    <svg><use href="#i-copy" /></svg>Copiar HTML completo
                  </button>

                  <div style={hintStyle}>
                    <strong>Cómo instalarlo:</strong> copia el código y pégalo antes de <code>&lt;/body&gt;</code>. Aparece un botón de micrófono flotante. Requiere HTTPS para que el navegador permita el micrófono.
                  </div>
                </div>

              </div>
            </>
          );
        })()}

        {tab === 'leads' && (
          <LeadsPanel workspaceId={workspaceId} botId={id} bot={bot} />
        )}

        {tab === 'quotes' && (
          <QuotesPanel workspaceId={workspaceId} botId={id} bot={bot} />
        )}

        {tab === 'appointments' && (
          <AppointmentsPanel workspaceId={workspaceId} botId={id} bot={bot} businessType={bot?.businessType} />
        )}

        {tab === 'sales' && bot && (
          <SalesPanel workspaceId={workspaceId} botId={id} bot={bot} />
        )}

        {tab === 'integrations' && bot && (
          <IntegrationsPanel workspaceId={workspaceId} botId={id} bot={bot} />
        )}

        {tab !== 'config' && tab !== 'catalog' && tab !== 'appearance' && tab !== 'embed' &&
         tab !== 'leads' && tab !== 'quotes' && tab !== 'appointments' && tab !== 'conversations' && tab !== 'integrations' && tab !== 'openai' && tab !== 'empresa' && tab !== 'instrucciones' && (
          <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, marginBottom: 6 }}>
              Pestaña <em style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>{tab}</em>
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', opacity: 0.6 }}>
              Contenido en construcción.
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default BotDetail;
