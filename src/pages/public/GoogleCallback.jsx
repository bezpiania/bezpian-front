import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { message } from 'antd';

/**
 * Página intermedia que recibe los tokens desde el backend tras el OAuth de Google
 * y los guarda en localStorage antes de redirigir al dashboard.
 */
const GoogleCallback = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken  = params.get('accessToken');
    const refreshToken = params.get('refreshToken');
    const userId       = params.get('userId');
    const name         = params.get('name');
    const email        = params.get('email');
    const workspaceId  = params.get('defaultWorkspaceId');
    const error        = params.get('error');

    if (error || !accessToken) {
      const msgs = {
        google_denied: 'Cancelaste el inicio de sesión con Google.',
        google_token:  'Error al obtener tokens de Google. Intenta de nuevo.',
        google_profile:'No se pudo obtener tu perfil de Google.',
        google_server: 'Error interno. Intenta de nuevo.',
      };
      message.error(msgs[error] || 'Error al iniciar sesión con Google');
      navigate('/login');
      return;
    }

    localStorage.setItem('accessToken',  accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('workspaceId',  workspaceId || '');
    localStorage.setItem('workspaceRole', 'owner');
    localStorage.setItem('user', JSON.stringify({
      id:   userId,
      name,
      email,
      defaultWorkspaceId: workspaceId,
    }));

    message.success(`¡Bienvenido, ${name || email}!`);
    navigate('/bots');
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: 16,
      fontFamily: 'sans-serif',
      color: '#666',
    }}>
      <div style={{
        width: 40, height: 40,
        border: '3px solid #f0f0f0',
        borderTop: '3px solid #FF6B00',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <span>Iniciando sesión con Google…</span>
    </div>
  );
};

export default GoogleCallback;
