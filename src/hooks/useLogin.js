import { useMutation } from '@tanstack/react-query';
import Auth from '../services/Auth.js';

const useLogin = () =>
  useMutation({
    mutationFn: ({ email, password }) =>
      Auth.login(email, password),
  });

export default useLogin;
