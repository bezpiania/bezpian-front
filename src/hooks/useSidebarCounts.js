import { useQuery } from '@tanstack/react-query';
import api from '../apis/app.js';

export const useSidebarCounts = (workspaceId, chatbotId) => {
  return useQuery({
    queryKey: ['sidebar-counts', workspaceId, chatbotId],
    queryFn: async () => {
      if (!workspaceId) return {};
      const url = chatbotId
        ? `/api/workspaces/${workspaceId}/counts?chatbotId=${chatbotId}`
        : `/api/workspaces/${workspaceId}/counts`;
      const res = await api.get(url);
      return res?.data?.data || {};
    },
    enabled: !!workspaceId,
    staleTime:      60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });
};
