import { useQuery } from '@tanstack/react-query';
import Chatbot from '../services/Chatbot.js';

export const useGetConversations = (workspaceId, chatbotId) => {
  return useQuery({
    queryKey: ['conversations', workspaceId, chatbotId],
    queryFn: async () => {
      if (!workspaceId || !chatbotId) return null;
      return await Chatbot.get(`/api/workspaces/${workspaceId}/chatbots/${chatbotId}/conversations`);
    },
    enabled: !!workspaceId && !!chatbotId,
  });
};

export const useGetConversationMessages = (workspaceId, chatbotId, conversationId) => {
  return useQuery({
    queryKey: ['conversationMessages', workspaceId, chatbotId, conversationId],
    queryFn: async () => {
      if (!workspaceId || !chatbotId || !conversationId) return null;
      return await Chatbot.get(
        `/api/workspaces/${workspaceId}/chatbots/${chatbotId}/conversations/${conversationId}/messages`
      );
    },
    enabled: !!workspaceId && !!chatbotId && !!conversationId,
  });
};
