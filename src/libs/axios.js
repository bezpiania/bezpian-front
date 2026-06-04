import axios from 'axios';

const createInstance = (baseURL) => {
  const instance = axios.create({
    headers: { 'Content-Type': 'application/json' },
    baseURL,
  });

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (res) => res.data,
    (error) => {
      // Token expirado o inválido → limpiar sesión y redirigir al login
      if (error?.response?.status === 401) {
        ['user','accessToken','refreshToken','workspaceId','workspaceRole',
         'activeBotId','activeBotName','activeBotColor','activeBotAvatar','activeBotType']
          .forEach(k => localStorage.removeItem(k));
        // Only redirect if not already on a public page
        const publicPaths = ['/login','/signup','/recuperar','/invitar','/widget','/cotizacion','/mesa'];
        const isPublic = publicPaths.some(p => window.location.pathname.startsWith(p));
        if (!isPublic) window.location.href = '/login';
      }
      throw error;
    }
  );

  return instance;
};

export default createInstance;
