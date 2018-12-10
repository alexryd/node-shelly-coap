const EventEmitter = require('events')

class Property extends EventEmitter {
  constructor(id, type, range, blockId) {
    super()

    this.id = id
    this.type = type
    this.range = range
    this.blockId = blockId
    this._value = null
  }

  get value() {
    return this._value
  }

  set value(newValue) {
    if (newValue !== this._value) {
      const oldValue = this._value
      this._value = newValue
      this.emit('change', newValue, oldValue)
    }
  }
}

class Block {
  constructor(id, description) {
    this._id = id
    this._description = description
    this._properties = new Map()
  }

  get id() {
    return this._id
  }

  get description() {
    return this._description
  }

  [Symbol.iterator]() {
    return this._properties.values()
  }

  getPropertyById(id) {
    return this._properties.get(id)
  }
}

class Device {
  constructor(id, type, descriptionData) {
    this._id = id
    this._type = type
    this._blocks = new Map()
    this._properties = new Map()

    for (let b of descriptionData.blk) {
      const block = new Block(b.I, b.D)

      this._blocks.set(b.I, block)
      this[b.D] = block
    }

    for (let s of descriptionData.sen) {
      const prop = new Property(s.I, s.T, s.R, s.L)
      const block = this._blocks.get(s.L)

      this._properties.set(s.I, prop)
      block._properties.set(s.I, prop)
      block[s.D || s.T] = prop
    }
  }

  get id() {
    return this._id
  }

  get type() {
    return this._type
  }

  [Symbol.iterator]() {
    return this._blocks.values()
  }

  getBlockById(id) {
    return this._blocks.get(id)
  }

  properties() {
    return this._properties.values()
  }

  getPropertyById(id) {
    return this._properties.get(id)
  }

  update(statusData) {
    for (let tuple of statusData.G) {
      const prop = this.getPropertyById(tuple[1])
      if (prop) {
        prop.value = tuple[2]
      }
    }
  }
}

module.exports = Device
