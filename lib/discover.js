const coap = require('coap')

const {agent} = require('./requests')
const Message = require('./message')

const discover = (responseHandler, timeout = 1000) => {
  return new Promise((resolve, reject) => {
    const t = setTimeout(resolve, timeout + 10)

    coap.request({
      host: '224.0.1.187',
      method: 'GET',
      pathname: '/cit/d',
      multicast: true,
      multicastTimeout: timeout,
      agent,
    })
      .on('response', res => {
        if (responseHandler) {
          responseHandler(new Message(res))
        }
      })
      .on('error', err => {
        clearTimeout(t)
        reject(err)
      })
      .end()
  })
}

module.exports = discover
