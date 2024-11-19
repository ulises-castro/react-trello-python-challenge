import { X } from "lucide-react";

import {
  Card,
  CardContent, CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useBoardContext } from "@/hooks/useBoardContext";
import { useDeleteTask } from "@/hooks/useTaskActions";

import { ITask } from '../../types';
import { Button } from "../ui/button";

type TaskItemProps = {
  task: ITask;
};

const TaskItem = ({ task }: TaskItemProps) => {
  const { closeModal, refetchTasks, openEditModal } = useBoardContext()
  const { deleteTask } = useDeleteTask()

  const handleDeleteTask = async (event: React.MouseEvent) => {
    event.stopPropagation()
    try {
      await deleteTask({
        variables: { taskID: task.id },
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
