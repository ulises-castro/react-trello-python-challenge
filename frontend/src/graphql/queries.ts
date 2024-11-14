import { gql } from "@apollo/client";

export const GET_ALL_TASKS = gql`
  query ALL_TASKS {
		allTasks {
      id
      title
      description
      status
  	}
  }
`;
