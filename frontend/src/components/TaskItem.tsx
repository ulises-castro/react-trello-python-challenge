import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { ITask } from '../types';
import { useTaskModal } from "@/hooks/useTaskModal";
import { X } from "lucide-react";
import { Button } from "./ui/button";

type TaskItemProps = {
  task: ITask;
};

// const Card = ({ children }) => {
//   return <div className='bg-white shadow-md rounded-md p-2'>{children}</div>
// }

// const CardDescription = ({ children }) => {
//   return <div>{children}</div>
// }
// const CardTitle = ({ children }) => {
//   return <h4>{children}</h4>
// }

const TaskItem = ({ task }: TaskItemProps) => {
  const { handleOpenModal, dispatch } = useTaskModal()

  const handleDeleteTask = (event) => {
    event.stopPropagation()
    console.log('Delete modal')
    dispatch({
      type: 'CLOSE_MODAL',
    })
  }

  return (
    <div onClick={() => handleOpenModal(task)}>
      <Card >
        <CardHeader className="flex flex-row justify-between items-center pt-2 pb-0">
          <CardTitle>
            {task.title}
          </CardTitle>
          <Button onClick={handleDeleteTask} variant="ghost" size="icon">
            <X />
          </Button>
        </CardHeader>
        <CardContent className="pt">
        <p className='text-ellipsis text-sm'>{task.description}</p>
        </CardContent>
    </Card>
    </div>
  );
};

export default TaskItem;
