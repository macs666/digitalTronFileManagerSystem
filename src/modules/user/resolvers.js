const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const { User } = require('../../models')

const JWT_SECRET = require('../../config/config').jwt.secret

const resolvers = {
  Query: {
    async current(_, args, { user }) {
      if (user) {
        // eslint-disable-next-line no-return-await
        return await User.findOne({ where: { id: user.id } })
      }
      throw new Error("Sorry, you're not an authenticated user!")
    },
  },

  Mutation: {
    async register(_, { username, password }) {
      const user = await User.create({
        username,
        password: await bcrypt.hash(password, 10),
      })

      return jsonwebtoken.sign({ id: user.id, username: user.username }, JWT_SECRET, {
        expiresIn: '3m',
      })
    },

    async login(_, { username, password }) {
      const user = await User.findOne({ where: { username } })

      if (!user) {
        throw new Error("This user doesn't exist. Please, make sure to type the right username.")
      }

      const valid = await bcrypt.compare(password, user.password)

      if (!valid) {
        throw new Error('You password is incorrect!')
      }

      return jsonwebtoken.sign({ id: user.id, username: user.username }, JWT_SECRET, {
        expiresIn: '1d',
      })
    },
  },
}

module.exports = resolvers
