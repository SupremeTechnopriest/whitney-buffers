/* eslint-disable no-redeclare */
import Long from 'long'
import {
  ZERO_BYTE,
  SHORT_INFINITY,
  SHORT_NEG_INFINITY,
  INT_NULL,
  INT_INFINITY,
  INT_NEG_INFINITY
} from '../_private/constants'

export default function decode (b, nanos2date = true) {
  let pos = 8
  function rBool () {
    return rInt8() === 1
  }
  function rChar () {
    const val = rUInt8()
    if (val === 32) {
      return null
    } else {
      return String.fromCharCode(val)
    }
  }
  function rString (n) {
    const val = b.slice(pos, pos + n).toString('utf8')
    pos += n
    return val
  }
  function rInt8 () {
    const val = b.readInt8(pos)
    pos += 1
    return val
  }
  function rInt (n) {
    let val
    if (n === 1) {
      val = b.readInt8(pos)
    } else if (n === 2) {
      val = b.readInt16LE(pos)
    } else if (n === 4) {
      val = b.readInt32LE(pos)
    } else {
      throw new Error('only n = 1, 2 or 4 is supported')
    }
    pos += n
    return val
  }
  function rUInt8 () {
    const val = b.readUInt8(pos)
    pos += 1
    return val
  }
  function rGuid () {
    const x = '0123456789abcdef'
    let s = ''
    for (let i = 0; i < 16; i++) {
      const c = rUInt8()
      s += i === 4 || i === 6 || i === 8 || i === 10 ? '-' : ''
      s += x[c >> 4]
      s += x[c & 15]
    }
    return s
  }
  function rInt16 () {
    const h = rInt(2)
    if (h === SHORT_INFINITY) {
      return Infinity
    } else if (h === SHORT_NEG_INFINITY) {
      return -Infinity
    } else {
      return h
    }
  }
  function rInt32 () {
    const i = rInt(4)
    if (i === INT_INFINITY) {
      return Infinity
    } else if (i === INT_NEG_INFINITY) {
      return -Infinity
    } else {
      return i
    }
  }
  function rInt64 () {
    const low = rInt(4)
    const high = rInt(4)
    const val = new Long(low, high, false)
    if (low === -1 && high === INT_INFINITY) {
      return Infinity
    }
    if (low === 1 && high === INT_NULL) {
      return -Infinity
    }
    return val
  }
  function rFloat32 () {
    const val = b.readFloatLE(pos)
    pos += 4
    return val
  }
  function rFloat64 () {
    const val = b.readDoubleLE(pos)
    pos += 8
    return val
  }
  function rSymbol () {
    const e = b.indexOf(ZERO_BYTE, pos)
    const s = rString(e - pos)
    pos += 1 // zero byte
    return s
  }
  function rTimestamp () {
    const val = rInt64()
    if (nanos2date === false) {
      return 86400000000000 * (10957 + (val / 86400000000000))
    } else {
      return date(val / 86400000000000)
    }
  }
  function rMonth () {
    let y = rInt32()
    const m = y % 12
    y = 2000 + y / 12
    return new Date(Date.UTC(y, m, 1))
  }
  function date (n) {
    return new Date(86400000 * (10957 + n))
  }
  function rDate () {
    const val = rInt32()
    return (val === null) ? null : date(val)
  }
  function rDateTime () {
    const val = rFloat64()
    return (val === null) ? null : date(val)
  }
  function rTimespan () {
    const val = rInt64()
    if (nanos2date === false) {
      return val
    }
    return date(val / 86400000000000)
  }
  function rSecond () {
    const val = rInt32()
    return date(val / 86400)
  }
  function rMinute () {
    const val = rInt32()
    return date(val / 1440)
  }
  function rTime () {
    const val = rInt32()
    return date(val / 86400000)
  }
  function r () {
    const fns = [r, rBool, rGuid, null, rUInt8, rInt16, rInt32, rInt64, rFloat32, rFloat64, rChar, rSymbol, rTimestamp, rMonth, rDate, rDateTime, rTimespan, rMinute, rSecond, rTime]
    let i = 0
    let n
    const t = rInt8()
    if (t === -128) {
      throw new Error(rSymbol())
    }
    if (t < 0 && t > -20) {
      return fns[-t]()
    }
    if (t > 99 && t < 104) {
      return rInt8() === 0 && t === 101 ? null : 'func'
    }
    if (t === 99) {
      const x = r()
      const y = r()
      const o = {}
      for (i = 0; i < x.length; i++) {
        o[x[i]] = y[i]
      }
      return o
    }
    pos++
    n = rInt32()
    if (t === 10) {
      return rString(n)
    }
    const A = new Array(n)
    const f = fns[t]
    for (i = 0; i < n; i++) {
      A[i] = f()
    }
    return A
  }
  return r()
}
