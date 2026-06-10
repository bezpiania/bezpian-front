import React, { useState, useRef } from 'react';
import { X, ArrowLeft, ArrowRight, Upload, Plus, Trash2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useCreateChatbot } from '../../../hooks/useChatbot.js';
import Chatbot from '../../../services/Chatbot.js';
import { BUSINESS_TYPE_OPTIONS } from '../../../config/businessTypes.js';
import '../../../styles/create-chatbot.css';

const steps = [
  { id: 'basics', label: 'Lo básico' },
  { id: 'personality', label: 'Personalidad' },
  { id: 'appearance', label: 'Apariencia' },
  { id: 'features', label: 'Funcionalidades' },
  { id: 'knowledge', label: 'Base de datos' },
  { id: 'products', label: 'Productos' },
  { id: 'google', label: 'Google Connect' },
  { id: 'leads', label: 'Leads' },
];

export default function CreateChatbot() {
  const navigate = useNavigate();
  const { mutate: createChatbot, isPending } = useCreateChatbot();
  const [currentStep, setCurrentStep] = useState(0);
  const [kbTab, setKbTab] = useState('upload');
  const [productsTab, setProductsTab] = useState('api');
  const [files, setFiles] = useState([]);
  const [products, setProducts] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);

  const [formData, setFormData] = useState({
    botName: 'Zapi',
    businessType: 'generic',
    botDescription: '',
    tone: 'neutral',
    welcomeMessage: '¡Hola! Soy Zapi. ¿En qué te puedo ayudar?',
    fallbackMessage: 'No estoy seguro de eso. ¿Quieres que te conecte con alguien del equipo?',
    proactiveMessage: '¿Buscando algo en particular? Puedo ayudarte 👋',
    primaryColor: '#DCFF1E',
    position: 'bottom-right',
    avatar: '🤖',
    features: {
      chat: true,
      quotations: false,
      scheduling: false,
      leadCapture: false,
    },
    knowledgeBase: '',
    apiUrl: '',
    apiKey: '',
    leadFields: {
      name: true,
      email: true,
      phone: false,
      company: false,
    },
    openaiApiKey: '',
    openaiModel: 'gpt-4o-mini',
    openaiSettings: {
      temperature: 0.7,
      maxTokens: 500,
      topP: 1,
    },
  });

  const fileInputRef = useRef(null);

  const getVisibleSteps = () => {
    const baseSteps = [
      { id: 'basics', label: 'Lo básico' },
      { id: 'personality', label: 'Personalidad' },
      { id: 'appearance', label: 'Apariencia' },
      { id: 'features', label: 'Funcionalidades' },
      { id: 'knowledge', label: 'Base de datos' },
    ];

    if (formData.features.quotations) {
      baseSteps.push({ id: 'products', label: 'Productos' });
    }
    if (formData.features.scheduling) {
      baseSteps.push({ id: 'google', label: 'Google Connect' });
    }
    if (formData.features.leadCapture) {
      baseSteps.push({ id: 'leads', label: 'Leads' });
    }

    baseSteps.push({ id: 'openai', label: 'OpenAI' });

    return baseSteps;
  };

  const visibleSteps = getVisibleSteps();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleChipClick = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggleFeature = (feature) => {
    setFormData((prev) => ({
      ...prev,
      features: { ...prev.features, [feature]: !prev.features[feature] },
    }));
  };

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files || []);
    uploadedFiles.forEach((file) => {
      const newFile = {
        id: Date.now() + Math.random(),
        name: file.name,
        size: (file.size / 1024).toFixed(1),
        type: file.name.split('.').pop().toUpperCase(),
        status: 'processing',
        file: file, // 👈 Guardar el archivo real
      };
      setFiles((prev) => [...prev, newFile]);
      setTimeout(() => {
        setFiles((prev) =>
          prev.map((f) => (f.id === newFile.id ? { ...f, status: 'ready' } : f))
        );
      }, 2000);
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const addProduct = () => {
    setProducts((prev) => [...prev, { id: Date.now(), name: '', price: '' }]);
  };

  const updateProduct = (id, key, value) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [key]: value } : p))
    );
  };

  const removeProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleNextStep = () => {
    const currentStepId = visibleSteps[currentStep]?.id;

    // Validación: Si estamos en el paso de Google y features.scheduling está activado
    if (currentStepId === 'google' && formData.features.scheduling && !googleConnected) {
      const result = window.confirm(
        '⚠️ Google Calendar no está conectado.\n\n' +
        'Sin Google Calendar:\n' +
        '• Los clientes podrán agendar citas\n' +
        '• Pero NO aparecerán en tu calendario de Google\n\n' +
        '¿Deseas continuar sin conectar Google Calendar?'
      );

      if (!result) {
        message.info('Por favor, conecta Google Calendar o desactiva la función de agendamiento');
        return;
      }
    }

    // Validación: Si estamos en el último paso, validar OpenAI
    if (currentStepId === 'openai' && !formData.openaiApiKey) {
      const result = window.confirm(
        '⚠️ OpenAI API Key no configurada.\n\n' +
        'Sin una API Key de OpenAI, tu chatbot no podrá responder mensajes.\n\n' +
        '¿Deseas continuar? (Puedes configurarla después en el dashboard)'
      );

      if (!result) {
        return;
      }
    }

    if (currentStep < visibleSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setIsChatOpen(false);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setIsChatOpen(false);
    }
  };

  const handleSave = () => {
    const workspaceId = localStorage.getItem('workspaceId');
    if (!workspaceId) {
      message.error('Error: workspace no encontrado. Por favor, recarga la página y vuelve a iniciar sesión');
      console.error('workspaceId no encontrado en localStorage');
      return;
    }

    createChatbot(
      {
        workspaceId,
        chatbotData: {
          ...formData,
          businessType: formData.businessType || 'generic',
          files: files.map(f => ({ name: f.name, size: f.size, type: f.type })),
          products,
          googleConnected,
        },
      },
      {
        onSuccess: async (response) => {
          // Manejar ambas estructuras posibles de respuesta
          const chatbotId = response.data?.data?._id || response.data?._id;

          if (!chatbotId) {
            console.error('Response structure:', response);
            message.error('Error: No se obtuvo ID del chatbot');
            return;
          }

          try {
            // 1. Configurar OpenAI si es necesario
            if (formData.openaiApiKey) {
              await Chatbot.updateOpenaiConfig(workspaceId, chatbotId, {
                openaiApiKey: formData.openaiApiKey,
                openaiModel: formData.openaiModel,
                openaiSettings: formData.openaiSettings,
              });
            }

            // 2. Subir archivos de conocimiento
            if (files.length > 0) {
              console.log('📤 Subiendo', files.length, 'archivos...');
              for (const fileObj of files) {
                try {
                  await Chatbot.uploadDocument(workspaceId, chatbotId, fileObj.file);
                  console.log('✅ Archivo subido:', fileObj.name);
                } catch (error) {
                  console.error('❌ Error subiendo archivo:', fileObj.name, error);
                  message.warning(`Error subiendo ${fileObj.name}`);
                }
              }
            }

            message.success('¡Chatbot creado exitosamente!');
            navigate('/chatbots');
          } catch (error) {
            message.error('Error en la configuración del chatbot');
            console.error('Error:', error);
          }
        },
        onError: (error) => {
          const errorMsg = error?.response?.data?.message || error?.message || 'Error al crear chatbot';
          message.error(errorMsg);
        },
      }
    );
  };

  const countChars = (str, max) => `${str.length}/${max}`;

  const step = visibleSteps[currentStep];

  return (
    <div className="wizard">
      {/* LEFT: FORM */}
      <section className="form-side">
        <div className="topbar">
          <div className="brand">
            <div className="brand-mark">Z</div>
            <div className="brand-name">Bezpian</div>
          </div>
          <button className="topbar-exit" onClick={() => navigate(-1)}>
            <X size={14} />
            Salir sin guardar
          </button>
        </div>

        <div className="steps-bar">
          {visibleSteps.map((s, idx) => (
            <div
              key={s.id}
              className={`step-pill ${idx < currentStep ? 'done' : ''} ${
                idx === currentStep ? 'active' : ''
              }`}
            />
          ))}
        </div>

        <div className="form-body">
          {/* STEP 1: BASICS */}
          <div className={`step ${currentStep === 0 ? 'active' : ''}`}>
            <div className="step-meta">
              <span className="step-num">Paso {String(currentStep + 1).padStart(2, '0')}</span>
              <span className="sep"></span>
              <span className="step-total">{step.label}</span>
            </div>
            <h2 className="step-title">
              Ponle <span className="hl">nombre</span>
              <br />a tu Bezpian.
            </h2>
            <p className="step-sub">
              Así lo van a ver tus clientes cuando converse con ellos. Puedes cambiarlo después si te arrepientes.
            </p>

            <div className="field">
              <div className="field-label">
                Nombre del chatbot
                <span className="req">Obligatorio</span>
              </div>
              <div className="input-with-counter">
                <input
                  type="text"
                  className="input"
                  id="botName"
                  value={formData.botName}
                  onChange={handleInputChange}
                  maxLength="24"
                />
                <span className="counter">{countChars(formData.botName, 24)}</span>
              </div>
              <div className="field-hint">
                Va a aparecer en el header del widget — corto y conversacional funciona mejor.
              </div>
            </div>

            <div className="field">
              <div className="field-label">Tipo de negocio <span className="req">Importante</span></div>
              <div className="chip-grid">
                {BUSINESS_TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    className={`chip ${formData.businessType === opt.value ? 'selected' : ''}`}
                    onClick={() => handleChipClick('businessType', opt.value)}
                  >
                    <span className="chip-emoji">{opt.icon}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="field-hint">
                Esto define qué módulos, campos y flujos estarán disponibles en tu chatbot.
              </div>
            </div>

            <div className="field">
              <div className="field-label">
                Descripción corta <span className="req">Opcional</span>
              </div>
              <textarea
                className="textarea"
                id="botDescription"
                value={formData.botDescription}
                onChange={handleInputChange}
                placeholder="En una frase: ¿qué hace tu negocio?"
              ></textarea>
              <div className="field-hint">
                El bot va a usar esto para presentarse cuando un cliente pregunte qué venden.
              </div>
            </div>
          </div>

          {/* STEP 2: PERSONALITY */}
          <div className={`step ${currentStep === 1 ? 'active' : ''}`}>
            <div className="step-meta">
              <span className="step-num">Paso {String(currentStep + 1).padStart(2, '0')}</span>
              <span className="sep"></span>
              <span className="step-total">{step.label}</span>
            </div>
            <h2 className="step-title">
              ¿Cómo <span className="hl">habla</span>
              <br />
              <em>tu marca?</em>
            </h2>
            <p className="step-sub">
              Define el tono y los mensajes clave. El bot los va a usar como base — sin prompts, sin enredos.
            </p>

            <div className="field">
              <div className="field-label">Tono de voz</div>
              <div className="tone-grid">
                {[
                  { value: 'casual', name: 'Casual', example: '¡Hola! ¿Qué andas buscando hoy?' },
                  { value: 'neutral', name: 'Neutral', example: 'Hola, ¿en qué te puedo ayudar?' },
                  { value: 'formal', name: 'Formal', example: 'Buenos días. ¿Cómo puedo asistirle?' },
                ].map((tone) => (
                  <button
                    key={tone.value}
                    className={`tone-option ${formData.tone === tone.value ? 'selected' : ''}`}
                    onClick={() => handleChipClick('tone', tone.value)}
                  >
                    <div className="tone-name">{tone.name}</div>
                    <div className="tone-example">"{tone.example}"</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <div className="field-label">
                Mensaje de bienvenida
                <span className="req">Obligatorio</span>
              </div>
              <div className="input-with-counter">
                <input
                  type="text"
                  className="input"
                  id="welcomeMessage"
                  value={formData.welcomeMessage}
                  onChange={handleInputChange}
                  maxLength="120"
                />
                <span className="counter">{countChars(formData.welcomeMessage, 120)}</span>
              </div>
              <div className="field-hint">Lo primero que ve un cliente cuando abre el widget.</div>
            </div>

            <div className="field">
              <div className="field-label">Mensaje de fallback</div>
              <input
                type="text"
                className="input"
                id="fallbackMessage"
                value={formData.fallbackMessage}
                onChange={handleInputChange}
              />
              <div className="field-hint">
                Lo dice cuando no sabe — <em>nunca inventa</em>.
              </div>
            </div>
          </div>

          {/* STEP 3: APPEARANCE */}
          <div className={`step ${currentStep === 2 ? 'active' : ''}`}>
            <div className="step-meta">
              <span className="step-num">Paso {String(currentStep + 1).padStart(2, '0')}</span>
              <span className="sep"></span>
              <span className="step-total">{step.label}</span>
            </div>
            <h2 className="step-title">
              Que se vea <span className="hl">tuyo.</span>
            </h2>
            <p className="step-sub">Color, posición y avatar. Mira el preview a la derecha mientras eliges.</p>

            <div className="field">
              <div className="field-label">Color principal</div>
              <div className="color-row">
                {[
                  '#DCFF1E',
                  '#FF4D1F',
                  '#1B2C5C',
                  '#2DBE60',
                  '#15140F',
                  '#8B5CF6',
                  '#EC4899',
                ].map((color) => (
                  <div
                    key={color}
                    className={`color-swatch ${formData.primaryColor === color ? 'selected' : ''}`}
                    style={{ background: color }}
                    onClick={() => handleChipClick('primaryColor', color)}
                  />
                ))}
              </div>
            </div>

            <div className="field">
              <div className="field-label">Posición del widget</div>
              <div className="pos-grid">
                {[
                  { value: 'bottom-right', label: 'Abajo a la derecha' },
                  { value: 'bottom-left', label: 'Abajo a la izquierda' },
                ].map((pos) => (
                  <button
                    key={pos.value}
                    className={`pos-option ${formData.position === pos.value ? 'selected' : ''}`}
                    onClick={() => handleChipClick('position', pos.value)}
                  >
                    <div className="pos-preview">
                      <div className="dot"></div>
                    </div>
                    <div className="pos-label">{pos.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <div className="field-label">Avatar del bot</div>
              <div className="avatar-row">
                {['🤖', '💬', '🎯', '⚡', '👋', '💡'].map((avatar) => (
                  <button
                    key={avatar}
                    className={`avatar-option ${formData.avatar === avatar ? 'selected' : ''}`}
                    onClick={() => handleChipClick('avatar', avatar)}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* STEP 4: FEATURES */}
          <div className={`step ${currentStep === 3 ? 'active' : ''}`}>
            <div className="step-meta">
              <span className="step-num">Paso {String(currentStep + 1).padStart(2, '0')}</span>
              <span className="sep"></span>
              <span className="step-total">{step.label}</span>
            </div>
            <h2 className="step-title">
              Elige tus <span className="hl">poderes.</span>
            </h2>
            <p className="step-sub">Habilita las funcionalidades que necesites. Puedes cambiarlas después sin problema.</p>

            <div className="features-list">
              {[
                { id: 'chat', name: 'Chat básico', desc: 'Conversaciones de texto. El corazón de todo.' },
                { id: 'quotations', name: 'Cotizaciones', desc: 'El bot puede generar cotizaciones de tus productos.' },
                { id: 'scheduling', name: 'Agendar citas', desc: 'Integración con tu calendario para reservas.' },
                { id: 'leadCapture', name: 'Captura de leads', desc: 'Recopila información de interesados automáticamente.' },
              ].map((feature) => (
                <button
                  key={feature.id}
                  className={`feature-row ${formData.features[feature.id] ? 'on' : ''}`}
                  onClick={() => handleToggleFeature(feature.id)}
                >
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                  <div className="feature-text">
                    <div className="feature-name">{feature.name}</div>
                    <div className="feature-desc">{feature.desc}</div>
                  </div>
                  <button
                    type="button"
                    className="toggle"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFeature(feature.id);
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* STEP 5: KNOWLEDGE BASE */}
          <div className={`step ${currentStep === 4 ? 'active' : ''}`}>
            <div className="step-meta">
              <span className="step-num">Paso {String(currentStep + 1).padStart(2, '0')}</span>
              <span className="sep"></span>
              <span className="step-total">{step.label}</span>
            </div>
            <h2 className="step-title">
              Entrena tu bot con <span className="hl">información.</span>
            </h2>
            <p className="step-sub">Sube documentos o pega texto. El bot aprenderá de tu contenido para responder mejor.</p>

            <div className="field">
              <div className="tabs">
                <button
                  className={`tab ${kbTab === 'upload' ? 'active' : ''}`}
                  onClick={() => setKbTab('upload')}
                >
                  Subir archivos
                </button>
                <button
                  className={`tab ${kbTab === 'text' ? 'active' : ''}`}
                  onClick={() => setKbTab('text')}
                >
                  Pegar texto
                </button>
              </div>

              {kbTab === 'upload' && (
                <>
                  <div
                    className="upload-zone"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="upload-icon">
                      <Upload size={24} />
                    </div>
                    <div className="upload-title">Arrastra archivos aquí o haz click</div>
                    <div className="upload-sub">Soportamos PDF, Word, TXT y Markdown</div>
                    <div className="upload-formats">PDF • DOCX • TXT • MD</div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                  </div>

                  {files.length > 0 && (
                    <div className="file-list">
                      {files.map((file) => (
                        <div key={file.id} className="file-row">
                          <div className={`file-icon ${file.type.toLowerCase()}`}>
                            {file.type}
                          </div>
                          <div className="file-info">
                            <div className="file-name">{file.name}</div>
                            <div className="file-meta">{file.size} KB</div>
                          </div>
                          <div className={`file-status ${file.status}`}>
                            {file.status === 'processing' ? 'Procesando' : 'Listo'}
                          </div>
                          <button
                            className="file-remove"
                            onClick={() => removeFile(file.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {kbTab === 'text' && (
                <textarea
                  className="textarea"
                  placeholder="Pega aquí la información que quieres que el bot aprenda. Puede ser FAQ, descripción de productos, políticas, etc."
                />
              )}
            </div>
          </div>

          {/* STEP 6: PRODUCTS */}
          {visibleSteps[currentStep]?.id === 'products' && (
          <div className={`step ${currentStep === 5 ? 'active' : ''}`}>
            <div className="step-meta">
              <span className="step-num">Paso {String(currentStep + 1).padStart(2, '0')}</span>
              <span className="sep"></span>
              <span className="step-total">{step.label}</span>
            </div>
            <h2 className="step-title">
              Conecta tu <span className="hl">catálogo.</span>
            </h2>
            <p className="step-sub">Integra tus productos para que el bot pueda hablar sobre ellos con precisión.</p>

            <div className="field">
              <div className="tabs">
                <button
                  className={`tab ${productsTab === 'api' ? 'active' : ''}`}
                  onClick={() => setProductsTab('api')}
                >
                  API
                </button>
                <button
                  className={`tab ${productsTab === 'manual' ? 'active' : ''}`}
                  onClick={() => setProductsTab('manual')}
                >
                  Manual
                </button>
              </div>

              {productsTab === 'api' && (
                <>
                  <div className="api-config">
                    <div className="api-config-head">
                      <div className="api-config-title">Conectar a Shopify</div>
                    </div>
                    <div className="field">
                      <div className="field-label">URL de API</div>
                      <input
                        type="text"
                        className="input"
                        id="apiUrl"
                        value={formData.apiUrl}
                        onChange={handleInputChange}
                        placeholder="https://tu-tienda.myshopify.com/admin/api/2024-01"
                      />
                    </div>
                    <div className="field">
                      <div className="field-label">API Key</div>
                      <input
                        type="password"
                        className="input"
                        id="apiKey"
                        value={formData.apiKey}
                        onChange={handleInputChange}
                        placeholder="shppa_..."
                      />
                    </div>
                  </div>
                </>
              )}

              {productsTab === 'manual' && (
                <>
                  {products.map((product) => (
                    <div key={product.id} className="product-row">
                      <input
                        type="text"
                        placeholder="Nombre del producto"
                        value={product.name}
                        onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Descripción"
                        value={product.description || ''}
                        onChange={(e) => updateProduct(product.id, 'description', e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Precio"
                        value={product.price}
                        onChange={(e) => updateProduct(product.id, 'price', e.target.value)}
                      />
                      <button className="remove" onClick={() => removeProduct(product.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button className="add-product" onClick={addProduct}>
                    <Plus size={14} />
                    Agregar producto
                  </button>
                </>
              )}
            </div>
          </div>
          )}

          {/* STEP 7: GOOGLE */}
          {visibleSteps[currentStep]?.id === 'google' && (
          <div className={`step ${currentStep === 6 ? 'active' : ''}`}>
            <div className="step-meta">
              <span className="step-num">Paso {String(currentStep + 1).padStart(2, '0')}</span>
              <span className="sep"></span>
              <span className="step-total">{step.label}</span>
            </div>
            <h2 className="step-title">
              Conecta <span className="hl">Google.</span>
            </h2>
            <p className="step-sub">Acceso a Google Calendar, Gmail y más servicios de Google Workspace.</p>

            {!googleConnected ? (
              <div className="google-card">
                <div className="google-icon">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                  </svg>
                </div>
                <div className="google-title">Conecta tu cuenta de <em>Google.</em></div>
                <div className="google-sub">
                  Acceso seguro a Google Calendar, Gmail y Google Drive para potenciar tu bot con automatizaciones.
                </div>
                <button
                  className="google-btn"
                  onClick={() => setGoogleConnected(true)}
                >
                  <div className="g-logo">
                    <svg viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                  Conectar Google
                </button>
              </div>
            ) : (
              <div className="google-card connected">
                <div className="connected-row">
                  <div className="connected-mark">
                    <Check size={22} />
                  </div>
                  <div className="connected-text">
                    <strong>Google conectado</strong>
                    <span>tu@gmail.com</span>
                  </div>
                  <button className="disconnect-btn" onClick={() => setGoogleConnected(false)}>
                    Desconectar
                  </button>
                </div>
              </div>
            )}
          </div>
          )}

          {/* STEP 8: LEADS */}
          {visibleSteps[currentStep]?.id === 'leads' && (
          <div className={`step ${currentStep === 7 ? 'active' : ''}`}>
            <div className="step-meta">
              <span className="step-num">Paso {String(currentStep + 1).padStart(2, '0')}</span>
              <span className="sep"></span>
              <span className="step-total">{step.label}</span>
            </div>
            <h2 className="step-title">
              Captura <span className="hl">leads.</span>
            </h2>
            <p className="step-sub">Configura qué información recopilar de tus visitantes automáticamente.</p>

            <div className="lead-fields">
              {[
                { id: 'name', label: 'Nombre', required: true },
                { id: 'email', label: 'Email', required: true },
                { id: 'phone', label: 'Teléfono', required: false },
                { id: 'company', label: 'Empresa', required: false },
              ].map((field) => (
                <button
                  key={field.id}
                  className={`lead-field ${formData.leadFields[field.id] ? 'on' : ''}`}
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      leadFields: {
                        ...prev.leadFields,
                        [field.id]: !prev.leadFields[field.id],
                      },
                    }));
                  }}
                >
                  <div className="lead-check">
                    {formData.leadFields[field.id] && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <div className="lead-field-name">
                    {field.label}
                    {field.required && <em>(obligatorio)</em>}
                  </div>
                </button>
              ))}
            </div>
          </div>
          )}

          {/* STEP 9: OPENAI */}
          {visibleSteps[currentStep]?.id === 'openai' && (
          <div className={`step ${currentStep === visibleSteps.length - 1 ? 'active' : ''}`}>
            <div className="step-meta">
              <span className="step-num">Paso {String(currentStep + 1).padStart(2, '0')}</span>
              <span className="sep"></span>
              <span className="step-total">{visibleSteps[currentStep]?.label}</span>
            </div>
            <h2 className="step-title">
              Configura <span className="hl">OpenAI.</span>
            </h2>
            <p className="step-sub">Proporciona tu API key de OpenAI para habilitar respuestas inteligentes del chatbot.</p>

            {/* API Key Field */}
            <div className="field">
              <div className="field-label">
                API Key de OpenAI
              </div>
              <input
                id="openaiApiKey"
                type="password"
                placeholder="sk-..."
                className="input"
                value={formData.openaiApiKey}
                onChange={handleInputChange}
              />
              <div className="field-hint">
                Puedes obtener tu clave en <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ink)', fontWeight: 600 }}>platform.openai.com/api-keys</a>
              </div>
            </div>

            {/* Model Selection */}
            <div className="field">
              <div className="field-label">
                Modelo de IA
              </div>
              <select
                id="openaiModel"
                value={formData.openaiModel}
                onChange={handleInputChange}
                className="select"
              >
                <option value="gpt-4o-mini">GPT-4o Mini — Rápido y económico ⭐</option>
                <option value="gpt-4o">GPT-4o — Más inteligente y rápido</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo — Legado</option>
                <option value="gpt-4">GPT-4 — Legado</option>
                <option value="gpt-4-turbo">GPT-4 Turbo — Legado</option>
              </select>
              <div className="field-hint">
                GPT-3.5 es más rápido y barato. GPT-4 es más inteligente pero más lento.
              </div>
            </div>

            {/* Sliders Section */}
            <div className="openai-sliders">
              {/* Temperature Slider */}
              <div className="slider-group">
                <div className="slider-header">
                  <div className="slider-label">
                    <span className="slider-name">Temperatura</span>
                    <span className="slider-value">{formData.openaiSettings.temperature.toFixed(1)}</span>
                  </div>
                  <span className="slider-hint">Creatividad de respuestas</span>
                </div>
                <div className="slider-track">
                  <input
                    id="temperature"
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={formData.openaiSettings.temperature}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        openaiSettings: {
                          ...prev.openaiSettings,
                          temperature: parseFloat(e.target.value),
                        },
                      }));
                    }}
                    className="range-slider"
                  />
                </div>
                <div className="slider-labels">
                  <span>Determinista</span>
                  <span>Equilibrado</span>
                  <span>Creativo</span>
                </div>
              </div>

              {/* Max Tokens Slider */}
              <div className="slider-group">
                <div className="slider-header">
                  <div className="slider-label">
                    <span className="slider-name">Máximo de tokens</span>
                    <span className="slider-value">{formData.openaiSettings.maxTokens}</span>
                  </div>
                  <span className="slider-hint">Longitud máxima de respuesta</span>
                </div>
                <div className="slider-track">
                  <input
                    id="maxTokens"
                    type="range"
                    min="50"
                    max="4000"
                    step="50"
                    value={formData.openaiSettings.maxTokens}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        openaiSettings: {
                          ...prev.openaiSettings,
                          maxTokens: parseInt(e.target.value),
                        },
                      }));
                    }}
                    className="range-slider"
                  />
                </div>
                <div className="slider-labels">
                  <span>Corta (50)</span>
                  <span>Media (2000)</span>
                  <span>Larga (4000)</span>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>

        <div className="form-foot">
          <button
            className="btn btn-ghost"
            onClick={handlePrevStep}
            disabled={currentStep === 0}
          >
            <ArrowLeft size={14} />
            Atrás
          </button>
          <div className="form-counter">
            {String(currentStep + 1).padStart(2, '0')} de {String(visibleSteps.length).padStart(2, '0')}
          </div>
          {currentStep === visibleSteps.length - 1 ? (
            <button className="btn btn-primary voltage" onClick={handleSave} disabled={isPending}>
              {isPending ? 'Creando...' : 'Crear Bezpian'}
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleNextStep}>
              Siguiente
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </section>

      {/* RIGHT: PREVIEW */}
      <section className="preview-side">
        <div className="preview-head">
          <div className="preview-eyebrow">
            <span className="live-dot"></span>
            Previsualizando en vivo
          </div>
          <div className="preview-title">
            <em>Tu</em> <span className="hl">{formData.botName}</span>
            <br />
            en acción.
          </div>
        </div>

        <div className="browser-frame">
          <div className="browser-bar">
            <div className="browser-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="browser-url">acme.vercel.app</div>
          </div>
          <div className="site-content">
            <div className="site-head">
              Tienda <em>Acme</em>
            </div>
            <div className="site-sub">Ropa y accesorios urbanos. Hechos en Chile, enviamos a todo el país.</div>

            <div className={`widget ${formData.position}`} style={{
              [formData.position === 'bottom-right' ? 'right' : formData.position === 'bottom-left' ? 'left' : formData.position === 'top-right' ? 'right' : 'left']: '20px',
              [formData.position.includes('bottom') ? 'bottom' : 'top']: '20px'
            }}>
              <button
                className="widget-bubble"
                style={{ background: formData.primaryColor }}
                onClick={() => setIsChatOpen(!isChatOpen)}
              >
                {formData.avatar}
              </button>
              {isChatOpen && (
                <div className="widget-window">
                  <div className="widget-header" style={{ background: formData.primaryColor }}>
                    <div className="widget-avatar">{formData.avatar}</div>
                    <div className="widget-meta">
                      <div className="widget-name">{formData.botName}</div>
                      <div className="widget-status">En vivo</div>
                    </div>
                  </div>
                  <div className="widget-body">
                    <div className="msg msg-bot">{formData.welcomeMessage}</div>
                    <div className="msg msg-user">¡Hola! Quería preguntar por las zapatillas</div>
                    <div className="msg msg-bot">Claro, ¿qué modelo te interesa?</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
