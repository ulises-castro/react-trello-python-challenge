import { ITask } from '../types';

export const getTasksByStatus = (tasks: ITask[], status: string) => {
  return tasks.filter((task) => task.status === status);
};

export const getTaskById = (tasks: ITask[], id: string) => {
  return tasks.find((task) => task.id === id);
};
