const coap = require('coap')

const Message = require('./message')

const discover = (responseHandler, timeout = 1000) => {
  // Need to override _nextToken() here because of a bug in how Shelly
  // devices respond to these broadcasted messages
  const prot = coap.Agent.prototype
  const _nextToken = prot._nextToken
  prot._nextToken = () => Buffer.alloc(0)

  return new Promise((resolve, reject) => {
    const t = setTimeout(() => {
      prot._nextToken = _nextToken
      resolve()
    }, timeout + 1)

    coap.request({
      host: '224.0.1.187',
      method: 'GET',
      pathname: '/cit/d',
      multicast: true,
      multicastTimeout: timeout,
    })
      .on('response', res => {
        if (responseHandler) {
          responseHandler(new Message(res))
        }
      })
      .on('error', err => {
        clearTimeout(t)
        prot._nextToken = _nextToken
        reject(err)
      })
      .end()
  })
}

module.exports = discover
