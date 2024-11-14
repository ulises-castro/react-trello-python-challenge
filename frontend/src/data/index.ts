import { ITask, TaskStatus } from '../types';

const unique = (() => {
  let id = 0;

  return () => {
    return String(++id);
  }
})()

export const DUMMY_TASKS: ITask[] = [
  {
    id: unique(),
    title: 'Title 1',
    description: 'Desc 2',
    status: TaskStatus.TODO,
  },
  {
    id: unique(),
    title: 'Title 2',
    description: 'Desc 3',
    status: TaskStatus.TODO,
  },
  {
    id: unique(),
    title: 'Title 3',
    description: 'Desc 3',
    status: TaskStatus.TODO,
  },
  {
    id: unique(),
    title: 'Title 4',
    description: 'Desc 4',
    status: TaskStatus.DONE,
  },
  {
    id: unique(),
    title: 'Title 5',
    description: 'Desc 3',
    status: TaskStatus.DONE,
  },
];
