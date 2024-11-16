import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { ITask } from '../types';
import { useBoardContext } from "@/hooks/useBoardContext";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { useAddTask, useDeleteTask } from "@/hooks/useTaskActions";

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
  const { closeModal, refetchTasks, openEditModal } = useBoardContext()
  const { deleteTask } = useDeleteTask()

  const handleDeleteTask = async (event: React.MouseEvent) => {
    event.stopPropagation()
    try {
      await deleteTask({
        variables: { taskID: task.id }, // Passing the item ID to the mutation
      });
      refetchTasks()
      closeModal()
    } catch (e) {
      console.error(e);
    }

  }

  return (
    <div onClick={() => openEditModal(task)}>
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
