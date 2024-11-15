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
import { useEffect, useState } from "react"

export default function TaskModal() {
	const { handleCloseModal, isTaskModalOpen, state, task } = useBoardContext()
	const isEditMode = state.action === 'EDIT_TASK'

	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')

	useEffect(() => {
		setDescription(task?.description ?? '')
		setTitle(task?.title ?? '')
	}, [task])

	const onSubmit = (event) => {
		// TODO add task 
	}

	if (!isTaskModalOpen) return null

	const isValid = description && title

	return (
		<Dialog open={isTaskModalOpen}>
			<DialogContent className="sm:max-w-md" onCloseModal={handleCloseModal} onEscapeKeyDown={handleCloseModal} onInteractOutside={handleCloseModal}>
				<DialogHeader>
					<DialogTitle> {isEditMode ? `Edit task "${task.title}"` : 'Add a new task'}</DialogTitle>
				</DialogHeader>
				<div className="grid w-full items-center gap-2">
					<form onSubmit={onSubmit}>
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
					</form>
				</div>
				<DialogFooter className="flex sm:justify-between">
					<DialogClose asChild>
						<Button onClick={handleCloseModal} type="button" variant="secondary">
							Close
						</Button>
					</DialogClose>
					{isEditMode ? <Button type="submit" disabled={!isValid}>Save</Button> : <Button type="submit" disabled={!isValid}>Create</Button>}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
