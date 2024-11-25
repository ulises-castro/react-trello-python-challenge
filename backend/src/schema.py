from graphene import ObjectType, String, Schema, Enum, InputObjectType, List, Boolean
from src.helpers.task_table import task_table
import graphene


class TaskStatusOptions(Enum):
    TODO = "TODO"
    IN_PROGRESS = "IN_PROGRESS"
    DONE = "DONE"
    REVIEWING = "REVIEWING"


class Task(ObjectType):
    id = String()
    taskID = String()
    title = String()
    description = String()
    createdAt = String()
    status = TaskStatusOptions()


class UpdateTaskNewValuesInput(InputObjectType):
    title = String()
    description = String()
    status = TaskStatusOptions()


class UpdateTask(graphene.Mutation):
    class Arguments:
        taskID = String(required=True)
        new_values = UpdateTaskNewValuesInput(required=True)

    task = graphene.Field(Task)

    def mutate(self, info, taskID, new_values):
        status = new_values.get("status")
        if status:
            new_values["status"] = status.value
        task = task_table.update_task(taskID, new_values)

        return UpdateTask(task=task)


class AddTask(graphene.Mutation):
    class Arguments:
        title = String(required=True)
        description = String(required=True)
        status = TaskStatusOptions(required=True)

    task = graphene.Field(Task)

    def mutate(self, info, title, description, status):
        status_format = status.value
        created_task = task_table.add_task(task=(title, description, status_format))
        created_task["id"] = created_task.get("taskID")

        return AddTask(task=created_task)


class DeleteTask(graphene.Mutation):
    class Arguments:
        taskID = String(required=True)

    # Define the response type of the mutation
    ok = Boolean()
    message = String()

    def mutate(root, info, taskID):
        success = task_table.delete_task(taskID)

        if success:
            return DeleteTask(ok=True, message="Task deleted successfully.")
        else:
            return DeleteTask(ok=False, message="Failed to delete task.")


class Query(ObjectType):
    all_tasks = List(Task)

    def resolve_all_tasks(self, info):
        tasks = task_table.get_all_tasks()
        return list(map(lambda task: {**task, "id": task["taskID"]}, tasks))


class Mutation(graphene.ObjectType):
    add_task = AddTask.Field()
    update_task = UpdateTask.Field()
    delete_task = DeleteTask.Field()


schema = Schema(query=Query, mutation=Mutation)
