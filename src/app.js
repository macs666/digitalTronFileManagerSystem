const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const jwt = require('express-jwt')
const httpStatus = require('http-status')

const routes = require('./routes')
const ApiError = require('./utils/APIError')
const config = require('./config/config')
const schema = require('./modules')
const eventHandler = require('./utils/eventHandler')

const app = express()
app.use(express.static('public'))

const auth = jwt({
  secret: config.jwt.secret,
  credentialsRequired: false,
  algorithms: ['sha1', 'RS256', 'HS256'],
  getToken: function fromHeaderOrQuerystring(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1]
    }
    if (req.query && req.query.token) {
      return req.query.token
    }
    return null
  },
})
app.use(auth)

// api routes
app.use('/api', routes)

// setup apollo server
const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    // eslint-disable-next-line no-nested-ternary
    const user = req.headers.user ? JSON.parse(req.headers.user) : req.user ? req.user : null
    return { user }
  },
})

server.applyMiddleware({
  path: '/graphql',
  app,
})

app.get('/notifications', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Connection', 'keep-alive')

  eventHandler.catchCreateEmitter((name, path) => {
    res.write(`data: ${name} was created in ${path}\n`)
  })

  eventHandler.catchMoveEmitter((name, path) => {
    res.write(`data: ${name} was moved to ${path}\n`)
  })
  eventHandler.catchDeleteEmitter((name) => {
    res.write(`data: ${name} was deleted\n`)
  })

  // If client closes connection, stop sending events
  res.on('close', () => {
    res.end()
  })
})

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'))
})

module.exports = app
