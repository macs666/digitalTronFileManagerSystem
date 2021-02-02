const { gql, makeExecutableSchema } = require('apollo-server-express')
const deepmerge = require('deepmerge')

const globalTypeDefs = gql`
  type Query
  type Mutation
`
const makeExecutableSchemaFromModules = ({ modules }) => {
  let typeDefs = [globalTypeDefs]
  let resolvers = {}
  modules.forEach((module) => {
    typeDefs = [...typeDefs, ...module.typeDefs]
    resolvers = deepmerge(resolvers, module.resolvers)
  })
  return makeExecutableSchema({
    typeDefs,
    resolvers,
  })
}
module.exports = {
  makeExecutableSchemaFromModules,
}
