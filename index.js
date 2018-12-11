const Device = require('./lib/device')
const discover = require('./lib/discover')
const {getDescription, getStatus} = require('./lib/requests')
const listen = require('./lib/listen')
const Options = require('./lib/options')

Options.register()

module.exports = {
  Device,
  discover,
  getDescription,
  getStatus,
  listen,
  Options,
}
