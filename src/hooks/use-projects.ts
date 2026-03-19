import { useQueryClient } from "@tanstack/react-query";
import {
  useListProjects as useGeneratedListProjects,
  useGetProject as useGeneratedGetProject,
  useCreateProject as useGeneratedCreateProject,
  useUpdateProject as useGeneratedUpdateProject,
  useDeleteProject as useGeneratedDeleteProject,
  getListProjectsQueryKey,
  getGetProjectQueryKey,
} from "@workspace/api-client-react";

export function useProjects() {
  return useGeneratedListProjects();
}

export function useProject(id: number) {
  return useGeneratedGetProject(id);
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useGeneratedCreateProject({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
      },
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useGeneratedUpdateProject({
    mutation: {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetProjectQueryKey(variables.id) });
      },
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useGeneratedDeleteProject({
    mutation: {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetProjectQueryKey(variables.id) });
      },
    },
  });
}
