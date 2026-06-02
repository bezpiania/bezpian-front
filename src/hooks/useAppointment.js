import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Appointment from '../services/Appointment.js';

export const useGetAppointments = (workspaceId, chatbotId) => {
  return useQuery({
    queryKey: ['appointments', workspaceId, chatbotId],
    queryFn: () => {
      if (!workspaceId) return { data: [] };
      return Appointment.list(workspaceId, chatbotId);
    },
    enabled: !!workspaceId,
  });
};

export const useCreateAppointment = (workspaceId, chatbotId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (appointmentData) => {
      const response = await Appointment.create(workspaceId, chatbotId, appointmentData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', workspaceId, chatbotId] });
    },
  });
};

export const useUpdateAppointmentStatus = (workspaceId, chatbotId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ appointmentId, status }) => {
      const response = await Appointment.updateStatus(workspaceId, chatbotId, appointmentId, status);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', workspaceId, chatbotId] });
    },
  });
};

export const useDeleteAppointment = (workspaceId, chatbotId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (appointmentId) => {
      const response = await Appointment.delete(workspaceId, chatbotId, appointmentId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', workspaceId, chatbotId] });
    },
  });
};
