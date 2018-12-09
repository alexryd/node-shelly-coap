const discover = require('./lib/discover')
const listen = require('./lib/listen')
const Options = require('./lib/options')

Options.register()

module.exports = {
  discover,
  listen,
  Options,
}
