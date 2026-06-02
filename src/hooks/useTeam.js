import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Team from '../services/Team.js';

export const useTeam = (workspaceId) =>
  useQuery({
    queryKey: ['team', workspaceId],
    queryFn: () => Team.list(workspaceId),
    enabled: !!workspaceId,
  });

export const useCreateMember = (workspaceId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => Team.create(workspaceId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['team', workspaceId] }),
  });
};

export const useUpdateMemberInfo = (workspaceId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, ...data }) => Team.updateInfo(workspaceId, memberId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['team', workspaceId] }),
  });
};

export const useUpdateMemberRole = (workspaceId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, role }) => Team.updateRole(workspaceId, memberId, role),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['team', workspaceId] }),
  });
};

export const useRemoveMember = (workspaceId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (memberId) => Team.remove(workspaceId, memberId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['team', workspaceId] }),
  });
};
