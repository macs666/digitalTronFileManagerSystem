const events = require('events')

const eventEmitter = new events.EventEmitter()

const catchCreateEmitter = (eventHandler) => {
  eventEmitter.on('created', eventHandler)
}
const catchMoveEmitter = (eventHandler) => {
  eventEmitter.on('moved', eventHandler)
}
const catchDeleteEmitter = (eventHandler) => {
  eventEmitter.on('deleted', eventHandler)
}

const fireCreateEmitter = (name, path) => {
  eventEmitter.emit('created', name, path)
}
const fireMoveEmitter = (name, path) => {
  eventEmitter.emit('moved', name, path)
}
const fireDeleteEmitter = (name) => {
  eventEmitter.emit('deleted', name)
}
module.exports = {
  catchCreateEmitter,
  catchMoveEmitter,
  catchDeleteEmitter,
  fireCreateEmitter,
  fireMoveEmitter,
  fireDeleteEmitter,
}
