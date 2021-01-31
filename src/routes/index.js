const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const graphql = require('graphql');
const QueryRoot = require('../models');

const router = express.Router();

// setup hello world graphql
const schema = new graphql.GraphQLSchema({ query: QueryRoot });

router.use(
  '/',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

module.exports = router;
