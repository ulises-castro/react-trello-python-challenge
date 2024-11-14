import { createContext, useContext, useReducer } from "react"
import Board from "../components/Board"

const initialState = {
  targetTask: '',
  action: ''
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'CLOSE_MODAL':
      return {
        ...state,
        targetTask: null,
        action: ''
      }
    case 'ADD_TASK':
      return {
        ...state,
        action: 'ADD_TASK'
      }
    case 'EDIT_TASK':
      return {
        ...state,
        targetTask: action.payload.targetTask,
        action: 'EDIT_TASK'
      }
    case 'DELETE_TASK':
      return {
        ...state,
        targetTask: action.payload.targetTask,
        action: 'DELETE_TASK'
      }
    // case 'EDIT_TASK':
    //   return {
    //     ...state,
    //     targetTask: action.payload.targetTask,
    //     action: action.payload.action
    //   }
    case 'TOGGLE_MODAL':
      return {
        ...state,
        action: '',
        targetTask: state.targetTask ? null : state.action.payload
      }
    default:
      return state
  }
}

export const BoardContext = createContext()

export const BoardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  )
}

