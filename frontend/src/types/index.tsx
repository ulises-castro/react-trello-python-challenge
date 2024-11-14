// export type TaskStatus = 'todo' | 'in progress' | 'reviewing' | 'done';

export enum TaskStatus {
	TODO = "TODO",
	IN_PROGRESS = "IN_PROGRESS",
	REVIEW = "REVIEW",
	DONE = "DONE",
}

export interface ITask {
	id: string;
	title: string;
	description: string;
	status: TaskStatus;
};

// TODO: Convert into map to improve perforrmance
export type BoardColumnsType = Record<TaskStatus, ITask[]>


