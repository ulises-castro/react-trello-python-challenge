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
	// Destructure the mutation function and its states from useMutation
	const [deleteTask, { data, loading, error }] = useMutation<IDeleteTaskData, { taskID: string }>(DELETE_TASK_MUTATION, {
	// update(cache, { data: { deleteTask } }) {
			// if (deleteTask.ok) {
			// 	toast({
			// 		title: "Task was deleted",
			// 		description: "Task was delete sucessfully.",
			// 	})
			// 	// Optionally update your cache here to reflect the deletion
			// } else {
			// 	toast({
			// 		variant: "destructive",
			// 		title: "Uh oh! Something went wrong.",
			// 		description: "There was a problem with your request: " + deleteTask?.message,
			// 		action: <ToastAction altText="Try again">Try again</ToastAction>,
			// 	})
			// }
		// },
	})
	useTaskActionToast<DeleteTaskData>({ data, loading, error, action: "deleted" })

	return { deleteTask, data, loading }
}


export function useAddTask() {
	// Destructure the mutation function and its states from useMutation
	const [addTask, { data, loading, error }] = useMutation<IAddTaskData, Partial<ITask>>(ADD_TASK_MUTATION, {
		// update(cache, { data: { deleteItem } }) {
		// 	if (deleteItem.ok) {
		// 		// Optionally update your cache here to reflect the deletion
		// 	}
		// },
	});
	useTaskActionToast({ data, loading, error, action: "added" })

	return { addTask, data, loading }
}

export function useUpdateTask() {
	// Destructure the mutation function and its states from useMutation
	const [updateTask, { data, loading, error }] = useMutation<IUpdateTaskData, Partial<ITask>>(UPDATE_TASK_MUTATION, {
	// update(cache, { data: { deleteItem } }) {
	// 	// if (deleteItem.ok) {
	// 		// Optionally update your cache here to reflect the deletion
	// 	// }
	// },
	});
	useTaskActionToast<IUpdateTaskData>({ data, loading, error, action: "updated" })

	return { updateTask, data, loading }
}
