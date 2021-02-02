const dotenv = require('dotenv')
const path = require('path')
const Joi = require('@hapi/joi')

dotenv.config({ path: path.join(__dirname, '../../.env') })

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    DB_USERNAME: Joi.string().required().description('Postgres DB username'),
    DB_PASSWORD: Joi.string().required().description('Postgres DB password'),
    DB_HOST: Joi.string().required().description('Postgres DB host'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
  })
  .unknown()

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

module.exports = {
  NODE_ENV: envVars.NODE_ENV,
  port: envVars.PORT,
  jwt: {
    secret: envVars.JWT_SECRET,
  },
  development: {
    username: envVars.DB_USERNAME,
    password: envVars.DB_PASSWORD,
    database: envVars.DB_DATABASE,
    host: envVars.DB_HOST,
    dialect: 'postgres',
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
}
