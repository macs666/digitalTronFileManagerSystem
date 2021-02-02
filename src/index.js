const app = require('./app')
const config = require('./config/config')
const logger = require('./config/logger')
const db = require('./models')

db.sequelize
  .authenticate()
  .then(() => {
    logger.info('Database connection has been established successfully')
  })
  .catch((err) => {
    logger.error('Unable to connect to the database:', err)
    logger.info('Server closed')
    process.exit(1)
  })

const server = app.listen(config.port, () => {
  logger.info(`Listening to http://localhost:${config.port}`)
})

db.sequelize.sync({ force: true }).then(() => {
  logger.info('Dropped and resync db')
})

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed')
      process.exit(1)
    })
  } else {
    process.exit(1)
  }
}

const unexpectedErrorHandler = (error) => {
  logger.error(error)
  exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

process.on('SIGTERM', () => {
  logger.info('SIGTERM received')
  if (server) {
    server.close()
  }
})
