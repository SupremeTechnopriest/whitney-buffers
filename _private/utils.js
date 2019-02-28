/* eslint-disable no-redeclare */
import { Typed, isTyped } from '../src/typed'
import {
  QTYPES2SIZE,
  QTYPES2NUM,
  SYMBOL_STRING_REGEX
} from './constants'

export function type2num (t) {
  var num = QTYPES2NUM[t]
  if (num === undefined) {
    throw new Error('bad type ' + t)
  }
  return num
}

export function type2size (t) {
  var size = QTYPES2SIZE[t]
  if (size === undefined) {
    throw new Error('bad type ' + t)
  }
  return size
}

export function inferType (x) {
  if (isTyped(x)) {
    return x.type
  }
  if (x === null) {
    return 'null'
  }
  if (typeof x === 'number') {
    return 'float'
  }
  if (x instanceof Date) {
    return 'datetime'
  }
  if (typeof x === 'boolean') {
    return 'boolean'
  }
  if (Array.isArray(x)) {
    return 'list'
  }
  if (typeof x === 'string') {
    return 'string'
  }
  if (typeof x === 'object') {
    return 'dict'
  }
}

export function isListOfSamePrimitiveType (elements, valuetype) {
  if (valuetype === 'list' || valuetype === 'typedlist' || valuetype === 'mixedlist' || valuetype === 'string' || valuetype === 'dict' || valuetype === 'null') {
    return false
  }
  return elements.every(function (x) {
    return inferType(x) === valuetype
  })
}

export function calcN (x, dt) {
  var t, vt
  if (dt) {
    t = dt
  } else {
    if (isTyped(x)) {
      t = x.type
      if (t === 'typedlist') {
        vt = x.valuetype
      }
      x = x.value
    } else {
      t = inferType(x)
    }
  }
  switch (t) {
    case 'null': // JavaScript only type
      return 2
    case 'symbol':
    {
      if (x === null) {
        return 2
      }
      return 2 + Buffer.byteLength(x, 'utf8')
    }
    case 'dict':
    {
      var n = 1 + 6
      var k = Object.keys(x)
      for (var i = 0; i < k.length; i++) {
        n += 1 + k[i].length
      }
      return n + calcN(getVals(x))
    }
    case 'list':
    {
      if (x.length > 0 && (dt === null || dt === undefined)) {
        var valuetype = inferType(x[0])
        if (isListOfSamePrimitiveType(x, valuetype)) {
          return calcN(new Typed('typedlist', x.map(function (x1) {
            if (isTyped(x1)) {
              return x1.value
            } else {
              return x1
            }
          }), valuetype))
        }
      }
      return calcN(x, 'mixedlist')
    }
    case 'mixedlist':
    {
      var n = 6
      for (var i = 0; i < x.length; i++) {
        n += calcN(x[i], null)
      }
      return n
    }
    case 'typedlist':
    {
      var n = 6
      if (vt === 'symbol') {
        for (var i = 0; i < x.length; i++) {
          n += 1 + Buffer.byteLength(x[i], 'utf8')
        }
      } else {
        n += type2size(vt) * x.length
      }
      return n
    }
    case 'string': // JavaScript only type => list of char
    {
      var n = Buffer.byteLength(x, 'utf8') + (SYMBOL_STRING_REGEX.test(x) ? 1 : 6)
      return n
    }
    // TODO implement calcN for table type
  }
  return 1 + type2size(t)
}

export function getVals (x) { // can be replaces with Object.values someday
  var v = []; var o
  for (o in x) {
    if (x.hasOwnProperty(o)) {
      v.push(x[o])
    }
  }
  return v
}
