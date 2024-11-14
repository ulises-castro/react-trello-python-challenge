import { gql } from "@apollo/client";

export const DELETE_TASK = gql`
  mutation DELETE_TASK($taskID: STRING!) {
		deleteTask(taskID: $taskID) {
			ok
			message
  	}
  }
`;
