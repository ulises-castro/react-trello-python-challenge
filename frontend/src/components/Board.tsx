import { useState } from 'react';
import {
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  DndContext,
  closestCorners,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  DragOverlay,
  DropAnimation,
  defaultDropAnimation,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';

import { DUMMY_TASKS } from '../data';
import { BoardColumns } from '../types';
import { getTaskById } from '../utils/tasks';
import { findBoardColumnContainer, initializeBoard } from '../utils/board';
import BoardColumn from './BoardColumn';
import TaskItem from './TaskItem';

export default function Board() {
  const tasks = DUMMY_TASKS;
  const initialBoardColumns = initializeBoard(DUMMY_TASKS);
  const [boardColumns, setBoardColumns] =
    useState<BoardColumns>(initialBoardColumns);

  const [activeTaskId, setActiveTaskId] = useState<null | string>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const validateDragDropArea = (event: DragOverEvent | DragEndEvent) => {
    const { active, over } = event
    // Find the containers
    const activeContainer = findBoardColumnContainer(
      boardColumns,
      active.id as string
    );
    const overContainer = findBoardColumnContainer(
      boardColumns,
      over?.id as string
    );

    const isSameDroppableBoard = activeContainer === overContainer
    const invalidDroppableArea = !activeContainer || !overContainer
    if (invalidDroppableArea || isSameDroppableBoard) return null

    return {
      activeContainer, overContainer
    }
  }

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveTaskId(active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const validation = validateDragDropArea(event)

    if (!validation) return
    const { active, over } = event
    const { activeContainer, overContainer } = validation

    setBoardColumns((boardColumn) => {
      const activeItems = boardColumn[activeContainer];
      const overItems = boardColumn[overContainer];

      // Find the indexes for the items
      const activeIndex = activeItems.findIndex(
        (item) => item.id === active.id
      );
      const overIndex = overItems.findIndex((item) => item.id !== over?.id);

      return {
        ...boardColumn,
        [activeContainer]: [
          ...boardColumn[activeContainer].filter(
            (item) => item.id !== active.id
          ),
        ],
        [overContainer]: [
          ...boardColumn[overContainer].slice(0, overIndex),
          boardColumns[activeContainer][activeIndex],
          ...boardColumn[overContainer].slice(
            overIndex,
            boardColumn[overContainer].length
          ),
        ],
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const validation = validateDragDropArea(event)

    if (!validation) return
    const { active, over } = event
    const { activeContainer, overContainer } = validation

    const activeIndex = boardColumns[activeContainer].findIndex(
      (task) => task.id === active.id
    );
    const overIndex = boardColumns[overContainer].findIndex(
      (task) => task.id === over?.id
    );

    if (activeIndex !== overIndex) {
      setBoardColumns((boardCol) => ({
        ...boardCol,
        [overContainer]: arrayMove(
          boardCol[overContainer],
          activeIndex,
          overIndex
        ),
      }));
    }

    setActiveTaskId(null);
  };

  const dropAnimation: DropAnimation = {
    ...defaultDropAnimation,
  };

  const task = activeTaskId ? getTaskById(tasks, activeTaskId) : null;

  return (
    <div className='min-w-[768px] overflow-x-auto mx-auto px-4'>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-row w-full gap-4">
          {Object.keys(boardColumns).map((boardColKey) => (
            <div className='w-80' key={boardColKey}>
              <BoardColumn
                id={boardColKey}
                title={boardColKey}
                tasks={boardColumns[boardColKey]}
              />
            </div>
          ))}
          <DragOverlay dropAnimation={dropAnimation}>
            {task ? <TaskItem task={task} /> : null}
          </DragOverlay>
        </div>
      </DndContext>
    </div>
  );
};
