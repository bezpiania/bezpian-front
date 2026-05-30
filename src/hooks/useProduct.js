import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Product from '../services/Product.js';

export const useGetProducts = (workspaceId, chatbotId) =>
  useQuery({
    queryKey: ['products', workspaceId, chatbotId],
    queryFn: () => Product.list(workspaceId, chatbotId),
    enabled: !!workspaceId && !!chatbotId,
  });

export const useSyncProducts = (workspaceId, chatbotId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => Product.sync(workspaceId, chatbotId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', workspaceId, chatbotId] });
    },
  });
};

export const useSearchProducts = (workspaceId, chatbotId, query) =>
  useQuery({
    queryKey: ['products-search', workspaceId, chatbotId, query],
    queryFn: () => Product.search(workspaceId, chatbotId, query),
    enabled: !!workspaceId && !!chatbotId && !!query,
  });
