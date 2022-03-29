import {buildSchema} from "graphql";

const graphqlSchema = buildSchema(`

  type User {
    _id: ID!
    name: String!
    email: String!
    gender: String!
    status: String!
  }

  input UserInput {
    name: String!
    email: String!
    gender: String!
    status: String!
  }

  input UpdateUserInput {
    id: ID!
    name: String!
    email: String!
    gender: String!
    status: String!
  }

  input DeleteUserInput {
    id: ID!
  }

  input getUserByIdInput {
    id: ID!
  }
  
  type Query {
    users:[User!]
  }

  type Mutation {
    createUser(user:UserInput): User
    updateUser(user:UpdateUserInput): User
    deleteUser(user:DeleteUserInput): User
    getUserById(user:getUserByIdInput): User
  }

  schema {
    query: Query
    mutation: Mutation
  }`
  )

export {graphqlSchema}