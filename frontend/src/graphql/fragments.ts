import { gql } from '@apollo/client';

export const TASK_FIELDS = gql`
	fragment TaskFields on Task {
		id
		title
		description
		status
	}
`