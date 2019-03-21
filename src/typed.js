import Long from 'long'
import * as assert from '../_private/assert'

export class Typed {
  constructor (type, value, valuetype) {
    this._type = type
    this._value = value
    this._valuetype = valuetype
  }

  get type () { return this._type }
  get value () { return this._value }
  get valuetype () {
    if (this._type !== 'typedlist') {
      throw new Error('only available for type typedlist')
    }
    return this._valuetype
  }
  toString () {
    if (this._type === 'typedlist') {
      return `list[${this._valuetype}](${this._value})`
    }
    return `${this._type}(${this._value})`
  }
}

function listOf (assertfn, values, valuetype) {
  'use strict'
  assert.array(values, 'array')
  values.forEach(function (v) {
    assertfn(v)
  })
  return new Typed('typedlist', values, valuetype)
}

/**
 * Tells the encoder to encode this value as a boolean
 * @param  {boolean} boolean
 * @return {Typed}
 */
export const b = function (boolean) {
  'use strict'
  assert.bool(boolean)
  return new Typed('boolean', boolean)
}
/**
 * Tells the encoder to encode this value as a list booleans
 * @param  {[boolean]} booleans
 * @return {Typed}
 */
export const B = function (booleans) {
  'use strict'
  return listOf(assert.bool, booleans, 'boolean')
}

/**
 * Tells the encoder to encode this value as a guid
 * @param  {string} string
 * @return {Typed}
 */
export const g = function (string) {
  'use strict'
  assert.string(string, 'string')
  return new Typed('guid', string)
}
/**
 * Tells the encoder to encode these values as guids
 * @param  {string} string
 * @return {Typed}
 */
export const G = function (strings) {
  'use strict'
  return listOf(assert.string, strings, 'guid')
}

/**
 * Tells the encoder to encode this value as a guid
 * @param  {string} string
 * @return {Typed}
 */
export const x = function (number) {
  'use strict'
  assert.number(number, 'number')
  return new Typed('byte', number)
}
/**
 * Tells the encoder to encode this value as a guid
 * @param  {string} string
 * @return {Typed}
 */
export const X = function (numbers) {
  'use strict'
  return listOf(assert.number, numbers, 'byte')
}

/**
 * Tells the encoder to encode this value as a guid
 * @param  {string} string
 * @return {Typed}
 */
export const h = function (number) {
  'use strict'
  assert.number(number, 'number')
  return new Typed('short', number)
}
/**
 * Tells the encoder to encode this value as a guid
 * @param  {string} string
 * @return {Typed}
 */
export const H = function (numbers) {
  'use strict'
  return listOf(assert.number, numbers, 'short')
}

/**
 * Tells the encoder to encode this value as a guid
 * @param  {string} string
 * @return {Typed}
 */
export const i = function (number) {
  'use strict'
  assert.number(number, 'number')
  return new Typed('int', number)
}
/**
 * Tells the encoder to encode this value as a guid
 * @param  {string} string
 * @return {Typed}
 */
export const I = function (numbers) {
  'use strict'
  return listOf(assert.number, numbers, 'int')
}

/**
 * Tells the encoder to encode this value as a guid
 * @param  {string} string
 * @return {Typed}
 */
export const j = function ({ low, high }) {
  if (low === Infinity || low === -Infinity) {
    return new Typed('long', low)
  }
  if (high === Infinity || high === -Infinity) {
    return new Typed('long', high)
  }
  if ((!low && low !== 0) || (!high && high !== 0)) {
    throw new Error('low and high required for long')
  }
  const long = new Long(low, high)
  return new Typed('long', long)
}
/**
 * Tells the encoder to encode this value as a guid
 * @param  {string} string
 * @return {Typed}
 */
export const J = function (longs) {
  longs = longs.map(l => {
    if (l.low === Infinity || l.low === -Infinity) {
      return l.low
    }
    if (l.high === Infinity || l.high === -Infinity) {
      return l.high
    }
    if ((!l.low && l.low !== 0) || (!l.high && l.high !== 0)) {
      throw new Error('low and high required for long')
    }
    return new Long(l.low, l.high)
  })
  return new Typed('typedlist', longs, 'long')
}

/**
 * Tells the encoder to encode this value as a guid
 * @param  {string} string
 * @return {Typed}
 */
export const e = function (number) {
  'use strict'
  assert.number(number, 'number')
  return new Typed('real', number)
}
/**
 * Tells the encoder to encode this value as a guid
 * @param  {string} string
 * @return {Typed}
 */
export const E = function (numbers) {
  'use strict'
  return listOf(assert.number, numbers, 'real')
}

/**
 * Tells the encoder to encode this value as a guid
 * @param  {string} string
 * @return {Typed}
 */
export const f = function (number) {
  'use strict'
  assert.number(number, 'number')
  return new Typed('float', number)
}
/**
 * Tells the encoder to encode this value as a guid
 * @param  {string} string
 * @return {Typed}
 */
export const F = function (numbers) {
  'use strict'
  return listOf(assert.number, numbers, 'float')
}

