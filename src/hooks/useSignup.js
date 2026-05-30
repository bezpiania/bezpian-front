import { useMutation } from '@tanstack/react-query';
import Auth from '../services/Auth.js';

const useSignup = () =>
  useMutation({
    mutationFn: ({ email, password, name }) =>
      Auth.signup(email, password, name),
  });

export default useSignup;
