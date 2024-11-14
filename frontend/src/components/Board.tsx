import { useEffect, useState } from 'react';
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
import { BoardColumnsType } from '../types';
import { getTaskById } from '../utils/tasks';
import { findBoardColumnContainer, initializeBoard } from '../utils/board';
import BoardColumn from './BoardColumn';
import TaskItem from './TaskItem';

import { gql, useQuery } from "@apollo/client";
import { ITask } from "./types";


const GET_TASKS_BY_STATUS = gql`
  query TasksByStatus($status: String!) {
		tasksByStatus(status: $status) {
    taskID
    title
		description
  	}
  }
`;

const GET_ALL_TASKS = gql`
  query ALL_TASKS {
		tasks {
      id
      taskID
      title
      description
      status
  	}
  }
`;


export default function Board() {
  const { loading, error, data } = useQuery<ITask[]>(GET_ALL_TASKS);

  const tasks = DUMMY_TASKS;
  const [boardColumns, setBoardColumns] =
    useState<BoardColumnsType | null>(null);

  const [activeId, setActiveId] = useState<null | string>(null);


  useEffect(() => {
    if (loading || !data) return

    if (data?.tasks) {
      // const newBoardCols = {}

      const initialBoardColumns = initializeBoard(data.tasks)
      setBoardColumns(initialBoardColumns)
    }

  }, [loading, data])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const validateDragDropArea = (event: DragOverEvent | DragEndEvent, dragEnd = false) => {
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
    if (invalidDroppableArea || isSameDroppableBoard && !dragEnd || !isSameDroppableBoard && dragEnd) return null

    return {
      activeContainer, overContainer
    }
  }

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string);
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
    const validation = validateDragDropArea(event, true)

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

    setActiveId(null);
  };

  const dropAnimation: DropAnimation = {
    ...defaultDropAnimation,
  };

  if (loading || !boardColumns) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  const task = activeId ? getTaskById(data.tasks, activeId) : null;
  // const task = activeTaskId ? getTaskById(tasks, activeTaskId) : null;

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
