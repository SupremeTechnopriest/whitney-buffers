/* eslint-env jest */
import Long from 'long'
import { testTime } from '../utils'
import wb from '../../index'
import enc from '../../src/encode'
import dec from '../../src/decode'
import {
  obj,
  objTyped,
  invalidUntypedNulls,
  validUntypedNulls
} from '../data'

describe('[NODE] encode()', () => {
  // Test defaults untyped
  describe('untyped', () => {
    test('Should encode untyped', () => {
      const encoded = wb.enc(obj)
      expect(encoded).toBeInstanceOf(Buffer)
      const decoded = dec(encoded)
      Object.keys(obj).forEach(k => {
        testDecodedUntyped(k, decoded[k], obj[k])
      })
    })

    describe('null types', () => {
      Object.keys(validUntypedNulls).forEach(k => {
        test(`Should encode untyped ${k}`, () => {
          const _obj = {}
          _obj[k] = validUntypedNulls[k]
          const encoded = wb.enc(_obj)
          expect(encoded).toBeInstanceOf(Buffer)
          const decoded = dec(encoded)
          expect(decoded[k]).toEqual(_obj[k])
        })
      })

      Object.keys(invalidUntypedNulls).forEach(k => {
        test(`Should throw error for untyped ${k}`, () => {
          const _obj = {}
          _obj[k] = invalidUntypedNulls[k]
          expect(() => { wb.enc(_obj) }).toThrow()
        })
      })
    })
  })

  describe('boolean', () => {
    test('Should throw when boolean type is incorrect', () => {
      expect(() => { wb.b(null) }).toThrow(new Error('expected "null" to be a boolean'))
      expect(() => { wb.b(undefined) }).toThrow(new Error('expected "undefined" to be a boolean'))
      expect(() => { wb.b('') }).toThrow(new Error('expected "" to be a boolean'))
      expect(() => { wb.b(1) }).toThrow(new Error('expected "1" to be a boolean'))
      expect(() => { wb.B([1, 2]) }).toThrow(new Error('expected "1" to be a boolean'))
    })
    test('Should encode typed booleans', () => {
      const data = {
        bool: wb.b(obj.boolean),
        bools: wb.B(obj.booleans)
      }
      const encoded = enc(data)
      expect(encoded).toBeInstanceOf(Buffer)
      const decoded = dec(encoded)
      expect(decoded).toEqual({
        bool: obj.boolean,
        bools: obj.booleans
      })
    })
  })

  describe('guid', () => {
    test('Should throw when guid type is incorrect', () => {
      expect(() => { wb.g(null) }).toThrow(new Error('expected "null" to be a string'))
      expect(() => { wb.g(undefined) }).toThrow(new Error('expected "undefined" to be a string'))
      expect(() => { wb.g('') }).toThrow(new Error('string must not be empty'))
      expect(() => { wb.g(1) }).toThrow(new Error('expected "1" to be a string'))
      expect(() => { wb.G([1, 2]) }).toThrow(new Error('expected "1" to be a string'))
    })
    test('Should encode typed guids', () => {
      const data = {
        guid: wb.g(obj.guid),
        guids: wb.G(obj.guids)
      }
      const encoded = enc(data)
      expect(encoded).toBeInstanceOf(Buffer)
      const decoded = dec(encoded)
      expect(decoded).toEqual({
        guid: obj.guid,
        guids: obj.guids
      })
    })
  })

  describe('byte', () => {
    test('Should throw when byte type is incorrect', () => {
      expect(() => { wb.x(null) }).toThrow(new Error('expected "null" to be a number'))
      expect(() => { wb.x(undefined) }).toThrow(new Error('expected "undefined" to be a number'))
      expect(() => { wb.x('') }).toThrow(new Error('expected "" to be a number'))
      expect(() => { wb.x('a') }).toThrow(new Error('expected "a" to be a number'))
      expect(() => { wb.X(['a', 'b']) }).toThrow(new Error('expected "a" to be a number'))
    })
    test('Should encode typed bytes', () => {
      const data = {
        byte: wb.x(obj.byte),
        bytes: wb.X(obj.bytes)
      }
      const encoded = enc(data)
      expect(encoded).toBeInstanceOf(Buffer)
      const decoded = dec(encoded)
      expect(decoded).toEqual({
        byte: obj.byte,
        bytes: obj.bytes
      })
    })
  })

  describe('short', () => {
    test('Should throw when short type is incorrect', () => {
      expect(() => { wb.h(null) }).toThrow(new Error('expected "null" to be a number'))
      expect(() => { wb.h(undefined) }).toThrow(new Error('expected "undefined" to be a number'))
      expect(() => { wb.h('') }).toThrow(new Error('expected "" to be a number'))
      expect(() => { wb.h('a') }).toThrow(new Error('expected "a" to be a number'))
      expect(() => { wb.H(['a', 'b']) }).toThrow(new Error('expected "a" to be a number'))
    })
    test('Should encode typed shorts', () => {
      const data = {
        short: wb.h(obj.short),
        shorts: wb.H(obj.shorts)
      }
      const encoded = enc(data)
      expect(encoded).toBeInstanceOf(Buffer)
      const decoded = dec(encoded)
      expect(decoded).toEqual({
        short: obj.short,
        shorts: obj.shorts
      })
    })
    test('Should encode Infinity and -Infinity', () => {
      const data = {
        infinity: wb.h(Infinity),
        ninifinity: wb.h(-Infinity)
      }
      const encoded = enc(data)
      expect(encoded).toBeInstanceOf(Buffer)
      const decoded = dec(encoded)
      expect(decoded).toEqual({
        infinity: Infinity,
        ninifinity: -Infinity
      })
    })
  })

  describe('int', () => {
    test('Should throw when int type is incorrect', () => {
      expect(() => { wb.i(null) }).toThrow(new Error('expected "null" to be a number'))
      expect(() => { wb.i(undefined) }).toThrow(new Error('expected "undefined" to be a number'))
      expect(() => { wb.i('') }).toThrow(new Error('expected "" to be a number'))
      expect(() => { wb.i('a') }).toThrow(new Error('expected "a" to be a number'))
      expect(() => { wb.I(['a', 'b']) }).toThrow(new Error('expected "a" to be a number'))
    })
    test('Should encode typed ints', () => {
      const data = {
        int: wb.i(obj.int),
        ints: wb.I(obj.ints)
      }
      const encoded = enc(data)
      expect(encoded).toBeInstanceOf(Buffer)
      const decoded = dec(encoded)
      expect(decoded).toEqual({
        int: obj.int,
        ints: obj.ints
      })
    })
    test('Should encode Infinity and -Infinity', () => {
      const data = {
        infinity: wb.i(Infinity),
        ninifinity: wb.i(-Infinity)
      }
      const encoded = enc(data)
      expect(encoded).toBeInstanceOf(Buffer)
      const decoded = dec(encoded)
      expect(decoded).toEqual({
        infinity: Infinity,
        ninifinity: -Infinity
      })
    })
  })

  describe('long', () => {
    test('Should throw when long type is incorrect', () => {
      expect(() => { wb.j({ low: null, high: null }) }).toThrow(new Error('low and high required for long'))
      expect(() => { wb.j({ low: undefined, high: undefined }) }).toThrow(new Error('low and high required for long'))
      expect(() => { wb.j({ low: '', high: '' }) }).toThrow(new Error('low and high required for long'))
      expect(() => { wb.j({ low: 'a' }) }).toThrow(new Error('low and high required for long'))
      expect(() => { wb.J([{ low: 'a' }, { high: 'b' }]) }).toThrow(new Error('low and high required for long'))
    })
    test('Should encode typed longs', () => {
      const data = {
        long: wb.j(obj.long),
        longs: wb.J(obj.longs)
      }
      const encoded = enc(data)
      expect(encoded).toBeInstanceOf(Buffer)
      const decoded = dec(encoded)
      expect(decoded.long.high).toEqual(572662306)
      expect(decoded.long.low).toEqual(-1)
      expect(decoded.long.unsigned).toEqual(false)

      expect(decoded.longs[0].high).toEqual(572662306)
      expect(decoded.longs[0].low).toEqual(-1)
      expect(decoded.longs[0].unsigned).toEqual(false)

      expect(decoded.longs[1].high).toEqual(572662306)
      expect(decoded.longs[1].low).toEqual(-1)
      expect(decoded.longs[1].unsigned).toEqual(false)
    })

    test('Should encode Infinity and -Infinity', () => {
      const data = {
        infinity: wb.j({ low: Infinity, high: Infinity }),
        ninifinity: wb.j({ low: -Infinity, high: -Infinity }),
        highInfinity: wb.j({ low: 0, high: Infinity }),
        highNInfinity: wb.j({ low: 0, high: -Infinity }),
        listInfinity: wb.J([{ low: Infinity, high: Infinity }, { low: Infinity, high: Infinity }]),
        listNinifinity: wb.J([{ low: -Infinity, high: -Infinity }, { low: -Infinity, high: -Infinity }]),
        listHighInfinity: wb.J([{ low: 0, high: Infinity }, { low: 0, high: Infinity }]),
        listHighNInfinity: wb.J([{ low: 0, high: -Infinity }, { low: 0, high: -Infinity }])
      }
      const encoded = enc(data)
      expect(encoded).toBeInstanceOf(Buffer)
      const decoded = dec(encoded)
      expect(decoded).toEqual({
        infinity: Infinity,
        ninifinity: -Infinity,
        highInfinity: Infinity,
        highNInfinity: -Infinity,
        listInfinity: [Infinity, Infinity],
        listNinifinity: [-Infinity, -Infinity],
        listHighInfinity: [Infinity, Infinity],
        listHighNInfinity: [-Infinity, -Infinity]
      })
    })
  })

  describe('real', () => {
    test('Should throw when real type is incorrect', () => {
      expect(() => { wb.e(null) }).toThrow(new Error('expected "null" to be a number'))
      expect(() => { wb.e(undefined) }).toThrow(new Error('expected "undefined" to be a number'))
      expect(() => { wb.e('') }).toThrow(new Error('expected "" to be a number'))
      expect(() => { wb.e('a') }).toThrow(new Error('expected "a" to be a number'))
      expect(() => { wb.E(['a', 'b']) }).toThrow(new Error('expected "a" to be a number'))
    })
    test('Should encode typed reals', () => {
      const data = {
        real: wb.e(obj.real),
        reals: wb.E(obj.reals)
      }
      const encoded = enc(data)
      expect(encoded).toBeInstanceOf(Buffer)
      const decoded = dec(encoded)
      expect(decoded).toEqual({
        real: obj.real,
        reals: obj.reals
      })
    })
    test('Should encode Infinity and -Infinity', () => {
      const data = {
        infinity: wb.e(Infinity),
        ninifinity: wb.e(-Infinity)
      }
      const encoded = enc(data)
      expect(encoded).toBeInstanceOf(Buffer)
      const decoded = dec(encoded)
      expect(decoded).toEqual({
        infinity: Infinity,
        ninifinity: -Infinity
      })
    })
  })

  describe('float', () => {
    test('Should throw when float type is incorrect', () => {
      expect(() => { wb.f(null) }).toThrow(new Error('expected "null" to be a number'))
      expect(() => { wb.f(undefined) }).toThrow(new Error('expected "undefined" to be a number'))
      expect(() => { wb.f('') }).toThrow(new Error('expected "" to be a number'))
      expect(() => { wb.f('a') }).toThrow(new Error('expected "a" to be a number'))
      expect(() => { wb.F(['a', 'b']) }).toThrow(new Error('expected "a" to be a number'))
    })
    test('Should encode typed floats', () => {
      const data = {
        float: wb.f(obj.float),
        floats: wb.F(obj.floats)
      }
      const encoded = enc(data)
      expect(encoded).toBeInstanceOf(Buffer)
      const decoded = dec(encoded)
      expect(decoded).toEqual({
        float: obj.float,
        floats: obj.floats
      })
    })
    test('Should encode Infinity and -Infinity', () => {
      const data = {
        infinity: wb.f(Infinity),
        ninifinity: wb.f(-Infinity)
      }
      const encoded = enc(data)
      expect(encoded).toBeInstanceOf(Buffer)
      const decoded = dec(encoded)
      expect(decoded).toEqual({
        infinity: Infinity,
        ninifinity: -Infinity
      })
    })
  })

  describe('char', () => {
    test('Should throw when char type is incorrect', () => {
      expect(() => { wb.c(null) }).toThrow(new Error('expected "null" to be a string'))
      expect(() => { wb.c(undefined) }).toThrow(new Error('expected "undefined" to be a string'))
      expect(() => { wb.c('') }).toThrow(new Error('string must not be empty'))
      expect(() => { wb.c(1) }).toThrow(new Error('expected "1" to be a string'))
      expect(() => { wb.C([1, 2]) }).toThrow(new Error('expected "1" to be a string'))
    })
    test('Should encode typed chars', () => {
      const data = {
        char: wb.c(obj.char),
        chars: wb.C(obj.chars)
      }
      const encoded = enc(data)
      expect(encoded).toBeInstanceOf(Buffer)
      const decoded = dec(encoded)
      expect(decoded).toEqual({
        char: obj.char,
        chars: obj.chars.join('')
      })
    })
  })

  describe('symbol', () => {
    test('Should throw when symbol type is incorrect', () => {
      expect(() => { wb.s(null) }).toThrow(new Error('expected "null" to be a string'))
      expect(() => { wb.s(undefined) }).toThrow(new Error('expected "undefined" to be a string'))
      expect(() => { wb.s('') }).toThrow(new Error('string must not be empty'))
      expect(() => { wb.s(1) }).toThrow(new Error('expected "1" to be a string'))
      expect(() => { wb.S([1, 2]) }).toThrow(new Error('expected "1" to be a string'))
    })
    test('Should encode typed symbols', () => {
      const data = {
        symbol: wb.s(obj.symbol),
        symbols: wb.S(obj.symbols)
      }
      const encoded = enc(data)
      expect(encoded).toBeInstanceOf(Buffer)
      const decoded = dec(encoded)
      expect(decoded).toEqual({
        symbol: obj.symbol,
        symbols: obj.symbols
      })
    })
  })

  describe('timestamp', () => {
    test('Should throw when timestamp type is incorrect', () => {
      expect(() => { wb.p(null) }).toThrow(new Error('expected "null" to be a date'))
      expect(() => { wb.p(undefined) }).toThrow(new Error('expected "undefined" to be a date'))
      expect(() => { wb.p('') }).toThrow(new Error('expected "" to be a date'))
      expect(() => { wb.p(1) }).toThrow(new Error('expected "1" to be a date'))
      expect(() => { wb.P([1, 2]) }).toThrow(new Error('expected "1" to be a date'))
    })
    test('Should encode typed timestamps', () => {
      const data = {
        timestamp: wb.p(obj.timestamp),
        timestamps: wb.P(obj.timestamps)
      }
      const encoded = enc(data)
      expect(encoded).toBeInstanceOf(Buffer)
      const decoded = dec(encoded)

      testTime(decoded.timestamp, obj.timestamp)

      decoded.timestamps.forEach((t, i) => {
        testTime(t, obj.timestamps[i])
      })
    })
  })

  describe('month', () => {
    test('Should throw when month type is incorrect', () => {
      expect(() => { wb.m(null) }).toThrow(new Error('expected "null" to be a date'))
      expect(() => { wb.m(undefined) }).toThrow(new Error('expected "undefined" to be a date'))
      expect(() => { wb.m('') }).toThrow(new Error('expected "" to be a date'))
      expect(() => { wb.m(1) }).toThrow(new Error('expected "1" to be a date'))
      expect(() => { wb.M([1, 2]) }).toThrow(new Error('expected "1" to be a date'))
    })
    test('Should encode typed months', () => {
      const data = {
        month: wb.m(obj.month),
        months: wb.M(obj.months)
      }
      const encoded = enc(data)
      expect(encoded).toBeInstanceOf(Buffer)
      const decoded = dec(encoded)

      expect(new Date(decoded.month).getUTCMonth())
        .toEqual(obj.month.getUTCMonth())

      expect(decoded.months.map(d => new Date(d).getUTCMonth()))
        .toEqual(obj.months.map(d => new Date(d).getUTCMonth()))
    })
  })

  describe('date', () => {
    test('Should throw when date type is incorrect', () => {
      expect(() => { wb.d(null) }).toThrow(new Error('expected "null" to be a date'))
      expect(() => { wb.d(undefined) }).toThrow(new Error('expected "undefined" to be a date'))
      expect(() => { wb.d('') }).toThrow(new Error('expected "" to be a date'))
      expect(() => { wb.d(1) }).toThrow(new Error('expected "1" to be a date'))
      expect(() => { wb.D([1, 2]) }).toThrow(new Error('expected "1" to be a date'))
    })
    test('Should encode typed dates', () => {
      const data = {
        date: wb.d(obj.date),
        dates: wb.D(obj.dates)
      }
      const encoded = enc(data)
      expect(encoded).toBeInstanceOf(Buffer)
      const decoded = dec(encoded)

      expect(new Date(decoded.date).getUTCDate())
        .toEqual(obj.date.getUTCDate())

      expect(decoded.dates.map(d => new Date(d).getUTCDate()))
        .toEqual(obj.dates.map(d => new Date(d).getUTCDate()))
    })
  })

  describe('datetime', () => {
    test('Should throw when datetime type is incorrect', () => {
      expect(() => { wb.z(null) }).toThrow(new Error('expected "null" to be a date'))
      expect(() => { wb.z(undefined) }).toThrow(new Error('expected "undefined" to be a date'))
      expect(() => { wb.z('') }).toThrow(new Error('expected "" to be a date'))
      expect(() => { wb.z(1) }).toThrow(new Error('expected "1" to be a date'))
      expect(() => { wb.Z([1, 2]) }).toThrow(new Error('expected "1" to be a date'))
    })
    test('Should encode typed datetimes', () => {
      const data = {
        datetime: wb.z(obj.datetime),
        datetimes: wb.Z(obj.datetimes)
      }
      const encoded = enc(data)
      expect(encoded).toBeInstanceOf(Buffer)
      const decoded = dec(encoded)

      testTime(decoded.datetime, obj.datetime)
      decoded.datetimes.forEach((t, i) => {
        testTime(t, obj.datetimes[i])
      })
    })
  })

  describe('timespan', () => {
    test('Should throw when timespan type is incorrect', () => {
      expect(() => { wb.n(null) }).toThrow(new Error('expected "null" to be a date'))
      expect(() => { wb.n(undefined) }).toThrow(new Error('expected "undefined" to be a date'))
      expect(() => { wb.n('') }).toThrow(new Error('expected "" to be a date'))
      expect(() => { wb.n(1) }).toThrow(new Error('expected "1" to be a date'))
      expect(() => { wb.N([1, 2]) }).toThrow(new Error('expected "1" to be a date'))
    })
    test('Should encode typed timespans', () => {
      const data = {
        timespan: wb.n(obj.timespan),
        timespans: wb.N(obj.timespans)
      }
      const encoded = enc(data)
      expect(encoded).toBeInstanceOf(Buffer)
      const decoded = dec(encoded)

      testTime(decoded.timespan, obj.timespan)
      decoded.timespans.forEach((t, i) => {
        testTime(t, obj.timespans[i])
      })
    })
  })

  describe('minute', () => {
    test('Should throw when minute type is incorrect', () => {
      expect(() => { wb.u(null) }).toThrow(new Error('expected "null" to be a date'))
      expect(() => { wb.u(undefined) }).toThrow(new Error('expected "undefined" to be a date'))
      expect(() => { wb.u('') }).toThrow(new Error('expected "" to be a date'))
      expect(() => { wb.u(1) }).toThrow(new Error('expected "1" to be a date'))
      expect(() => { wb.U([1, 2]) }).toThrow(new Error('expected "1" to be a date'))
    })
    test('Should encode typed minutes', () => {
      const data = {
        minute: wb.u(obj.minute),
        minutes: wb.U(obj.minutes)
      }
      const encoded = enc(data)
      expect(encoded).toBeInstanceOf(Buffer)
      const decoded = dec(encoded)

      expect(new Date(decoded.minute).getUTCMinutes())
        .toBeAround(obj.minute.getUTCMinutes())

      decoded.minutes.forEach((d, i) => {
        expect(new Date(d).getUTCMinutes()).toBeAround(obj.minutes[i].getUTCMinutes())
      })
    })
  })

  describe('second', () => {
    test('Should throw when second type is incorrect', () => {
      expect(() => { wb.v(null) }).toThrow(new Error('expected "null" to be a date'))
      expect(() => { wb.v(undefined) }).toThrow(new Error('expected "undefined" to be a date'))
      expect(() => { wb.v('') }).toThrow(new Error('expected "" to be a date'))
      expect(() => { wb.v(1) }).toThrow(new Error('expected "1" to be a date'))
      expect(() => { wb.V([1, 2]) }).toThrow(new Error('expected "1" to be a date'))
    })
    test('Should encode typed seconds', () => {
      const data = {
        second: wb.v(obj.second),
        seconds: wb.V(obj.seconds)
      }
      const encoded = enc(data)
      expect(encoded).toBeInstanceOf(Buffer)
      const decoded = dec(encoded)

      expect(new Date(decoded.second).getUTCSeconds())
        .toBeAround(obj.second.getUTCSeconds())

      decoded.seconds.forEach((d, i) => {
        expect(new Date(d).getUTCSeconds()).toBeAround(obj.seconds[i].getUTCSeconds())
      })
    })
  })

  describe('time', () => {
    test('Should throw when time type is incorrect', () => {
      expect(() => { wb.t(null) }).toThrow(new Error('expected "null" to be a date'))
      expect(() => { wb.t(undefined) }).toThrow(new Error('expected "undefined" to be a date'))
      expect(() => { wb.t('') }).toThrow(new Error('expected "" to be a date'))
      expect(() => { wb.t(1) }).toThrow(new Error('expected "1" to be a date'))
      expect(() => { wb.T([1, 2]) }).toThrow(new Error('expected "1" to be a date'))
    })
    test('Should encode typed times', () => {
      const data = {
        time: wb.t(obj.time),
        times: wb.T(obj.times)
      }
      const encoded = enc(data)
      expect(encoded).toBeInstanceOf(Buffer)
      const decoded = dec(encoded)

      testTime(decoded.time, obj.time)
      decoded.times.forEach((t, i) => {
        testTime(t, obj.times[i])
      })
    })
  })

  describe('dict', () => {
    test('Should throw when dict type is incorrect', () => {
      expect(() => { wb.dict(null) }).toThrow(new Error('expected "null" to be an object'))
      expect(() => { wb.dict(undefined) }).toThrow(new Error('expected "undefined" to be an object'))
      expect(() => { wb.dict('') }).toThrow(new Error('expected "" to be an object'))
      expect(() => { wb.dict(1) }).toThrow(new Error('expected "1" to be an object'))
      expect(() => { wb.dict({}) }).toThrow(new Error('object must not be empty'))
    })
    test('Should encode untyped dict', () => {
      const untyped = wb.dict(obj)
      const encoded = enc(untyped)
      expect(encoded).toBeInstanceOf(Buffer)
      const decoded = dec(encoded)
      Object.keys(decoded).forEach(k => {
        testDecodedUntyped(k, decoded[k], obj[k])
      })
    })
    test('Should encode typed dict', () => {
      const typed = wb.dict(objTyped)
      const encoded = enc(typed)
      expect(encoded).toBeInstanceOf(Buffer)
      const decoded = dec(encoded)
      expect(decoded).toBeInstanceOf(Object)
      Object.keys(decoded).forEach(k => {
        testDecodedTyped(k, decoded[k], obj[k])
      })
    })
  })

  describe('list', () => {
    test('Should throw when list type is incorrect', () => {
      expect(() => { wb.list(null) }).toThrow(new Error('expected "null" to be an array'))
      expect(() => { wb.list(undefined) }).toThrow(new Error('expected "undefined" to be an array'))
      expect(() => { wb.list('') }).toThrow(new Error('expected "" to be an array'))
      expect(() => { wb.list(1) }).toThrow(new Error('expected "1" to be an array'))
      expect(() => { wb.list({}) }).toThrow(new Error('expected "[object Object]" to be an array'))
      expect(() => { wb.list([]) }).toThrow(new Error('array must not be empty'))
    })
    test('Should encode untyped list', () => {
      const untyped = wb.list(Object.values(obj))
      const encoded = enc(untyped)
      expect(encoded).toBeInstanceOf(Buffer)
      const decoded = dec(encoded)
      expect(Array.isArray(decoded)).toEqual(true)
      decoded.forEach((value, i) => {
        const key = Object.keys(obj)[i]
        const assert = Object.values(obj)[i]
        testDecodedUntyped(key, value, assert)
      })
    })
    test('Should encode typed list', () => {
      const typed = wb.list(Object.values(objTyped))
      const encoded = enc(typed)
      expect(encoded).toBeInstanceOf(Buffer)
      const decoded = dec(encoded)
      expect(Array.isArray(decoded)).toEqual(true)
      decoded.forEach((value, i) => {
        const key = Object.keys(obj)[i]
        const assert = Object.values(obj)[i]
        testDecodedTyped(key, value, assert)
      })
    })
  })
})

