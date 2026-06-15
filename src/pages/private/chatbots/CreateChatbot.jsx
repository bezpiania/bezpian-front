import React, { useState } from 'react';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useCreateChatbot } from '../../../hooks/useChatbot.js';
import { BUSINESS_TYPE_OPTIONS } from '../../../config/businessTypes.js';
import '../../../styles/create-chatbot.css';

const STEPS = [
  { id: 'basics',      label: 'Lo básico' },
  { id: 'personality', label: 'Personalidad' },
  { id: 'appearance',  label: 'Apariencia' },
  { id: 'openai',      label: 'OpenAI', optional: true },
];

export default function CreateChatbot() {
  const navigate = useNavigate();
  const { mutate: createChatbot, isPending } = useCreateChatbot();
  const [currentStep, setCurrentStep] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [formData, setFormData] = useState({
    botName: 'Zapi',
    businessType: 'generic',
    botDescription: '',
    tone: 'neutral',
    welcomeMessage: '¡Hola! Soy Zapi. ¿En qué te puedo ayudar?',
    primaryColor: '#DCFF1E',
    position: 'bottom-right',
    avatar: '🤖',
    openaiApiKey: '',
    openaiModel: 'gpt-4o-mini',
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleChipClick = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const countChars = (str, max) => `${str.length}/${max}`;

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      setIsChatOpen(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setIsChatOpen(false);
    }
  };

  const handleSave = () => {
    if (!formData.botName.trim()) {
      message.error('El nombre del bot es obligatorio');
      return;
    }
    const workspaceId = localStorage.getItem('workspaceId');
    if (!workspaceId) {
      message.error('Error: workspace no encontrado. Por favor, recarga la página.');
      return;
    }
    createChatbot(
      { workspaceId, chatbotData: formData },
      {
        onSuccess: (response) => {
          const chatbotId = response.data?.data?._id || response.data?._id;
          if (!chatbotId) {
            message.error('Error: No se obtuvo ID del chatbot');
            return;
          }
          message.success('¡Pielo creado! Ahora configúralo a tu gusto.');
          navigate(`/chatbots/${chatbotId}`);
        },
        onError: (error) => {
          const msg = error?.response?.data?.message || error?.message || 'Error al crear chatbot';
          message.error(msg);
        },
      }
    );
  };

  const step = STEPS[currentStep];

  return (
    <div className="wizard">
      {/* LEFT: FORM */}
      <section className="form-side">
        <div className="topbar">
          <div className="brand">
            <div className="brand-mark">Z</div>
            <div className="brand-name">Pielo</div>
          </div>
          <button className="topbar-exit" onClick={() => navigate(-1)}>
            <X size={14} />
            Salir sin guardar
          </button>
        </div>

        <div className="steps-bar">
          {STEPS.map((s, idx) => (
            <div
              key={s.id}
              className={`step-pill ${idx < currentStep ? 'done' : ''} ${idx === currentStep ? 'active' : ''}`}
            />
          ))}
        </div>

        <div className="form-body">

          {/* STEP 1: BASICS */}
          {step.id === 'basics' && (
            <div className="step active">
              <div className="step-meta">
                <span className="step-num">Paso 01</span>
                <span className="sep"></span>
                <span className="step-total">Lo básico</span>
              </div>
              <h2 className="step-title">
                Ponle <span className="hl">nombre</span>
                <br />a tu Pielo.
              </h2>
              <p className="step-sub">
                Así lo van a ver tus clientes. Puedes cambiarlo después.
              </p>

              <div className="field">
                <div className="field-label">
                  Nombre del chatbot <span className="req">Obligatorio</span>
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
                  Aparece en el header del widget — corto y conversacional funciona mejor.
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
                  Define qué módulos estarán disponibles en tu chatbot.
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
                />
                <div className="field-hint">
                  El bot usa esto para presentarse cuando un cliente pregunta qué venden.
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PERSONALITY */}
          {step.id === 'personality' && (
            <div className="step active">
              <div className="step-meta">
                <span className="step-num">Paso 02</span>
                <span className="sep"></span>
                <span className="step-total">Personalidad</span>
              </div>
              <h2 className="step-title">
                ¿Cómo <span className="hl">habla</span>
                <br />
                <em>tu marca?</em>
              </h2>
              <p className="step-sub">
                Define el tono y el primer mensaje. El resto lo configuras después.
              </p>

              <div className="field">
                <div className="field-label">Tono de voz</div>
                <div className="tone-grid">
                  {[
                    { value: 'casual',  name: 'Casual',  example: '¡Hola! ¿Qué andas buscando hoy?' },
                    { value: 'neutral', name: 'Neutral', example: 'Hola, ¿en qué te puedo ayudar?' },
                    { value: 'formal',  name: 'Formal',  example: 'Buenos días. ¿Cómo puedo asistirle?' },
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
                  Mensaje de bienvenida <span className="req">Obligatorio</span>
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
            </div>
          )}

          {/* STEP 3: APPEARANCE */}
          {step.id === 'appearance' && (
            <div className="step active">
              <div className="step-meta">
                <span className="step-num">Paso 03</span>
                <span className="sep"></span>
                <span className="step-total">Apariencia</span>
              </div>
              <h2 className="step-title">
                Que se vea <span className="hl">tuyo.</span>
              </h2>
              <p className="step-sub">Color, posición y avatar. Mira el preview mientras eliges.</p>

              <div className="field">
                <div className="field-label">Color principal</div>
                <div className="color-row">
                  {['#DCFF1E', '#FF4D1F', '#1B2C5C', '#2DBE60', '#15140F', '#8B5CF6', '#EC4899'].map((color) => (
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
                    { value: 'bottom-left',  label: 'Abajo a la izquierda' },
                  ].map((pos) => (
                    <button
                      key={pos.value}
                      className={`pos-option ${formData.position === pos.value ? 'selected' : ''}`}
                      onClick={() => handleChipClick('position', pos.value)}
                    >
                      <div className="pos-preview"><div className="dot"></div></div>
                      <div className="pos-label">{pos.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <div className="field-label">Avatar del bot</div>
                <div className="avatar-row">
                  {['🤖', '💬', '🎯', '⚡', '👋', '💡'].map((av) => (
                    <button
                      key={av}
                      className={`avatar-option ${formData.avatar === av ? 'selected' : ''}`}
                      onClick={() => handleChipClick('avatar', av)}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: OPENAI */}
          {step.id === 'openai' && (
            <div className="step active">
              <div className="step-meta">
                <span className="step-num">Paso 04</span>
                <span className="sep"></span>
                <span className="step-total">OpenAI <span className="optional-tag">Opcional</span></span>
              </div>
              <h2 className="step-title">
                Potencia tu bot<br />
                con <span className="hl">GPT.</span>
              </h2>
              <p className="step-sub">
                Este paso es <strong>completamente opcional por ahora</strong>. Si no tienes tu API key de OpenAI a mano, créa tu Pielo igual y agrégala después desde la configuración del bot.
              </p>

              <div className="field">
                <div className="field-label">API Key de OpenAI</div>
                <input
                  type="password"
                  className="input"
                  id="openaiApiKey"
                  value={formData.openaiApiKey}
                  onChange={handleInputChange}
                  placeholder="sk-..."
                />
                <div className="field-hint">
                  Encriptada y guardada de forma segura. Nunca la mostramos en texto plano.
                </div>
              </div>

              <div className="field">
                <div className="field-label">Modelo</div>
                <div className="model-grid">
                  {[
                    { value: 'gpt-4o-mini', name: 'GPT-4o mini', desc: 'Rápido y económico. Ideal para la mayoría de casos.' },
                    { value: 'gpt-4o',      name: 'GPT-4o',      desc: 'Más potente. Mejor para razonamiento complejo.' },
                  ].map((m) => (
                    <button
                      key={m.value}
                      className={`model-option ${formData.openaiModel === m.value ? 'selected' : ''}`}
                      onClick={() => handleChipClick('openaiModel', m.value)}
                    >
                      <div className="model-name">{m.name}</div>
                      <div className="model-desc">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        <div className="form-foot">
          <button className="btn btn-ghost" onClick={handlePrev} disabled={currentStep === 0}>
            <ArrowLeft size={14} />
            Atrás
          </button>
          <div className="form-counter">
            {String(currentStep + 1).padStart(2, '0')} de {String(STEPS.length).padStart(2, '0')}
          </div>
          {currentStep === STEPS.length - 1 ? (
            <div className="foot-actions">
              <button className="btn btn-ghost skip" onClick={handleSave} disabled={isPending}>
                Saltar por ahora
              </button>
              <button className="btn btn-primary voltage" onClick={handleSave} disabled={isPending}>
                {isPending ? 'Creando...' : 'Crear Pielo'}
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={handleNext}>
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
            <br />en acción.
          </div>
        </div>

        <div className="browser-frame">
          <div className="browser-bar">
            <div className="browser-dots">
              <span></span><span></span><span></span>
            </div>
            <div className="browser-url">acme.vercel.app</div>
          </div>
          <div className="site-content">
            <div className="site-head">Tienda <em>Acme</em></div>
            <div className="site-sub">Ropa y accesorios urbanos. Hechos en Chile, enviamos a todo el país.</div>

            <div
              className={`widget ${formData.position}`}
              style={{
                [formData.position === 'bottom-right' ? 'right' : 'left']: '20px',
                bottom: '20px',
              }}
            >
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
