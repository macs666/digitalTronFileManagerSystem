const { Directory } = require('../../models')

const splitPath = async (path, action) => {
  const dirNames = path.split('/')
  if (dirNames.length > 2 || dirNames.length < 1) {
    throw new Error('Invalid path')
  }

  const directories = []
  if (dirNames.length > 1) {
    const fetchedDirectoryResult = await Directory.findOne({
      where: {
        name: dirNames[0],
        pathType: 'Folder',
      },
    })
    if (!fetchedDirectoryResult) {
      throw new Error('Invalid path')
    }
    directories.push(fetchedDirectoryResult)
  }

  switch (action) {
    case 'create':
      directories.push({
        name: dirNames.length > 1 ? dirNames[1] : dirNames[0],
        parent: directories.length > 0 ? directories[directories.length - 1].name : null,
      })
      break
    case 'target':
      break
    default:
      break
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
  fetchedDirectoryResults.forEach((val) => {
    if (val.pathType === 'Folder') {
      const subs = recurseThroughDirectory(val.name)
      fetchedDirectoryResults[i].subDirectories = subs
    }
    i += 1
  })
  return fetchedDirectoryResults
}

const resolvers = {
  Query: {
    async directory(_, { name }) {
      const fetchedDirectoryResult = await Directory.findOne({
        where: {
          name,
        },
      })
      // eslint-disable-next-line no-return-await
      return await recurseThroughDirectory(fetchedDirectoryResult.name)
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

    async move(_, { target, destination }, { user }) {
      return {
        name: target,
        pathType: destination,
        createdById: user.id,
      }
    },
  },
}

module.exports = resolvers
