import { TaskStatusType } from "@/types";

export const TaskStatuses: Array<keyof TaskStatusType> = [
	"TODO",
	"IN_PROGRESS",
	"REVIEWING",
	"DONE",
]