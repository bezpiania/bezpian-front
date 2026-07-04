import instance from '../apis/app.js';

class AuthService {
  signup = (email, password, name, plan) =>
    instance.post('/api/auth/signup', { email, password, name, plan });

  login = (email, password) =>
    instance.post('/api/auth/login', { email, password });

  verifyEmail = (token) =>
    instance.post('/api/auth/verify-email', { token });

  resendVerification = (email) =>
    instance.post('/api/auth/resend-verification', { email });

  forgotPassword = (email) =>
    instance.post('/api/auth/forgot-password', { email });

  resetPassword = (token, newPassword) =>
    instance.post('/api/auth/reset-password', { token, newPassword });
}

const Auth = new AuthService();
export default Auth;
