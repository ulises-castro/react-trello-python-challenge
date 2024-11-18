import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_TASKS_QUERY } from '@/graphql/queries';

import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import {
	DragEndEvent,
	DragOverEvent, DragStartEvent,
	DropAnimation,
	KeyboardSensor,
	PointerSensor,
	defaultDropAnimation,
	useSensor,
	useSensors
} from '@dnd-kit/core';
import { BoardColumnsType, ITask, TaskStatusOption } from '@/types';

import { findBoardColumnContainer, initializeBoard } from '@/utils/board';
import { getTaskById } from '@/utils/tasks';


export default function useBoard() {
	const { loading, error, data, refetch } = useQuery<{ allTasks: ITask[] }>(GET_ALL_TASKS_QUERY);

	const [boardColumns, setBoardColumns] =
		useState<BoardColumnsType | null>(null);

	const [activeId, setActiveId] = useState<null | string>(null);

	useEffect(() => {
		if (loading || !data) return

		if (data?.allTasks) {
			const initialBoardColumns = initializeBoard(data.allTasks)
			setBoardColumns(initialBoardColumns)
		}

	}, [loading, data])

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8
			}
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const validateDragDropArea = useCallback((event: DragOverEvent | DragEndEvent, dragEnd = false) => {
		if (!boardColumns) return

		const { active, over } = event

		const activeContainer = findBoardColumnContainer(
			boardColumns,
			active.id as TaskStatusOption
		);
		const overContainer = findBoardColumnContainer(
			boardColumns,
			over?.id as TaskStatusOption
		);

		const isSameDroppableBoard = activeContainer === overContainer
		const validationOnDragOver = isSameDroppableBoard && !dragEnd
		const validationOnDragEnd = !isSameDroppableBoard && dragEnd;
		const invalidDroppableArea = !activeContainer || !overContainer
		if (invalidDroppableArea || validationOnDragOver || validationOnDragEnd) return null

		return {
			activeContainer, overContainer
		}
	}, [boardColumns])

	const handleDragStart = useCallback(({ active }: DragStartEvent) => {
		setActiveId(active.id as string);
	}, []);

	const handleDragOver = useCallback((event: DragOverEvent) => {
		const validation = validateDragDropArea(event)

		if (!validation) return
		const { active, over } = event
		const { activeContainer, overContainer } = validation

		if (!activeContainer || !overContainer) return

		setBoardColumns((boardColumn) => {
			const activeItems = boardColumn?.[activeContainer] ?? [];
			const overItems = boardColumn?.[overContainer] ?? [];

			const activeIndex = activeItems.findIndex(
				(item) => item.id === active.id
			);
			const overIndex = overItems.findIndex((item) => item.id !== over?.id);
			const boardActive = boardColumn![activeContainer] ?? []
			const boardOver = boardColumn![overContainer] ?? []

			return {
				...boardColumn,
				[activeContainer]: [
					...boardActive.filter(
						(item) => item.id !== active.id
					),
				],
				[overContainer]: [
					...boardOver.slice(0, overIndex),
					boardActive[activeIndex],
					...boardOver.slice(
						overIndex,
						boardOver.length
					),
				],
			} as BoardColumnsType;
		});
	}, [validateDragDropArea]);

	const handleDragEnd = useCallback((event: DragEndEvent) => {
		const validation = validateDragDropArea(event, true)
		if (!validation) return

		const { active, over } = event
		const { activeContainer, overContainer } = validation

		const boardActive = boardColumns![activeContainer] ?? []
		const boardOver = boardColumns![overContainer] ?? []

		const activeIndex = boardActive.findIndex(
			(task) => task.id === active.id
		);
		const overIndex = boardOver.findIndex(
			(task) => task.id === over?.id
		);

		if (activeIndex !== overIndex) {
			setBoardColumns((boardCol) => ({
				...boardCol,
				[overContainer]: arrayMove(
					boardCol![overContainer]!,
					activeIndex,
					overIndex
				),
			} as BoardColumnsType));
		}

		setActiveId(null);
	}, [boardColumns, validateDragDropArea]);

	const dropAnimation: DropAnimation = {
		...defaultDropAnimation,
	}

	const activeTask = activeId && data?.allTasks ? getTaskById(data?.allTasks, activeId) : null;

	return {
		dragDrop: {
			sensors,
			activeTask,
			dropAnimation,
			handleDragEnd,
			handleDragOver,
			handleDragStart,
			validateDragDropArea,
		},
		boardColumns,
		loading,
		error,
		refetch,
	}
}