import instance from '../apis/app.js';

class TeamService {
  list   = (workspaceId) => instance.get(`/api/workspaces/${workspaceId}/members`);
  invite = (workspaceId, email, role) => instance.post(`/api/workspaces/${workspaceId}/invite`, { email, role });
  update = (workspaceId, memberId, role) => instance.patch(`/api/workspaces/${workspaceId}/members/${memberId}`, { role });
  remove = (workspaceId, memberId) => instance.delete(`/api/workspaces/${workspaceId}/members/${memberId}`);
}

export default new TeamService();
