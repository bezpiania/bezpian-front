import { useQuery, useMutation } from '@tanstack/react-query';
import Chatbot from '../services/Chatbot.js';

export const useGetQuotes = (workspaceId, chatbotId) => {
  return useQuery({
    queryKey: ['quotes', workspaceId, chatbotId],
    queryFn: async () => {
      if (!workspaceId || !chatbotId) return null;
      return await Chatbot.get(`/api/workspaces/${workspaceId}/chatbots/${chatbotId}/quotes`);
    },
    enabled: !!workspaceId && !!chatbotId,
  });
};

export const useDeleteQuote = (workspaceId, chatbotId) => {
  return useMutation({
    mutationFn: async (quoteId) => {
      return await Chatbot.delete(
        `/api/workspaces/${workspaceId}/chatbots/${chatbotId}/quotes/${quoteId}`
      );
    },
  });
};

export const useUpdateQuoteStatus = (workspaceId, chatbotId) => {
  return useMutation({
    mutationFn: async ({ quoteId, status }) => {
      return await Chatbot.patch(
        `/api/workspaces/${workspaceId}/chatbots/${chatbotId}/quotes/${quoteId}`,
        { status }
      );
    },
  });
};