export const testDecodedUntyped = (k, v, a) => {
  switch (k) {
    case 'symbol':
      expect(v).toEqual(a.replace('`', ''))
      break
    case 'symbols':
      expect(v).toEqual(a.map(b => b.replace('`', '')))
      break
    case 'month':
      expect(new Date(v).getUTCMonth()).toBeAround(a.getUTCMonth())
      break
    case 'months':
      v.forEach((d, i) => {
        expect(new Date(d).getUTCMonth()).toBeAround(a[i].getUTCMonth())
      })
      break
    case 'date':
      expect(new Date(v).getUTCDate()).toBeAround(a.getUTCDate())
      break
    case 'dates':
      v.forEach((d, i) => {
        expect(new Date(d).getUTCDate()).toBeAround(a[i].getUTCDate())
      })
      break
    case 'timespan':
      testTime(v, a)
      break
    case 'timespans':
      v.forEach((t, i) => { testTime(t, a[i]) })
      break
    case 'minute':
      expect(new Date(v).getUTCMinutes()).toBeAround(a.getUTCMinutes())
      break
    case 'minutes':
      v.forEach((d, i) => {
        expect(new Date(d).getUTCMinutes()).toBeAround(a[i].getUTCMinutes())
      })
      break
    case 'second':
      expect(new Date(v).getUTCSeconds())
        .toBeAround(a.getUTCSeconds())
      break
    case 'seconds':
      v.forEach((d, i) => {
        expect(new Date(d).getUTCSeconds()).toBeAround(a[i].getUTCSeconds())
      })
      break
    case 'time':
    case 'timestamp':
    case 'datetime':
      testTime(v, a)
      break
    case 'times':
    case 'timestamps':
    case 'datetimes':
      v.forEach((t, i) => {
        testTime(t, a[i])
      })
      break
    default:
      if (Array.isArray(v)) {
        v.forEach((w, i) => {
          expect(w).toEqual(a[i])
        })
      } else {
        expect(v).toEqual(a)
      }
  }
}

