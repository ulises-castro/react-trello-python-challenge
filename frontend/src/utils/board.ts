import { TaskStatuses } from '@/constants';
import {
  BoardColumnsType, TaskStatusType, ITask,
  TaskStatusOption
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
  boardColumns: BoardColumnsType,
  id: TaskStatusOption
): TaskStatusOption => {
  if (id in boardColumns) {
    return id;
  }

  const container = Object.keys(boardColumns).find((key) =>
    boardColumns[key as keyof BoardColumnsType]!.find((taskItem: ITask) => taskItem.id === id)
  );

  return container as TaskStatusOption;
};
