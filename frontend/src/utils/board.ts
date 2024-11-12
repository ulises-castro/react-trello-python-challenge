import { BoardColumns, TaskStatus, Task } from '../types';
import { getTasksByStatus } from './tasks';

export const initializeBoard = (tasks: Task[]) => {
  const boardCols: BoardColumns = {} as BoardColumns;

  Object.values(TaskStatus).forEach((boardColKey) => {
    boardCols[boardColKey as TaskStatus] = getTasksByStatus(
      tasks,
      boardColKey as TaskStatus
    );
  });

  return boardCols;
};

export const findBoardColumnContainer = (
  boardColumns: BoardColumns,
  id: string
) => {
  if (id in boardColumns) {
    return id;
  }

  const container = Object.keys(boardColumns).find((key) =>
    boardColumns[key as TaskStatus].find((item) => item.id === id)
  );
  return container;
};