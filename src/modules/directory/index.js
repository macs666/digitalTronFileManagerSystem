const { gql } = require('apollo-server-express')

const typeDefs = gql`
  type Directory {
    id: Int!
    name: String!
    pathType: String!
    parent: String
    subDirectories: [Directory]
  }

  extend type Query {
    directory(name: String!): Directory
    directories: [Directory]
  }

  extend type Mutation {
    addPath(path: String!, pathType: String!): Directory
    move(target: String!, destination: String!): Directory
  }
`

const resolvers = require('./resolvers')

module.exports = {
  typeDefs: [typeDefs],
  resolvers,
}
