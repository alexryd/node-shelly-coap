const Options = require('./options')

class Message {
  constructor(msg) {
    this.msg = msg

    const headers = msg.headers

    if (headers[Options.GLOBAL_DEVID]) {
      const parts = headers[Options.GLOBAL_DEVID].split('#')
      this.deviceType = parts[0]
      this.deviceId = parts[1]
      this.deviceRevision = parts[2]
    }

    if (headers[Options.STATUS_VALIDITY]) {
      const validity = headers[Options.STATUS_VALIDITY]
      if ((validity & 0x1) === 0) {
        this.validFor = Math.floor(validity / 10)
      } else {
        this.validFor = validity * 4
      }
    }

    if (headers[Options.STATUS_SERIAL]) {
      this.serial = headers[Options.STATUS_SERIAL]
    }

    try {
      this.payload = JSON.parse(msg.payload.toString())
    } catch (e) {
      this.payload = msg.payload.toString()
    }
  }
}

module.exports = Message
