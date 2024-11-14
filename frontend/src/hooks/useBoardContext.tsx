import { useContext } from "react"
import { BoardContext } from "@/state/BoardProvider"
import { ITask } from "@/types"


export const useBoardContext = () => {
	const context = useContext(BoardContext)

	if (!context) {
		throw new Error('useTaskModal must be used within a CounterProvider')
	}

	const { state, dispatch } = context
	const isTaskModalOpen = !!state.action

	const handleOpenModal = (task: ITask) => {
		console.log('hi there', task)
		dispatch({
			type: 'EDIT_TASK',
			payload: {
				targetTask: task,
			}
		})
	}
	const handleCloseModal = () => {
		dispatch({
			type: 'CLOSE_MODAL'
		})
	}

	const handleDeleteTask = () => {
		console.log('Delete modal')
		dispatch({
			type: 'CLOSE_MODAL',
		})
	}

	return {
		state,
		dispatch,
		task: state.targetTask,
		isTaskModalOpen,
		handleCloseModal,
		handleDeleteTask,
		handleOpenModal
	}
}