import { Task, TaskStatus } from '../types';

export const getTasksByStatus = (tasks: Task[], status: TaskStatus) => {
  return tasks.filter((task) => task.status === status);
};

export const getTaskById = (tasks: Task[], id: string) => {
  return tasks.find((task) => task.id === id);
};
