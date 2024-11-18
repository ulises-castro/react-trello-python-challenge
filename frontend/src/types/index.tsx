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
	status: keyof TaskStatusType;
};

// TODO: Convert into map to improve perforrmance
// TODO: change name for boardprovider
export type BoardColumnsType = Record<keyof TaskStatusType, ITask[]>

export enum BoardContextActions {
	ADD_TASK = "ADD_TASK",
	EDIT_TASK = "EDIT_TASK",
	DELETE_TASK = "DELETE_TASK",
	CLOSE_MODAL = "CLOSE_MODAL",
}

export type TaskListTargetType = {
	taskListTarget: keyof TaskStatusType | null
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
	updateTask: ITask
}

export interface IAddTaskData {
	addTask: ITask
}