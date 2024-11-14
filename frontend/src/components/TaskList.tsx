import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ITask } from '../types';
import TaskItem from './TaskItem';
import SortableTaskItem from './SortableTaskItem';
import TaskModal from './task/TaskModal';
import { useState } from 'react';
import { useTaskModal } from '@/hooks/useTaskModal';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';

type TaskListProps = {
  id: string;
  title: string;
  tasks: ITask[];
};

export default function TaskList({ id, title, tasks }: TaskListProps) {

  const { setNodeRef } = useDroppable({
    id,
  });
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
          {tasks.length ? tasks.map((task) => (
            <div key={task.id}>
              <SortableTaskItem id={task.id}>
                <TaskItem task={task} />
              </SortableTaskItem>
            </div>
          )) : <div className="text-center text-md p-2 pb-0">No tasks to show...</div>}
        </div>
      </SortableContext>
      <AddNewTask />
    </div>
  );
};

function AddNewTask() {
  const { dispatch } = useTaskModal()

  const handleAddTask = () => {
    dispatch({
      type: 'ADD_TASK',
    })
  }

  return (
    <div className='w-full mt-4'>
      <Button onClick={handleAddTask} variant='ghost' className='w-full text-md'>
        <Plus /> Add a new task
      </Button>
    </div>
  )
}

