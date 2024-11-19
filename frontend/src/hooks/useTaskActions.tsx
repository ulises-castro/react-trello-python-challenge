import { ADD_TASK_MUTATION, DELETE_TASK_MUTATION, UPDATE_TASK_MUTATION } from "@/graphql/mutations";
import { ApolloError, useMutation } from "@apollo/client";
import { useCallback, useEffect } from "react";
import { useToast } from "./use-toast";
import { ToastAction } from "@/components/ui/toast";
import { IAddTaskData, IDeleteTaskData, ITask, IUpdateTaskData } from "@/types";


export function useTaskActionToast<T>({
	data,
	loading,
	error,
	action
}: {
		data: T | null | undefined,
	loading: boolean,
		error: ApolloError | undefined,
	action: string
}) {
	const { toast } = useToast()

	const showErrorToast = useCallback((msg: string | ApolloError) => {
		toast({
			variant: "destructive",
			title: "Uh oh! Something went wrong.",
			description: "There was a problem with your request: " + msg,
			action: <ToastAction altText="Try again">Try again</ToastAction>,
		})
	}, [toast])

	useEffect(() => {
		if (!data || loading) return

		const [response] = Object.values(data)
		if (response) {
			toast({
				title: `Task was ${action}`,
				description: `Task was ${action} sucessfully.`,
			})
		} else {
			showErrorToast('We weren\'t able to process your request.')
		}
	}, [action, data, loading, showErrorToast, toast])

	useEffect(() => {
		if (!error) return
		showErrorToast(error)
	}, [error, showErrorToast])
}

interface DeleteTaskData {
	deleteTask: {
		ok: boolean;
		message: string
	} | null
}

export function useDeleteTask() {
	const [deleteTask, { data, loading, error }] = useMutation<IDeleteTaskData, { taskID: string }>(DELETE_TASK_MUTATION)
	useTaskActionToast<DeleteTaskData>({ data, loading, error, action: "deleted" })

	return { deleteTask, data, loading }
}


export function useAddTask() {
	const [addTask, { data, loading, error }] = useMutation<IAddTaskData, Partial<ITask>>(ADD_TASK_MUTATION)
	useTaskActionToast({ data, loading, error, action: "added" })

	return { addTask, data, loading }
}

export function useUpdateTask(onlyStatus = false) {
	const [updateTask, { data, loading, error }] = useMutation<IUpdateTaskData, { taskID: string, newValues: Partial<ITask> }>(UPDATE_TASK_MUTATION)

	const action = onlyStatus ? 'moved' : 'updated'
	useTaskActionToast<IUpdateTaskData>({ data, loading, error, action })

	return { updateTask, data, loading }
}
