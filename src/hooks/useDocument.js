import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Document from '../services/Document.js';

export const useGetDocuments = (workspaceId, chatbotId) =>
  useQuery({
    queryKey: ['documents', workspaceId, chatbotId],
    queryFn: () => Document.list(workspaceId, chatbotId),
    enabled: !!workspaceId && !!chatbotId,
  });

export const useUploadDocument = (workspaceId, chatbotId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file) => Document.upload(workspaceId, chatbotId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', workspaceId, chatbotId] });
    },
  });
};

export const useDeleteDocument = (workspaceId, chatbotId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (documentId) => Document.delete(workspaceId, chatbotId, documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', workspaceId, chatbotId] });
    },
  });
};
