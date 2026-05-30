import { useQuery, useMutation } from '@tanstack/react-query';
import Chatbot from '../services/Chatbot.js';

export const useGetAppointments = (workspaceId, chatbotId) => {
  return useQuery({
    queryKey: ['appointments', workspaceId, chatbotId],
    queryFn: async () => {
      if (!workspaceId || !chatbotId) return null;
      return await Chatbot.get(`/api/workspaces/${workspaceId}/chatbots/${chatbotId}/appointments`);
    },
    enabled: !!workspaceId && !!chatbotId,
  });
};

export const useDeleteAppointment = (workspaceId, chatbotId) => {
  return useMutation({
    mutationFn: async (appointmentId) => {
      return await Chatbot.delete(
        `/api/workspaces/${workspaceId}/chatbots/${chatbotId}/appointments/${appointmentId}`
      );
    },
  });
};

export const useUpdateAppointmentStatus = (workspaceId, chatbotId) => {
  return useMutation({
    mutationFn: async ({ appointmentId, status }) => {
      return await Chatbot.patch(
        `/api/workspaces/${workspaceId}/chatbots/${chatbotId}/appointments/${appointmentId}`,
        { status }
      );
    },
  });
};
