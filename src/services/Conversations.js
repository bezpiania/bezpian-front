import Chatbot from './Chatbot.js';

class ConversationsService {
  // Get all conversations with filters
  list = async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.outcome) params.append('outcome', filters.outcome);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.botIds) params.append('botIds', filters.botIds.join(','));

    const queryString = params.toString();
    const url = `/api/conversations${queryString ? '?' + queryString : ''}`;

    return await Chatbot.get(url);
  };

  // Get conversations filtered by chatbot (uses scoped route for correct isolation)
  listByBot = async (workspaceId, chatbotId, filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search)    params.append('search',  filters.search);
    if (filters.status)    params.append('status',  filters.status);
    if (filters.outcome)   params.append('outcome', filters.outcome);
    if (filters.page)      params.append('page',    filters.page);
    if (filters.limit)     params.append('limit',   filters.limit);
    const qs = params.toString();
    const base = workspaceId && chatbotId
      ? `/api/workspaces/${workspaceId}/chatbots/${chatbotId}/conversations`
      : '/api/conversations';
    return await Chatbot.get(`${base}${qs ? '?' + qs : ''}`);
  };

  // Get single conversation with messages
  get = async (conversationId) => {
    return await Chatbot.get(`/api/conversations/${conversationId}`);
  };

  // Get messages for a conversation
  getMessages = async (conversationId) => {
    return await Chatbot.get(`/api/conversations/${conversationId}/messages`);
  };

  // Update conversation status
  updateStatus = async (conversationId, status) => {
    return await Chatbot.patch(`/api/conversations/${conversationId}`, { status });
  };

  // Mark as spam
  markSpam = async (conversationId) => {
    return await Chatbot.post(`/api/conversations/${conversationId}/spam`);
  };

  // Close conversation
  close = async (conversationId) => {
    return await Chatbot.post(`/api/conversations/${conversationId}/close`);
  };
}

export default new ConversationsService();
