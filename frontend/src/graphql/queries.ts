import { gql } from "@apollo/client";
import { TASK_FIELDS } from './fragments';

export const GET_ALL_TASKS_QUERY = gql`
  query ALL_TASKS {
		allTasks {
      ...TaskFields 
  	}
  }
  ${TASK_FIELDS}
`;
