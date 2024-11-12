import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Task } from '../types';
import TaskItem from './TaskItem';
import SortableTaskItem from './SortableTaskItem';

type BoardColumnProps = {
  id: string;
  title: string;
  tasks: Task[];
};

export default function BoardColumn({ id, title, tasks }: BoardColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  const handleAddTask = (event: React.MouseEvent) => {
  }

  return (
    <div className='bg-gray-200 rounded-md shadow-sm px-2 py-3 w-full'>
      <h5 className='ml-4 mb-2 text-xl capitalize font-semibold'>
        {title}
      </h5>
      <SortableContext
        id={id}
        items={tasks}
        strategy={verticalListSortingStrategy}
      >
        <div className='flex flex-col gap-4' ref={setNodeRef}>
          {tasks.map((task) => (
            <div key={task.id}>
              <SortableTaskItem id={task.id}>
                <TaskItem task={task} />
              </SortableTaskItem>
            </div>
          ))}
        </div>
      </SortableContext>
      <div className='w-full mt-4'>
        <button className='w-full text-left' onClick={handleAddTask}>+ Add a new task</button>
      </div>
    </div>
  );
};

