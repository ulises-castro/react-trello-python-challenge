import { useContext } from "react"
import { BoardContext } from "@/state/BoardContext"
import { ITask } from "@/types"


export const useBoardContext = () => {
	const context = useContext(BoardContext)

	if (!context) {
		throw new Error('useTaskModal must be used within a CounterProvider')
	}

	const { state, dispatch, refetchTasks } = context
	const isTaskModalOpen = !!state.action
	const taskListTarget = state.taskListTarget

	const openEditModal = (task: ITask) => {
		dispatch({
			type: 'EDIT_TASK',
			payload: {
				targetTask: task,
			}
		})
	}
	const closeModal = () => {
		dispatch({
			type: 'CLOSE_MODAL'
		})
	}

	const deleteTask = () => {
		console.log('Delete modal')
		dispatch({
			type: 'CLOSE_MODAL',
		})
	}

	return {
		state,
		dispatch,
		refetchTasks,
		task: state.targetTask,
		status: taskListTarget,
		isTaskModalOpen,
		closeModal,
		deleteTask,
		openEditModal
	}
}