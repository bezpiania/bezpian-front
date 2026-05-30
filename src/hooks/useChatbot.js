import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Chatbot from '../services/Chatbot.js';

export const useCreateChatbot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workspaceId, chatbotData }) =>
      Chatbot.create(workspaceId, chatbotData),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: ['chatbots', workspaceId] });
    },
  });
};

export const useGetChatbots = (workspaceId) =>
  useQuery({
    queryKey: ['chatbots', workspaceId],
    queryFn: () => Chatbot.getAll(workspaceId),
    enabled: !!workspaceId,
  });

export const useGetChatbot = (workspaceId, id) =>
  useQuery({
    queryKey: ['chatbot', workspaceId, id],
    queryFn: () => Chatbot.getById(workspaceId, id),
    enabled: !!workspaceId && !!id,
  });

export const useUpdateChatbot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workspaceId, id, data }) =>
      Chatbot.update(workspaceId, id, data),
    onSuccess: (_, { workspaceId, id }) => {
      queryClient.invalidateQueries({ queryKey: ['chatbot', workspaceId, id] });
      queryClient.invalidateQueries({ queryKey: ['chatbots', workspaceId] });
    },
  });
};

export const useDeleteChatbot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workspaceId, id }) =>
      Chatbot.delete(workspaceId, id),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: ['chatbots', workspaceId] });
    },
  });
};

export const useActivateChatbot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workspaceId, id }) =>
      Chatbot.activate(workspaceId, id),
    onSuccess: (_, { workspaceId, id }) => {
      queryClient.invalidateQueries({ queryKey: ['chatbot', workspaceId, id] });
      queryClient.invalidateQueries({ queryKey: ['chatbots', workspaceId] });
    },
  });
};

export const usePauseChatbot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workspaceId, id }) =>
      Chatbot.pause(workspaceId, id),
    onSuccess: (_, { workspaceId, id }) => {
      queryClient.invalidateQueries({ queryKey: ['chatbot', workspaceId, id] });
      queryClient.invalidateQueries({ queryKey: ['chatbots', workspaceId] });
    },
  });
};
