// export type TaskStatus = 'todo' | 'in progress' | 'reviewing' | 'done';

export enum TaskStatus {
	TODO = "TODO",
	IN_PROGRESS = "IN_PROGRESS",
	REVIEW = "REVIEW",
	DONE = "DONE",
}

export type Task = {
	id: string;
	title: string;
	description: string;
	status: TaskStatus;
};

// TODO: Convert into map to improve perforrmance
export type BoardColumns = Record<TaskStatus, Task[]>


