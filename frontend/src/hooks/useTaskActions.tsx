import { ADD_TASK, DELETE_TASK } from "@/graphql/mutations";
import { useMutation } from "@apollo/client";
import { useCallback, useEffect } from "react";
import { toast, useToast } from "./use-toast";
import { ToastAction } from "@/components/ui/toast";


export function useTaskActionToast<T>({
	data,
	loading,
	error,
	action
}: {
	data: T,
	loading: boolean,
	error: T,
	action: string
}) {
	const { toast } = useToast()

	const showErrorToast = useCallback((msg: string) => {
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
			// Optionally update your cache here to reflect the deletion
		} else {
			showErrorToast('Something weird happens.')
		}
	}, [action, data, loading, showErrorToast, toast])

	useEffect(() => {
		if (!error) return
		showErrorToast(error)
	}, [error, showErrorToast])
}


export function useDeleteTask() {
	// Destructure the mutation function and its states from useMutation
	const [deleteTask, { data, loading, error }] = useMutation(DELETE_TASK, {
		update(cache, { data: { deleteTask } }) {
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
		},
	})
	useTaskActionToast({ data, loading, error, action: "deleted" })

	return { deleteTask, data, loading }
}


export function useAddTask() {
	// Destructure the mutation function and its states from useMutation
	const [addTask, { data, loading, error }] = useMutation(ADD_TASK, {
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
	const [addTask, { data, loading, error }] = useMutation(ADD_TASK, {
		update(cache, { data: { deleteItem } }) {
			if (deleteItem.ok) {
				// Optionally update your cache here to reflect the deletion
			}
		},
	});
	useTaskActionToast({ data, loading, error, action: "updated" })

	return { addTask, data, loading }
}
