import {
  DndContext,
  closestCorners, DragOverlay
} from '@dnd-kit/core';

import TaskList from '../TaskList';
import TaskItem from '../TaskItem';

import { BoardProvider } from '@/state/BoardProvider';
import useBoard from '@/hooks/useBoard';
import TaskModal from '../task/TaskModal';
import { TaskStatusOption } from '@/types';

export default function Board() {
  const {
    dragDrop,
    error,
    loading,
    boardColumns,
    refetch,
  } = useBoard()

  const {
    activeTask,
    dropAnimation,
    handleDragEnd,
    handleDragOver,
    handleDragStart,
    sensors,
  } = dragDrop 

  if (loading || !boardColumns) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <div className='min-w-[768px] overflow-x-auto mx-auto px-4'>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <BoardProvider refetchTasks={refetch}>
          <TaskModal />
          <div className="flex flex-row w-full gap-4">
            {Object.keys(boardColumns).map((boardColKey) => (
              <div className='w-80' key={boardColKey}>
                <TaskList
                  id={boardColKey}
                  title={boardColKey}
                  tasks={boardColumns[boardColKey as TaskStatusOption] ?? []}
                />
              </div>
            ))}
            <DragOverlay dropAnimation={dropAnimation}>
              {activeTask ? <TaskItem task={activeTask} /> : null}
            </DragOverlay>
          </div>
        </BoardProvider>
      </DndContext>
    </div>
  );
};
