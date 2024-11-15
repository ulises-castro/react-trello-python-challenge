import { useReducer } from "react"
import { BoardContext } from "./BoardContext"

const initialState = {
  targetTask: '',
  action: '',
  taskListTarget: ''
}

const reducer = (state, action) => {
  const updatedState = {
    ...state,
    action: action.type
  }

  switch (action.type) {
    case 'CLOSE_MODAL':
      return initialState 
    case 'ADD_TASK':
      return {
        ...updatedState,
        taskListTarget: action.taskListTarget 
      }
    case 'EDIT_TASK':
      return {
        ...updatedState,
        targetTask: action.payload.targetTask,
      }
    case 'DELETE_TASK':
      return {
        ...updatedState,
        targetTask: action.payload.targetTask,
      }
    default:
      return state
  }
}

export const BoardProvider = ({ children, refetchTasks }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <BoardContext.Provider value={{ state, dispatch, refetchTasks }}>
      {children}
    </BoardContext.Provider>
  )
}

