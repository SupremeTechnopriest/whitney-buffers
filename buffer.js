/* eslint-disable no-proto */
import ieee754 from './_private/ieee754'
import { checkIEEE754, checkInt, checkOffset, checkSize } from './_private/assert'
import { utf8ToBytes, utf8Slice, blitBuffer } from './_private/utf8'

export default function Buffer () {}

Buffer.from = function (array) {
  if ((array instanceof Uint8Array) === false) {
    throw new Error('Buffer.from() requires a Uint8Array')
  }
  const buffer = array
  buffer.__proto__ = Buffer.prototype
  return buffer
}

Buffer.alloc = function (size = 0) {
  checkSize(size)
  const buffer = new Uint8Array(size)
  buffer.__proto__ = Buffer.prototype
  return buffer
}

Buffer.byteLength = function (string) {
  if (typeof string !== 'string') {
    string = '' + string
  }
  var len = string.length
  if (len === 0) return 0
  return utf8ToBytes(string).length
}

Buffer.prototype.__proto__ = Uint8Array.prototype

Buffer.prototype.toString = function () {
  const length = this.length || 0
  if (length === 0) return ''
  return utf8Slice(this, 0, length)
}

Buffer.prototype.indexOf = function (value, offset = 0) {
  // Empty buffer means no match
  if (this.length === 0) return -1

  // Normalize byteOffset
  if (offset > 0x7fffffff) {
    offset = 0x7fffffff
  } else if (offset < -0x80000000) {
    offset = -0x80000000
  }
  offset = +offset // Coerce to Number.
  if (isNaN(offset)) {
    // offset: it it's undefined, null, NaN, "foo", etc, search whole this
    offset = this.length - 1
  }

  // Normalize offset: negative offsets start from the end of the this
  if (offset < 0) offset = this.length + offset
  if (offset >= this.length) {
    offset = this.length - 1
  } else if (offset < 0) {
    return -1
  }
  // Special case: looking for empty string/this always fails
  if (value.length === 0) {
    return -1
  }
  value = value & 0xFF // Search for a byte value [0-255]
  return Uint8Array.prototype.indexOf.call(this, value, offset)
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start
  const newBuf = this.subarray(start, end)
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

Buffer.prototype.write = function (string, offset) {
  var length = this.length - offset
  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }
  return blitBuffer(utf8ToBytes(string, this.length - offset), this, offset, length)
}

Buffer.prototype.writeInt8 = function (value, offset) {
  value = +value
  offset = offset | 0
  checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt8 = function (value, offset) {
  value = +value
  offset = offset | 0
  checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeFloatLE = function (value, offset) {
  checkIEEE754(this, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  ieee754.write(this, value, offset, 23, 4)
  return offset + 4
}

Buffer.prototype.writeDoubleLE = function (value, offset) {
  checkIEEE754(this, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  ieee754.write(this, value, offset, 52, 8)
  return offset + 8
}

Buffer.prototype.writeInt16LE = function (value, offset) {
  value = +value
  offset = offset | 0
  checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function (value, offset) {
  value = +value
  offset = offset | 0
  checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.readInt8 = function (offset) {
  checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readUInt8 = function (offset) {
  checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readFloatLE = function (offset) {
  checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, 23, 4)
}

Buffer.prototype.readDoubleLE = function (offset) {
  checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, 52, 8)
}

Buffer.prototype.readInt16LE = function (offset) {
  offset = offset >>> 0
  checkOffset(offset, 2, this.length)
  const val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function (offset) {
  offset = offset >>> 0
  checkOffset(offset, 4, this.length)
  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = Buffer
}