/**
 * Tells the encoder to encode this value as a guid
 * @param  {string} string
 * @return {Typed}
 */
export const c = function (string) {
  'use strict'
  assert.string(string, 'string')
  return new Typed('char', string)
}
/**
 * Tells the encoder to encode this value as a guid
 * @param  {string} string
 * @return {Typed}
 */
export const C = function (strings) {
  'use strict'
  return listOf(assert.string, strings, 'char')
}

/**
 * Tells the encoder to encode this value as a guid
 * @param  {string} string
 * @return {Typed}
 */
export const s = function (string) {
  'use strict'
  assert.string(string, 'string')
  return new Typed('symbol', string)
}
/**
 * Tells the encoder to encode this value as a guid
 * @param  {string} string
 * @return {Typed}
 */
export const S = function (strings) {
  'use strict'
  return listOf(assert.string, strings, 'symbol')
}

/**
 * Tells the encoder to encode this value as a guid
 * @param  {string} string
 * @return {Typed}
 */
export const p = function (date) {
  'use strict'
  assert.date(date, 'date')
  return new Typed('timestamp', date)
}
/**
 * Tells the encoder to encode this value as a guid
 * @param  {string} string
 * @return {Typed}
 */
export const P = function (dates) {
  'use strict'
  return listOf(assert.date, dates, 'timestamp')
}

/**
 * Tells the encoder to encode this value as a guid
 * @param  {string} string
 * @return {Typed}
 */
export const m = function (date) {
  'use strict'
  assert.date(date, 'date')
  return new Typed('month', date)
}
/**
 * Tells the encoder to encode this value as a guid
 * @param  {string} string
 * @return {Typed}
 */
export const M = function (dates) {
  'use strict'
  return listOf(assert.date, dates, 'month')
}

/**
 * Tells the encoder to encode this value as a guid
 * @param  {string} string
 * @return {Typed}
 */
export const d = function (date) {
  'use strict'
  assert.date(date, 'date')
  return new Typed('date', date)
}
/**
 * Tells the encoder to encode this value as a guid
 * @param  {string} string
 * @return {Typed}
 */
export const D = function (dates) {
  'use strict'
  return listOf(assert.date, dates, 'date')
}

/**
 * Tells the encoder to encode this value as a guid
 * @param  {string} string
 * @return {Typed}
 */
export const z = function (date) {
  'use strict'
  assert.date(date, 'date')
  return new Typed('datetime', date)
}
/**
 * Tells the encoder to encode this value as a guid
 * @param  {string} string
 * @return {Typed}
 */
export const Z = function (dates) {
  'use strict'
  return listOf(assert.date, dates, 'datetime')
}

/**
 * Tells the encoder to encode this value as a guid
 * @param  {string} string
 * @return {Typed}
 */
export const n = function (date) {
  'use strict'
  assert.date(date, 'date')
  return new Typed('timespan', date)
}
/**
 * Tells the encoder to encode this value as a guid
 * @param  {string} string
 * @return {Typed}
 */
export const N = function (dates) {
  'use strict'
  return listOf(assert.date, dates, 'timespan')
}

/**
 * Tells the encoder to encode this value as a guid
 * @param  {string} string
 * @return {Typed}
 */
export const u = function (date) {
  'use strict'
  assert.date(date, 'date')
  return new Typed('minute', date)
}
/**
 * Tells the encoder to encode this value as a guid
 * @param  {string} string
 * @return {Typed}
 */
export const U = function (dates) {
  'use strict'
  return listOf(assert.date, dates, 'minute')
}

/**
 * Tells the encoder to encode this value as a guid
 * @param  {string} string
 * @return {Typed}
 */
export const v = function (date) {
  'use strict'
  assert.date(date, 'date')
  return new Typed('second', date)
}
/**
 * Tells the encoder to encode this value as a guid
 * @param  {string} string
 * @return {Typed}
 */
export const V = function (dates) {
  'use strict'
  return listOf(assert.date, dates, 'second')
}

/**
 * Tells the encoder to encode this value as a time
 * @param  {string} string
 * @return {Typed}
 */
export const t = function (date) {
  'use strict'
  assert.date(date, 'date')
  return new Typed('time', date)
}
/**
 * Tells the encoder to encode these values as times
 * @param  {string} string
 * @return {Typed}
 */
export const T = function (dates) {
  'use strict'
  return listOf(assert.date, dates, 'time')
}

/**
 * Tells the encoder to encode this value as a dictionary
 * @param  {string} string
 * @return {Typed}
 */
export const dict = function (object) {
  'use strict'
  assert.object(object, 'object')
  return new Typed('dict', object)
}

/**
 * Tells the encoder to encode this value as a guid
 * @param  {string} string
 * @return {Typed}
 */
export const list = function (values) {
  'use strict'
  assert.array(values, 'array')
  return new Typed('mixedlist', values)
}

/**
 * Tells the encoder to encode this value as a guid
 * @param  {string} string
 * @return {Typed}
 */
export const isTyped = function (val) {
  'use strict'
  return (val instanceof Typed)
}
