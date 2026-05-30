import instance from '../apis/app.js';

class DocumentService {
  list = (workspaceId, chatbotId) =>
    instance.get(`/api/workspaces/${workspaceId}/chatbots/${chatbotId}/documents`);

  upload = (workspaceId, chatbotId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return instance.post(`/api/workspaces/${workspaceId}/chatbots/${chatbotId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  };

  delete = (workspaceId, chatbotId, documentId) =>
    instance.delete(`/api/workspaces/${workspaceId}/chatbots/${chatbotId}/documents/${documentId}`);
}

const Document = new DocumentService();
export default Document;
