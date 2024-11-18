import { ReactNode, useReducer } from "react";
import { BoardContext } from "./BoardContext";
import { BoardContextActions, BoardProviderAction, BoardProviderState } from "@/types";

const initialState: BoardProviderState = {
  targetTask: null,
  action: null,
  taskListTarget: null
}

const reducer = (prevState: BoardProviderState, action: BoardProviderAction) => {
  const updatedState = {
    ...prevState,
    action: action?.type,
  }

  switch (action?.type) {
    case BoardContextActions.CLOSE_MODAL:
      return initialState 
    case BoardContextActions.ADD_TASK:
      return {
        ...updatedState,
        taskListTarget: action.payload.taskListTarget 
      }
    case BoardContextActions.EDIT_TASK:
      return {
        ...updatedState,
        targetTask: action.payload.targetTask,
      }
    case BoardContextActions.DELETE_TASK:
      return {
        ...updatedState,
        targetTask: action.payload.targetTask,
      }
    default:
      throw new Error('Unknown board action')
  }
}

interface BoardProviderProps {
  children: ReactNode;
  refetchTasks: () => void;
}

export const BoardProvider = ({ children, refetchTasks }: BoardProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <BoardContext.Provider value={{ state, dispatch, refetchTasks }}>
      {children}
    </BoardContext.Provider>
  )
}

