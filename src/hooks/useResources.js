import { useQuery } from '@tanstack/react-query';
import api from '../apis/app.js';

export const useResources = (workspaceId, chatbotId) => {
  return useQuery({
    queryKey: ['resources', workspaceId, chatbotId],
    queryFn: () => api.get(`/api/workspaces/${workspaceId}/chatbots/${chatbotId}/resources`),
    enabled: !!workspaceId && !!chatbotId,
    select: data => data?.resources || [],
  });
};
