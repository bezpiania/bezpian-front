import { useQuery, useMutation } from '@tanstack/react-query';
import Chatbot from '../services/Chatbot.js';

export const useGetLeads = (workspaceId, chatbotId) => {
  return useQuery({
    queryKey: ['leads', workspaceId, chatbotId],
    queryFn: async () => {
      if (!workspaceId || !chatbotId) return null;
      return await Chatbot.get(`/api/workspaces/${workspaceId}/chatbots/${chatbotId}/leads`);
    },
    enabled: !!workspaceId && !!chatbotId,
  });
};

export const useDeleteLead = (workspaceId, chatbotId) => {
  return useMutation({
    mutationFn: async (leadId) => {
      return await Chatbot.delete(
        `/api/workspaces/${workspaceId}/chatbots/${chatbotId}/leads/${leadId}`
      );
    },
  });
};
