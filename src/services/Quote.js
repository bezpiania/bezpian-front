import instance from '../apis/app.js';

class QuoteService {
  listByWorkspace = (workspaceId) =>
    instance.get(`/api/workspaces/${workspaceId}/quotes`);

  list = (workspaceId, chatbotId) =>
    instance.get(`/api/workspaces/${workspaceId}/chatbots/${chatbotId}/quotes`);

  get = (quoteId, workspaceId) => {
    // Si workspaceId está disponible, usarlo
    if (workspaceId) {
      return instance.get(`/api/workspaces/${workspaceId}/quotes/${quoteId}`);
    }
    // Fallback a la ruta sin workspace (si existe)
    return instance.get(`/api/quotes/${quoteId}`);
  };

  create = (workspaceId, chatbotId, quoteData) =>
    instance.post(`/api/workspaces/${workspaceId}/chatbots/${chatbotId}/quotes`, quoteData);

  update = (workspaceId, chatbotId, quoteId, updates) =>
    instance.patch(`/api/workspaces/${workspaceId}/chatbots/${chatbotId}/quotes/${quoteId}`, updates);

  delete = (workspaceId, chatbotId, quoteId) =>
    instance.delete(`/api/workspaces/${workspaceId}/chatbots/${chatbotId}/quotes/${quoteId}`);

  getPDF = (quoteId) =>
    instance.get(`/api/quotes/${quoteId}/pdf`);

  getShareLink = (workspaceId, chatbotId, quoteId) =>
    instance.get(`/api/workspaces/${workspaceId}/chatbots/${chatbotId}/quotes/${quoteId}/share`);

  resend = (workspaceId, chatbotId, quoteId) =>
    instance.post(`/api/workspaces/${workspaceId}/chatbots/${chatbotId}/quotes/${quoteId}/resend`);

  accept = (quoteId) =>
    instance.post(`/api/quotes/${quoteId}/accept`);

  getFields = (workspaceId, chatbotId) =>
    instance.get(`/api/workspaces/${workspaceId}/chatbots/${chatbotId}/quote-fields`);

  getByShareToken = (shareToken) =>
    instance.get(`/api/quotes/public/${shareToken}`);
}

const Quote = new QuoteService();
export default Quote;
