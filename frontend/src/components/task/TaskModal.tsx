import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useBoardContext } from "@/hooks/useBoardContext"
import { Textarea } from "../ui/textarea"
import { FormEvent, useEffect, useState } from "react"
import { useAddTask, useUpdateTask } from "@/hooks/useTaskActions"
import { Loader2 } from "lucide-react"
import { BoardContextActions, ITask, TaskStatusOption } from "@/types"

export default function TaskModal() {
	const { closeModal, isTaskModalOpen, state, task, status, refetchTasks } = useBoardContext()
	const { addTask, loading: isAddingTask } = useAddTask()
	const { updateTask, loading: isUpdatingTask } = useUpdateTask()

	const isWaitingData = isUpdatingTask || isAddingTask
	const isEditMode = state.action === BoardContextActions.EDIT_TASK

	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')

	useEffect(() => {
		setDescription(task?.description ?? '')
		setTitle(task?.title ?? '')
	}, [task])

	const onAddTask = async () => {
		try {
			await addTask({
				variables: {
					title,
					description,
					status: status as TaskStatusOption
				}
			})
			refetchTasks()
		} catch {
			console.error('Something went wrong')
		}
	}

	const onUpdateTask = async () => {
		try {
			const { id: taskID } = task as ITask
			await updateTask({
				variables: {
					taskID,
					newValues: {
						title,
						description,
					}
				}
			})
			refetchTasks()
		} catch {
			console.error('Something went wrong')
		}
	}

	const onSubmit = (event: FormEvent) => {
		event.preventDefault()
		try {
			if (isEditMode) {
				onUpdateTask()
			} else {
				onAddTask()
			}
		} finally {
			closeModal()
		}
	}

	if (!isTaskModalOpen) return null

	const isValid = description && title

	return (
		<Dialog open={isTaskModalOpen}>
			<DialogContent className="sm:max-w-md" onCloseModal={closeModal} onEscapeKeyDown={closeModal} onInteractOutside={closeModal}>
				<form onSubmit={onSubmit}>
					<DialogHeader className="mb-4">
						<DialogTitle> {isEditMode && task ? `Edit task "${task.title}"` : 'Add a new task'}</DialogTitle>
				</DialogHeader>
					<div className="grid w-full items-center gap-2">
						<div className="flex flex-col space-y-2">
							<Label htmlFor="task-title">Title</Label>
							<Input id="task-title" placeholder="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
							{!title && <span className="text-red-700 text-sm mb-2">This field is required</span>}
						</div>
						<div className="flex flex-col space-y-2">
							<Label htmlFor="task-description" className="mt-2">Description</Label>
							<Textarea id="task-description" placeholder="Description" value={description} onChange={(event) => setDescription(event.target.value)} />
							{!description && <span className="text-red-700 text-sm">This field is required</span>}
						</div>
				</div>
					<DialogFooter className="flex sm:justify-between mt-4">
						<DialogClose asChild>
							<Button onClick={closeModal} type="button" variant="secondary">
								Close
							</Button>
						</DialogClose>
						<TaskModalSubmitBtn isValid={!!isValid} isEditMode={isEditMode} isLoading={isWaitingData} />
				</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}

type TaskModalSubmitBtnProps = {
	isEditMode: boolean;
	isValid: boolean;
	isLoading: boolean;
}

const TaskModalSubmitBtn = ({ isEditMode, isValid, isLoading }: TaskModalSubmitBtnProps) => {

	const label = isEditMode ? 'Save' : 'Create new task'

	return (
		<Button type="submit" disabled={!isValid}>
			{isLoading ?
				<>
					<Loader2 className="animate-spin" />
					Please wait
				</> : label
			}
		</Button>
	)
}

