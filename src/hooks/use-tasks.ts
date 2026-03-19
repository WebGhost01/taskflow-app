import { useQueryClient } from "@tanstack/react-query";
import {
  useListTasks as useGeneratedListTasks,
  useCreateTask as useGeneratedCreateTask,
  useUpdateTask as useGeneratedUpdateTask,
  useDeleteTask as useGeneratedDeleteTask,
  getListTasksQueryKey,
  type ListTasksParams,
} from "@workspace/api-client-react";

export function useTasks(params?: ListTasksParams) {
  return useGeneratedListTasks(params);
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useGeneratedCreateTask({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListTasksQueryKey() });
      },
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useGeneratedUpdateTask({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListTasksQueryKey() });
      },
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useGeneratedDeleteTask({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListTasksQueryKey() });
      },
    },
  });
}
