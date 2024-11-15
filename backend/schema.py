from graphene import ObjectType, String, Schema, Enum, InputObjectType, List, Boolean
from .helpers.task_table import task_table
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
    # TODO
    # sorted_order = to save the latest position it was sorted


class NewTaskInput(InputObjectType):
    title = String(required=True)
    description = String(required=True)


# Define the Query class, which will allow fetching task information
class Query(ObjectType):
    all_tasks = List(Task)

    def resolve_all_tasks(self, info):

        tasks = task_table.get_all_tasks()
        return list(map(lambda task: {**task, "id": task["taskID"]}, tasks))


class UpdateTaskStatus(graphene.Mutation):
    class Arguments:
        taskID = String(required=True)
        status = TaskStatusOptions(required=True)
        # input = CreateTaskInput(required=True)

    # pass

    task = graphene.Field(Task)

    def mutate(self, info, id, status):
        # Normally, fetch and update the task status in a database
        task = Task(id=id, title="Sample Task", status=status)
        return UpdateTaskStatus(task=task)


# Define the CreateTask mutation class
class AddTask(graphene.Mutation):
    class Arguments:
        title = String(required=True)
        description = String(required=True)
        status = TaskStatusOptions(required=True)

    task = graphene.Field(Task)  # The result of the mutation is a Task object

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


# Define the root Mutation class, which includes all mutation classes
class Mutation(graphene.ObjectType):
    add_task = AddTask.Field()  # Expose CreateTask mutation as 'create_task'
    update_task_status = UpdateTaskStatus.Field()
    delete_task = DeleteTask.Field()


schema = Schema(query=Query, mutation=Mutation)
