const { gql } = require('apollo-server-express')

const typeDefs = gql`
  type User {
    id: Int!
    username: String!
  }

  extend type Query {
    current: User
  }

  extend type Mutation {
    register(username: String!, password: String!): String
    login(username: String!, password: String!): String
  }
`

const resolvers = require('./resolvers')

module.exports = {
  typeDefs: [typeDefs],
  resolvers,
}
