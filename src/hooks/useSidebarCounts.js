import { useQuery } from '@tanstack/react-query';
import api from '../apis/app.js';

export const useSidebarCounts = (workspaceId) => {
  return useQuery({
    queryKey: ['sidebar-counts', workspaceId],
    queryFn: async () => {
      if (!workspaceId) return {};
      const res = await api.get(`/api/workspaces/${workspaceId}/counts`);
      return res?.data || {};
    },
    enabled: !!workspaceId,
    staleTime: 60 * 1000,       // refresca cada 1 minuto
    refetchInterval: 2 * 60 * 1000, // polling cada 2 minutos
  });
};
