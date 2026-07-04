import { useMutation } from '@tanstack/react-query';
import Auth from '../services/Auth.js';

const useSignup = () =>
  useMutation({
    mutationFn: ({ email, password, name, plan }) =>
      Auth.signup(email, password, name, plan),
  });

export default useSignup;
