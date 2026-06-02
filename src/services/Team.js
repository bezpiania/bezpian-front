import instance from '../apis/app.js';

class TeamService {
  list       = (workspaceId) => instance.get(`/api/workspaces/${workspaceId}/members`);
  create     = (workspaceId, data) => instance.post(`/api/workspaces/${workspaceId}/members`, data);
  updateInfo = (workspaceId, memberId, data) => instance.put(`/api/workspaces/${workspaceId}/members/${memberId}`, data);
  updateRole = (workspaceId, memberId, role) => instance.patch(`/api/workspaces/${workspaceId}/members/${memberId}`, { role });
  remove     = (workspaceId, memberId) => instance.delete(`/api/workspaces/${workspaceId}/members/${memberId}`);
}

export default new TeamService();
