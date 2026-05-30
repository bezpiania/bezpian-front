import React, { useState, useEffect } from 'react';
import { message, Spin } from 'antd';
import Chatbot from '../../services/Chatbot.js';

const AppointmentsPanel = ({ workspaceId, botId, bot }) => {
  const [config, setConfig] = useState({
    timezone: bot?.integrations?.calendar?.timezone || 'America/Santiago',
    bufferMinutes: bot?.integrations?.calendar?.bufferMinutes || 0,
    maxDaysInAdvance: bot?.integrations?.calendar?.maxDaysInAdvance || 30,
    businessHours: {
      start: bot?.integrations?.calendar?.businessHoursStart || '09:00',
      end: bot?.integrations?.calendar?.businessHoursEnd || '18:00',
    },
    workingDays: bot?.integrations?.calendar?.workingDays || [1, 2, 3, 4, 5],
  });

  const [loading, setLoading] = useState(false);
  const [showGoogleOAuthModal, setShowGoogleOAuthModal] = useState(false);
  const [googleOAuthForm, setGoogleOAuthForm] = useState({
    googleClientId: bot?.integrations?.calendar?.googleClientId || '',
    googleClientSecret: bot?.integrations?.calendar?.googleClientSecret || ''
  });
  const [googleConfigured, setGoogleConfigured] = useState(!!bot?.integrations?.calendar?.googleClientId);
  const isGoogleConnected = !!bot?.integrations?.calendar?.accessToken;

  useEffect(() => {
    console.log('AppointmentsPanel received:', { workspaceId, botId, bot });
  }, [workspaceId, botId, bot]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await Chatbot.patch(`/api/workspaces/${workspaceId}/chatbots/${botId}`, {
        integrations: {
          ...bot.integrations,
          calendar: {
            ...bot.integrations?.calendar,
            timezone: config.timezone,
            bufferMinutes: config.bufferMinutes,
            maxDaysInAdvance: config.maxDaysInAdvance,
            businessHoursStart: config.businessHours.start,
            businessHoursEnd: config.businessHours.end,
            workingDays: config.workingDays,
          }
        }
      });
      message.success('Configuración de Citas guardada');
    } catch (error) {
      message.error('Error al guardar configuración');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGoogleOAuth = async () => {
    try {
      if (!googleOAuthForm.googleClientId || !googleOAuthForm.googleClientSecret) {
        message.error('Client ID y Client Secret son requeridos');
        return;
      }

      setLoading(true);
      const response = await Chatbot.patch(`/api/workspaces/${workspaceId}/chatbots/${botId}/google-oauth`, {
        googleClientId: googleOAuthForm.googleClientId,
        googleClientSecret: googleOAuthForm.googleClientSecret
      });

      if (response.data?.success) {
        message.success('Credenciales de Google configuradas correctamente');
        setGoogleConfigured(true);
        setShowGoogleOAuthModal(false);
      } else {
        message.error(response.data?.message || 'Error al guardar credenciales');
      }
    } catch (error) {
      message.error('Error al guardar credenciales de Google');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectGoogle = async () => {
    try {
      if (!googleConfigured) {
        message.error('Por favor, configura tus credenciales de Google primero');
        setShowGoogleOAuthModal(true);
        return;
      }

      setLoading(true);

      // Validar que tenemos los IDs necesarios
      if (!workspaceId) {
        message.error('Workspace ID no encontrado. Por favor recarga la página.');
        console.error('Missing workspaceId:', workspaceId);
        setLoading(false);
        return;
      }

      if (!botId) {
        message.error('Bot ID no encontrado. Por favor recarga la página.');
        console.error('Missing botId:', botId);
        setLoading(false);
        return;
      }

      const url = `/api/workspaces/${workspaceId}/chatbots/${botId}/calendar/auth-url`;
      console.log('Conectando Google Calendar con URL:', url);

      const response = await Chatbot.get(url);
      console.log('=== RESPUESTA COMPLETA ===');
      console.log('response:', response);
      console.log('response?.success:', response?.success);
      console.log('response?.data:', response?.data);
      console.log('response?.data?.authUrl:', response?.data?.authUrl);

      // El interceptor de axios extrae res.data, así que accedemos directamente a data.authUrl
      if (response?.success && response?.data?.authUrl) {
        console.log('✅ Redirigiendo a:', response.data.authUrl);
        window.location.href = response.data.authUrl;
      } else {
        const errorMsg = `Response: success=${response?.success}, authUrl=${response?.data?.authUrl}`;
        message.error('No se recibió URL de autenticación válida - ' + errorMsg);
        console.error('Invalid response:', response);
      }
    } catch (error) {
      message.error('Error al iniciar conexión con Google: ' + (error.message || 'Error desconocido'));
      console.error('Error conectando Google:', error);
    } finally {
      setLoading(false);
    }
  };

  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  const toggleDay = (dayIndex) => {
    setConfig(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(dayIndex)
        ? prev.workingDays.filter(d => d !== dayIndex)
        : [...prev.workingDays, dayIndex].sort()
    }));
  };


  return (
    <>
      <div className="section-head">
        <div>
          <div className="section-num">Agendamiento</div>
          <div className="section-title">Configura <em>horarios y disponibilidad</em></div>
        </div>
      </div>

      <div className="section-head" style={{ marginTop: 32 }}>
            <div>
              <div className="section-num">Configuración de Citas</div>
          <div className="section-title">Define horarios y disponibilidad de <em>agendar citas</em></div>
        </div>
      </div>

      <div className="grid-2-eq">
        <div className="card">
          <div className="section-num">Horario de atención</div>
          <div style={{ marginTop: 12 }}>
            <div className="field">
              <label className="field-label">Zona horaria</label>
              <select
                className="select"
                value={config.timezone}
                onChange={(e) => setConfig(prev => ({ ...prev, timezone: e.target.value }))}
              >
                <option value="America/Santiago">Santiago, Chile</option>
                <option value="America/Buenos_Aires">Buenos Aires, Argentina</option>
                <option value="America/Mexico_City">Ciudad de México</option>
                <option value="America/New_York">Nueva York</option>
                <option value="Europe/Madrid">Madrid, España</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="field">
                <label className="field-label">Hora inicio</label>
                <input
                  type="time"
                  className="input"
                  value={config.businessHours.start}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    businessHours: { ...prev.businessHours, start: e.target.value }
                  }))}
                />
              </div>
              <div className="field">
                <label className="field-label">Hora fin</label>
                <input
                  type="time"
                  className="input"
                  value={config.businessHours.end}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    businessHours: { ...prev.businessHours, end: e.target.value }
                  }))}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="section-num">Días de trabajo</div>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {days.map((day, index) => (
              <label key={index} style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={config.workingDays.includes(index)}
                  onChange={() => toggleDay(index)}
                />
                <span>{day}</span>
              </label>
            ))}
          </div>
          <small style={{ marginTop: 16, display: 'block', opacity: 0.6 }}>
            Selecciona los días en que tu equipo atiende citas.
          </small>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <div className="section-num">Configuración avanzada</div>
        <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="field">
            <label className="field-label">Buffer entre citas (minutos)</label>
            <input
              type="number"
              className="input"
              value={config.bufferMinutes}
              onChange={(e) => setConfig(prev => ({ ...prev, bufferMinutes: parseInt(e.target.value) }))}
              min="0"
              max="120"
            />
            <small style={{ marginTop: 6, display: 'block', opacity: 0.6 }}>
              Tiempo mínimo entre citas consecutivas.
            </small>
          </div>

          <div className="field">
            <label className="field-label">Máximo días en avance</label>
            <input
              type="number"
              className="input"
              value={config.maxDaysInAdvance}
              onChange={(e) => setConfig(prev => ({ ...prev, maxDaysInAdvance: parseInt(e.target.value) }))}
              min="1"
              max="365"
            />
            <small style={{ marginTop: 6, display: 'block', opacity: 0.6 }}>
              Cuántos días en el futuro se pueden agendar citas.
            </small>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <div className="section-num">Credenciales de Google OAuth</div>
        <div style={{ marginTop: 12 }}>
          <div className="field">
            <label className="field-label">Estado de configuración</label>
            <div style={{ background: 'var(--bone)', border: '1px solid var(--rule)', borderRadius: 8, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: googleConfigured ? '#16a766' : '#ff7a45' }}>
                {googleConfigured ? '✅ Credenciales configuradas' : '⚠️ Credenciales no configuradas'}
              </span>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowGoogleOAuthModal(true)}
                disabled={loading}
              >
                {googleConfigured ? 'Actualizar' : 'Configurar'} Credenciales
              </button>
            </div>
            <small style={{ marginTop: 6, display: 'block', opacity: 0.6 }}>
              Necesitas configurar tu Google Client ID y Secret para conectar Google Calendar.
            </small>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <div className="section-num">Integración con Google Calendar</div>
        <div style={{ marginTop: 12 }}>
          <div className="field">
            <label className="field-label">Estado de conexión</label>
            <div style={{ background: 'var(--bone)', border: '1px solid var(--rule)', borderRadius: 8, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: isGoogleConnected ? '#16a766' : 'var(--carbon)' }}>
                {isGoogleConnected ? '✅ Conectado a Google Calendar' : '❌ No conectado'}
              </span>
              {!isGoogleConnected && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleConnectGoogle}
                  disabled={loading || !googleConfigured}
                >
                  {loading ? 'Conectando...' : 'Conectar Google Calendar'}
                </button>
              )}
            </div>
            <small style={{ marginTop: 6, display: 'block', opacity: 0.6 }}>
              Sincroniza las citas agendadas en tu Google Calendar automáticamente. {!googleConfigured && '(Primero configura tus credenciales)'}
            </small>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar configuración'}
        </button>
      </div>

      {/* Modal para configurar Google OAuth */}
      {showGoogleOAuthModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: 12,
            padding: 24,
            maxWidth: 500,
            width: '90%',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{ margin: 0, marginBottom: 8 }}>Configurar Google OAuth</h3>
            <p style={{ margin: '0 0 20px 0', fontSize: 13, opacity: 0.7 }}>
              Ingresa tus credenciales de Google Cloud Console para conectar Google Calendar
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="field">
                <label className="field-label">Google Client ID *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Tu Google Client ID"
                  value={googleOAuthForm.googleClientId}
                  onChange={(e) => setGoogleOAuthForm({ ...googleOAuthForm, googleClientId: e.target.value })}
                  style={{ marginTop: 6 }}
                />
                <small style={{ marginTop: 6, display: 'block', opacity: 0.6 }}>
                  Obtén esto de <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">Google Cloud Console</a>
                </small>
              </div>

              <div className="field">
                <label className="field-label">Google Client Secret *</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Tu Google Client Secret"
                  value={googleOAuthForm.googleClientSecret}
                  onChange={(e) => setGoogleOAuthForm({ ...googleOAuthForm, googleClientSecret: e.target.value })}
                  style={{ marginTop: 6 }}
                />
              </div>

              <div style={{ background: '#f0f8ff', border: '1px solid #b3d9ff', borderRadius: 8, padding: 12 }}>
                <strong style={{ fontSize: 12 }}>📌 Pasos:</strong>
                <ol style={{ margin: '8px 0 0 0', paddingLeft: 20, fontSize: 12 }}>
                  <li>Ve a Google Cloud Console</li>
                  <li>Crea un nuevo proyecto o usa uno existente</li>
                  <li>Habilita Google Calendar API</li>
                  <li>Crea credenciales OAuth 2.0 (Desktop app)</li>
                  <li>Copia Client ID y Secret aquí</li>
                </ol>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button
                className="btn btn-secondary"
                onClick={() => setShowGoogleOAuthModal(false)}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSaveGoogleOAuth}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Credenciales'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentsPanel;
