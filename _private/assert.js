/**
 * Assert the supplied value is a boolean
 * @param  {any} val
 * @throws {Error}
 */
export function string (val) {
  'use strict'
  if (typeof val !== 'string') {
    throw new Error(`expected "${val}" to be a string`)
  }
  if (val === '') {
    throw new Error(`string must not be empty`)
  }
}

/**
 * Assert the supplied value is a boolean
 * @param  {any} val
 * @throws {Error}
 */
export function bool (val) {
  'use strict'
  if (typeof val !== 'boolean') {
    throw new Error(`expected "${val}" to be a boolean`)
  }
}

/**
 * Assert the supplied value is a number
 * @param  {any} val
 * @throws {Error}
 */
export function number (val) {
  'use strict'
  if (typeof val !== 'number') {
    throw new Error(`expected "${val}" to be a number`)
  }
}

/**
 * Assert the supplied value is a object
 * @param  {any} val
 * @throws {Error}
 */
export function object (val) {
  'use strict'
  if (typeof val !== 'object' || val === null) {
    throw new Error(`expected "${val}" to be an object`)
  }
  if (Object.keys(val).length === 0) {
    throw new Error('object must not be empty')
  }
}

/**
 * Assert the supplied value is a date
 * @param  {any} val
 * @throws {Error}
 */
export function date (val) {
  'use strict'
  if (!(val instanceof Date)) {
    throw new Error(`expected "${val}" to be a date`)
  }
}

/**
 * Assert the supplied value is a array
 * @param  {any} val
 * @throws {Error}
 */
export function array (val) {
  'use strict'
  if (!Array.isArray(val)) {
    throw new Error(`expected "${val}" to be an array`)
  }
  if (val.length === 0) {
    throw new Error(`array must not be empty`)
  }
}

// Buffer Validators
export function checkInt (buf, value, offset, ext, max, min) {
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

export function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

export function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

export function checkSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  } else if (size > 0x7fffffff) {
    throw new RangeError('Invalid typed array length')
  }
}
