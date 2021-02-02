/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable security/detect-non-literal-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

const Sequelize = require('sequelize')

const config = require('../config/config')
const User = require('./user')

const db = {}

const sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, {
  host: config.development.host,
  dialect: config.development.dialect,
})

db.User = User(sequelize, Sequelize)

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
