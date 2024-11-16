type Mutation {
	addTask(newTask: NewTaskInput!): Task!
}

input NewTaskInput {
	title: String!
	description: String!
}

type Task {
	id: ID!
	title: String!
	description: String!
}
