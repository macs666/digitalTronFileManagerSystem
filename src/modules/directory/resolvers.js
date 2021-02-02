const { Directory } = require('../../models')
const db = require('../../models')

const splitPath = async (path, action) => {
  const dirNames = path.split('/')
  if (dirNames.length > 2 || dirNames.length < 1) {
    throw new Error('Invalid path')
  }

  const directories = []

  const where = {
    name: dirNames[0],
  }
  if (dirNames.length > 1 || action === 'destination') {
    where.pathType = 'Folder'
  }

  const fetchedDirectoryResult = await Directory.findOne({
    where: {
      name: dirNames[0],
      pathType: 'Folder',
    },
  })
  if (!fetchedDirectoryResult) {
    if (dirNames.length > 1 || action !== 'create') {
      throw new Error('Invalid path')
    }
  } else {
    directories.push(fetchedDirectoryResult)
  }

  if (action === 'create') {
    directories.push({
      name: dirNames.length > 1 ? dirNames[1] : dirNames[0],
      parent: directories.length > 0 ? directories[0].name : null,
    })
    return directories
  }

  if (directories.length < 1) {
    throw new Error('Path could not be resolved')
  }

  return directories
}

const recurseThroughDirectory = async (name) => {
  const fetchedDirectoryResults = await Directory.findAll({
    where: {
      parent: name,
    },
  })
  let i = 0
  // eslint-disable-next-line no-restricted-syntax
  for (const val of fetchedDirectoryResults) {
    if (val.pathType === 'Folder') {
      // eslint-disable-next-line no-await-in-loop
      const subs = await recurseThroughDirectory(val.name)
      fetchedDirectoryResults[i].subDirectories = subs
    }
    i += 1
  }
  return fetchedDirectoryResults
}

const resolvers = {
  Query: {
    async directory(_, { name }) {
      const fetchedDirectoryResult = await Directory.findOne({
        where: {
          // eslint-disable-next-line object-shorthand
          name: name,
        },
      })
      const result = await recurseThroughDirectory(fetchedDirectoryResult.name)
      fetchedDirectoryResult.subDirectories = result
      return fetchedDirectoryResult
    },

    async directories() {
      const fetchedDirectoryResults = await Directory.findAll({
        where: {
          parent: null,
        },
      })
      let i = 0
      fetchedDirectoryResults.forEach((val) => {
        if (val.pathType === 'Folder') {
          const subs = recurseThroughDirectory(val.name)
          fetchedDirectoryResults[i].subDirectories = subs
        }
        i += 1
      })
      return fetchedDirectoryResults
    },

    async search(_, args) {
      const { Op } = db.Sequelize
      const where = args.filter
        ? {
            name: { [Op.like]: `%${args.filter}%` },
          }
        : {}
      const order = args.orderBy ? [[Object.keys(args.orderBy)[0], Object.values(args.orderBy)[0]]] : []
      const fetchedDirectoryResults = await Directory.findAll({
        where,
        order,
      })
      let i = 0
      fetchedDirectoryResults.forEach((val) => {
        if (val.pathType === 'Folder') {
          const subs = recurseThroughDirectory(val.name)
          fetchedDirectoryResults[i].subDirectories = subs
        }
        i += 1
      })
      return fetchedDirectoryResults
    },
  },

  Mutation: {
    async addPath(_, { path, pathType }, { user }) {
      const directories = await splitPath(path, 'create')

      const existingDir = await Directory.findOne({ where: { name: directories[directories.length - 1].name } })
      if (existingDir) {
        throw new Error(`${pathType} name taken`)
      }
      const dir = await Directory.create({
        name: directories[directories.length - 1].name,
        pathType,
        parent: directories[directories.length - 1].parent,
        createdById: user.id,
      })
      return dir
    },

    async deletePath(_, { target, destination }, { user }) {
      return {
        name: target,
        pathType: destination,
        createdById: user.id,
      }
    },

    async movePath(_, { target, destination }, { user }) {
      return {
        name: target,
        pathType: destination,
        createdById: user.id,
      }
    },
  },
}

module.exports = resolvers
