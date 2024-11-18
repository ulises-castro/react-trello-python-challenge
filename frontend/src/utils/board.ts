import { TaskStatuses } from '@/constants';
import {
  BoardColumnsType, TaskStatusType, ITask
} from '../types';
import { getTasksByStatus } from './tasks';

export const initializeBoard = (tasks: ITask[]) => {
  const boardCols: BoardColumnsType = {} as BoardColumnsType;

  Object.values(TaskStatuses).forEach((boardColKey) => {
    boardCols[boardColKey as keyof TaskStatusType] = getTasksByStatus(
      tasks,
      boardColKey as string
    );
  });

  return boardCols;
};

export const findBoardColumnContainer = (
  boardCols: BoardColumnsType,
  id: string
) => {
  if (id in boardCols) {
    return id;
  }

  const container = Object.keys(boardCols).find((key) =>
    boardCols[key as keyof TaskStatusType].find((taskItem: ITask) => taskItem.id === id)
  );
  return container;
};
