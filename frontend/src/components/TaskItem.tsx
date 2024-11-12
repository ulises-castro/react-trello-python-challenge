import { Task } from '../types';

type TaskItemProps = {
  task: Task;
};

const Card = ({ children }) => {
  return <div className='bg-white shadow-md rounded-md p-2'>{children}</div>
}

const CardDescription = ({ children }) => {
  return <div>{children}</div>
}
const CardTitle = ({ children }) => {
  return <h4>{children}</h4>
}

const TaskItem = ({ task }: TaskItemProps) => {
  return (
    <Card>
      <CardTitle>
        {task.title}
      </CardTitle>
      <CardDescription>
        <p className='text-ellipsis text-sm'>{task.description}</p>
      </CardDescription>
    </Card>
  );
};

export default TaskItem;
