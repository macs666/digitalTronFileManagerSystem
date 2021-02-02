const { gql } = require('apollo-server-express')

const typeDefs = gql`
  type Directory {
    id: Int!
    name: String!
    pathType: String!
    parent: String
    subDirectories: [Directory]
  }

  input LinkOrderByInput {
    name: Sort
    createdAt: Sort
  }

  enum Sort {
    ASC
    DESC
  }

  extend type Query {
    directory(name: String!): Directory
    search(filter: String, orderBy: LinkOrderByInput): [Directory]
    directories: [Directory]
  }

  extend type Mutation {
    addPath(path: String!, pathType: String!): Directory
    deletePath(target: String!): String
    movePath(target: String!, destination: String!): Directory
  }
`

const resolvers = require('./resolvers')

module.exports = {
  typeDefs: [typeDefs],
  resolvers,
}
