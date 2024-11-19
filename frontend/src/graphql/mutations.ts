import { TASK_FIELDS } from './fragments';
import { gql } from "@apollo/client";

export const ADD_TASK_MUTATION = gql`
  mutation ADD_TASK($title: String!, $description: String!, $status: TaskStatusOptions!) {
		addTask(title: $title, description: $description, status: $status) {
			task {
				...TaskFields
			}
  	}
 } 
 ${TASK_FIELDS}
`;

export const UPDATE_TASK_MUTATION = gql`
  mutation UPDATE_TASK($taskID: String!, $newValues: UpdateTaskNewValuesInput!) {
		updateTask(taskID: $taskID, newValues: $newValues) {
			task {
				...TaskFields	
			}
  	}
 }
	${TASK_FIELDS}
`;

export const DELETE_TASK_MUTATION = gql`
  mutation DELETE_TASK($taskID: String!) {
		deleteTask(taskID: $taskID) {
			ok
			message
  	}
  }
`;
