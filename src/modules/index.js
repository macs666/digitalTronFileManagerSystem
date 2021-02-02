const { makeExecutableSchemaFromModules } = require('../utils/module')

const user = require('./user')

module.exports = makeExecutableSchemaFromModules({
  modules: [user],
})
