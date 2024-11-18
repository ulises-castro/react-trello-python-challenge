import { useCallback, useContext } from "react"
import { BoardContext } from "@/state/BoardContext"
import { ITask, BoardContextActions } from "@/types"

export const useBoardContext = () => {
	const context = useContext(BoardContext)

	if (!context) {
		throw new Error('useBoardContext must be used within a BoardProvider')
	}

	const { state, dispatch, refetchTasks } = context
	const isTaskModalOpen = !!state.action
	const taskListTarget = state.taskListTarget

	const openEditModal = useCallback((task: ITask) => {
		dispatch({
			type: BoardContextActions.EDIT_TASK,
			payload: {
				targetTask: task,
			}
		})
	}, [dispatch])

	const closeModal = useCallback(() => {
		dispatch({
			type: BoardContextActions.CLOSE_MODAL 
		})
	}, [dispatch])

	return {
		state,
		dispatch,
		refetchTasks,
		task: state.targetTask,
		status: taskListTarget,
		isTaskModalOpen,
		closeModal,
		openEditModal
	}
}