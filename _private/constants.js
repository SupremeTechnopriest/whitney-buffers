import Buffer from '../buffer'
export const SHORT_INFINITY = 32767
export const SHORT_NEG_INFINITY = 0 - SHORT_INFINITY
export const INT_NULL = -2147483648
export const INT_INFINITY = 2147483647
export const INT_NEG_INFINITY = 0 - INT_INFINITY
export const ZERO_BYTE = Buffer.alloc(1)
ZERO_BYTE.writeUInt8(0, 0)

export const QTYPES2NUM = {
  boolean: 1,
  guid: 2,
  byte: 4,
  short: 5,
  int: 6,
  long: 7,
  real: 8,
  float: 9,
  char: 10,
  symbol: 11,
  timestamp: 12,
  month: 13,
  date: 14,
  datetime: 15,
  timespan: 16,
  minute: 17,
  second: 18,
  time: 19
}
export const QTYPES2SIZE = {
  boolean: 1,
  guid: 16,
  byte: 1,
  short: 2,
  int: 4,
  long: 8,
  real: 4,
  float: 8,
  char: 1,
  // "symbol": , // variable length
  timestamp: 8,
  month: 4,
  date: 4,
  datetime: 8,
  timespan: 8,
  minute: 4,
  second: 4,
  time: 4
}
export const SYMBOL_STRING_REGEX = /^`\S+$/
