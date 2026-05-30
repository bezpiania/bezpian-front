import instance from '../apis/app.js';

class ChatbotService {
  create = (workspaceId, chatbotData) =>
    instance.post(`/api/workspaces/${workspaceId}/chatbots`, chatbotData);

  getAll = (workspaceId) =>
    instance.get(`/api/workspaces/${workspaceId}/chatbots`);

  getById = (workspaceId, id) =>
    instance.get(`/api/workspaces/${workspaceId}/chatbots/${id}`);

  update = (workspaceId, id, chatbotData) =>
    instance.patch(`/api/workspaces/${workspaceId}/chatbots/${id}`, chatbotData);

  delete = (workspaceId, id) =>
    instance.delete(`/api/workspaces/${workspaceId}/chatbots/${id}`);

  activate = (workspaceId, id) =>
    instance.post(`/api/workspaces/${workspaceId}/chatbots/${id}/activate`);

  pause = (workspaceId, id) =>
    instance.post(`/api/workspaces/${workspaceId}/chatbots/${id}/pause`);

  getEmbedCode = (workspaceId, id) =>
    instance.get(`/api/workspaces/${workspaceId}/chatbots/${id}/embed-code`);

  getStats = (workspaceId, id) =>
    instance.get(`/api/workspaces/${workspaceId}/chatbots/${id}/stats`);

  updateOpenaiConfig = (workspaceId, id, config) =>
    instance.patch(`/api/workspaces/${workspaceId}/chatbots/${id}/openai-config`, config);

  getOpenaiConfig = (workspaceId, id) =>
    instance.get(`/api/workspaces/${workspaceId}/chatbots/${id}/openai-config`);

  getConfig = (workspaceId, chatbotId) =>
    instance.get(`/api/workspaces/${workspaceId}/chatbots/${chatbotId}/config`);

  saveConfig = (workspaceId, chatbotId, configData) =>
    instance.post(`/api/workspaces/${workspaceId}/chatbots/${chatbotId}/config`, configData);

  uploadDocument = (workspaceId, chatbotId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return instance.post(`/api/workspaces/${workspaceId}/chatbots/${chatbotId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  };

  // Embed endpoints (public)
  post = (endpoint, data) => instance.post(endpoint, data);
  get = (endpoint) => instance.get(endpoint);
}

const Chatbot = new ChatbotService();
export default Chatbot;