export const testDecodedTyped = (k, v, a) => {
  switch (k) {
    case 'long':
      expect(Long.isLong(v)).toEqual(true)
      break
    case 'longs':
      expect(v.map(d => Long.isLong(d))).toEqual(a.map(() => true))
      break
    case 'chars':
      expect(v).toEqual(a.join(''))
      break
    case 'month':
      expect(new Date(v).getUTCMonth()).toBeAround(a.getUTCMonth())
      break
    case 'months':
      v.forEach((d, i) => {
        expect(new Date(d).getUTCMonth()).toBeAround(a[i].getUTCMonth())
      })
      break
    case 'date':
      expect(new Date(v).getUTCDate()).toBeAround(a.getUTCDate())
      break
    case 'dates':
      v.forEach((d, i) => {
        expect(new Date(d).getUTCDate()).toBeAround(a[i].getUTCDate())
      })
      break
    case 'timespan':
      testTime(v, a)
      break
    case 'timespans':
      v.forEach((t, i) => { testTime(t, a[i]) })
      break
    case 'minute':
      expect(new Date(v).getUTCMinutes()).toBeAround(a.getUTCMinutes())
      break
    case 'minutes':
      v.forEach((d, i) => {
        expect(new Date(d).getUTCMinutes()).toBeAround(a[i].getUTCMinutes())
      })
      break
    case 'second':
      expect(new Date(v).getUTCSeconds())
        .toBeAround(a.getUTCSeconds())
      break
    case 'seconds':
      v.forEach((d, i) => {
        expect(new Date(d).getUTCSeconds()).toBeAround(a[i].getUTCSeconds())
      })
      break
    case 'time':
    case 'timestamp':
    case 'datetime':
      testTime(v, a)
      break
    case 'times':
    case 'timestamps':
    case 'datetimes':
      v.forEach((t, i) => {
        testTime(t, a[i])
      })
      break
    default:
      expect(v).toEqual(a)
  }
}
