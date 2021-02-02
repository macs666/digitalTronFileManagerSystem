const { makeExecutableSchemaFromModules } = require('../utils/module')

const user = require('./user')
const directory = require('./directory')

module.exports = makeExecutableSchemaFromModules({
  modules: [user, directory],
})
