import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Quote from '../services/Quote.js';

export const useGetQuotes = (workspaceId, chatbotId) => {
  return useQuery({
    queryKey: ['quotes', workspaceId, chatbotId],
    queryFn: async () => {
      if (!workspaceId) return null;
      const response = chatbotId
        ? await Quote.list(workspaceId, chatbotId)
        : await Quote.listByWorkspace(workspaceId);
      return response.data;
    },
    enabled: !!workspaceId,
  });
};

export const useDeleteQuote = (workspaceId, chatbotId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (quoteId) => {
      const response = await Quote.delete(workspaceId, chatbotId, quoteId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
  });
};

export const useUpdateQuoteStatus = (workspaceId, chatbotId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ quoteId, status }) => {
      const response = await Quote.update(workspaceId, chatbotId, quoteId, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
  });
};
