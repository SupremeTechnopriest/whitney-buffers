/* eslint-disable no-redeclare */
import Long from 'long'
import { parse as uuidParse } from 'uuid-parse'
import {
  SHORT_INFINITY,
  SHORT_NEG_INFINITY,
  INT_INFINITY,
  INT_NEG_INFINITY,
  SYMBOL_STRING_REGEX
} from '../_private/constants'
import {
  inferType,
  getVals,
  isListOfSamePrimitiveType,
  type2num,
  calcN
} from '../_private/utils'
import { Typed, isTyped } from './typed'

export default function encode (x) {
  var pos = 0
  var b
  function wb (i) {
    b.writeInt8(i, pos)
    pos += 1
  }
  function wub (i) {
    b.writeUInt8(i, pos)
    pos += 1
  }
  function wr (i) {
    b.writeFloatLE(i, pos)
    pos += 4
  }
  function wf (i) {
    b.writeDoubleLE(i, pos)
    pos += 8
  }
  function wn (n, i) {
    if (n === 1) {
      b.writeInt8(i, pos)
    } else if (n === 2) {
      b.writeInt16LE(i, pos)
    } else if (n === 4) {
      b.writeInt32LE(i, pos)
    } else {
      throw new Error('only n = 1, 2 or 4 is supported')
    }
    pos += n
  }
  function wlongjs (x) {
    wn(4, x.low)
    wn(4, x.high)
  }
  function wboolean (x) {
    wb(x ? 1 : 0)
  }
  function wguid (x) {
    uuidParse(x, b, pos)
    pos += 16
  }
  function wbyte (x) {
    wb(x)
  }
  function wshort (x) {
    if (x === Infinity) {
      wn(2, SHORT_INFINITY)
    } else if (x === -Infinity) {
      wn(2, SHORT_NEG_INFINITY)
    } else {
      wn(2, x)
    }
  }
  function wint (x) {
    if (x === Infinity) {
      wn(4, INT_INFINITY)
    } else if (x === -Infinity) {
      wn(4, INT_NEG_INFINITY)
    } else {
      wn(4, x)
    }
  }
  function wlong (x) {
    if (x === Infinity) {
      wub(255)
      wub(255)
      wub(255)
      wub(255)
      wub(255)
      wub(255)
      wub(255)
      wub(127)
    } else if (x === -Infinity) {
      wub(1)
      wub(0)
      wub(0)
      wub(0)
      wub(0)
      wub(0)
      wub(0)
      wub(128)
    } else {
      wlongjs(x)
    }
  }
  function wreal (x) {
    if (x === Infinity) {
      wub(0)
      wub(0)
      wub(128)
      wub(127)
    } else if (x === -Infinity) {
      wub(0)
      wub(0)
      wub(128)
      wub(255)
    } else {
      wr(x)
    }
  }
  function wfloat (x) {
    if (x === Infinity) {
      wub(0)
      wub(0)
      wub(0)
      wub(0)
      wub(0)
      wub(0)
      wub(240)
      wub(127)
    } else if (x === -Infinity) {
      wub(0)
      wub(0)
      wub(0)
      wub(0)
      wub(0)
      wub(0)
      wub(240)
      wub(255)
    } else {
      wf(x)
    }
  }
  function wchar (x) {
    wub(x.charCodeAt())
  }
  function wstring (x) {
    pos += b.write(x, pos)
  }
  function wsymbol (x) {
    if (x !== null) {
      wstring(x)
    }
    wb(0)
  }
  function wtimestamp (x) {
    wlong(Long.fromNumber(86400000000000 * (x.getTime() / 86400000 - 10957)))
  }
  function wmonth (x) {
    wn(4, (x.getUTCFullYear() - 2000) * 12 + x.getUTCMonth())
  }
  function wdate (x) {
    wn(4, x.getTime() / 86400000 - 10957)
  }
  function wdatetime (x) {
    wf(x.getTime() / 86400000 - 10957)
  }
  function wtimespan (x) {
    var nanos = (((x.getUTCHours() * 60 + x.getUTCMinutes()) * 60 + x.getUTCSeconds()) * 1000 + x.getUTCMilliseconds()) * 1000 * 1000
    wlong(Long.fromNumber(nanos))
  }
  function wminute (x) {
    wn(4, x.getUTCHours() * 60 + x.getUTCMinutes())
  }
  function wsecond (x) {
    wn(4, (x.getUTCHours() * 60 + x.getUTCMinutes()) * 60 + x.getUTCSeconds())
  }
  function wtime (x) {
    wn(4, ((x.getUTCHours() * 60 + x.getUTCMinutes()) * 60 + x.getUTCSeconds()) * 1000 + x.getUTCMilliseconds())
  }

  var qtype2wfn = {
    'boolean': wboolean,
    'guid': wguid,
    'byte': wbyte,
    'short': wshort,
    'int': wint,
    'long': wlong,
    'real': wreal,
    'float': wfloat,
    'char': wchar,
    'symbol': wsymbol,
    'timestamp': wtimestamp,
    'month': wmonth,
    'date': wdate,
    'datetime': wdatetime,
    'timespan': wtimespan,
    'minute': wminute,
    'second': wsecond,
    'time': wtime
  }

  function type2wfn (t) {
    var wfn = qtype2wfn[t]
    if (wfn === undefined) {
      throw new Error('bad type ' + t)
    }
    return wfn
  }

  function w (x, dt) {
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
      {
        wb(101)
        wb(0)
        return
      }
      case 'dict':
      {
        var k = Object.keys(x)
        wb(99)
        wb(11)
        wb(0)
        wn(4, k.length)
        for (var i = 0; i < k.length; i++) {
          wsymbol(k[i])
        }
        w(getVals(x))
        return
      }
      case 'list':
      {
        if (x.length > 0 && (dt === null || dt === undefined)) {
          var valuetype = inferType(x[0])
          if (isListOfSamePrimitiveType(x, valuetype)) {
            return w(new Typed('typedlist', x.map(function (x1) {
              if (isTyped(x1)) {
                return x1.value
              } else {
                return x1
              }
            }), valuetype))
          }
        }
        return w(x, 'mixedlist')
      }
      case 'mixedlist':
      {
        wb(0)
        wb(0)
        wn(4, x.length)
        for (var i = 0; i < x.length; i++) {
          w(x[i], null)
        }
        return
      }
      case 'typedlist':
      {
        wb(type2num(vt))
        wb(0)
        wn(4, x.length)
        var wfn = type2wfn(vt)
        x.forEach(wfn)
        return
      }
      case 'string': // JavaScript only type => list of char
      {
        if (SYMBOL_STRING_REGEX.test(x)) {
          w(x.substr(1), 'symbol')
        } else {
          wb(10)
          wb(0)
          wn(4, Buffer.byteLength(x, 'utf8'))
          wstring(x)
        }
        return
      }
    }
    var num = type2num(t)
    var wfn = type2wfn(t)
    wb(0 - num)
    wfn(x)
  }
  var n = calcN(x, null)
  b = Buffer.alloc(8 + n)
  wb(1)
  wb(0)
  wb(0)
  wb(0)
  wn(4, b.length)
  w(x, null)
  return b
}
