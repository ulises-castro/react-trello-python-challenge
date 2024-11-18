import { Dispatch } from "react";

export type TaskStatusType = {
	TODO: "TODO",
	IN_PROGRESS: "IN_PROGRESS",
	REVIEWING: "REVIEWING",
	DONE: "DONE",
}

export interface ITask {
	id: string;
	taskID?: string;
	title: string;
	description: string;
	status: TaskStatusOption;
};

export type TaskStatusOption = "TODO" | "IN_PROGRESS" | "REVIEWING" | "DONE"
export type BoardColumnsType = Record<TaskStatusOption, ITask[] | undefined>

export enum BoardContextActions {
	ADD_TASK = "ADD_TASK",
	EDIT_TASK = "EDIT_TASK",
	DELETE_TASK = "DELETE_TASK",
	CLOSE_MODAL = "CLOSE_MODAL",
}

export type TaskListTargetType = {
	taskListTarget: TaskStatusOption | null
}
export type TargetTaskType = {
	targetTask: ITask | null
}

export type BoardProviderAction = {
	type: BoardContextActions.CLOSE_MODAL,
} |
{
	type: BoardContextActions.ADD_TASK,
	payload: TaskListTargetType
} |
{
	type: BoardContextActions.EDIT_TASK,
	payload: TargetTaskType;
} |
{
	type: BoardContextActions.DELETE_TASK,
	payload: TargetTaskType;
}

export type BoardProviderState = {
	action: BoardContextActions | null
} & TargetTaskType
	& TaskListTargetType

export type BoardProviderProps = {
	state: BoardProviderState;
	dispatch: Dispatch<BoardProviderAction>
	refetchTasks: () => void;
} 

export interface IDeleteTaskData {
	deleteTask: {
		ok: boolean;
		message: string
	} | null
}

export interface IUpdateTaskData {
	updateTask: Partial<ITask>
}

export interface IAddTaskData {
	addTask: Pick<ITask, 'title' | 'description' | 'status'>
}