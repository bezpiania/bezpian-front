import instance from '../apis/app.js';

class AppointmentService {
  create = (workspaceId, chatbotId, appointmentData) =>
    instance.post(`/api/workspaces/${workspaceId}/chatbots/${chatbotId}/appointments`, appointmentData);

  list = (workspaceId, chatbotId) =>
    chatbotId
      ? instance.get(`/api/workspaces/${workspaceId}/chatbots/${chatbotId}/appointments`)
      : instance.get(`/api/workspaces/${workspaceId}/appointments`);

  get = (workspaceId, chatbotId, id) =>
    instance.get(`/api/workspaces/${workspaceId}/chatbots/${chatbotId}/appointments/${id}`);

  updateStatus = (workspaceId, chatbotId, id, status) =>
    instance.patch(`/api/workspaces/${workspaceId}/chatbots/${chatbotId}/appointments/${id}`, { status });

  delete = (workspaceId, chatbotId, id) =>
    instance.delete(`/api/workspaces/${workspaceId}/chatbots/${chatbotId}/appointments/${id}`);

  reschedule = (workspaceId, chatbotId, id, scheduledAt) =>
    instance.post(`/api/workspaces/${workspaceId}/chatbots/${chatbotId}/appointments/${id}/reschedule`, { scheduledAt });
}

const Appointment = new AppointmentService();
export default Appointment;
