/* eslint-env jest */
/* eslint-disable no-new */

import '../utils'
import { readFileSync } from 'fs'
import { join } from 'path'
import Long from 'long'
import { types } from '../../_private/aliases'
import wb from '../../index'
import enc from '../../src/encode'
import dec from '../../src/decode'

describe('[NODE] decode()', () => {
  test('Should return dates as nanos', () => {
    const time = new Date()
    const data = {
      timestamp: wb.p(time),
      timespan: wb.n(time)
    }
    const pkt = enc(data)
    const msg = dec(pkt, false)
    expect(parseInt(msg.timestamp.toString().slice(0, 13), 10)).toBeAround(time.getTime())
    const nanos = (((time.getUTCHours() * 60 + time.getUTCMinutes()) * 60 + time.getUTCSeconds()) * 1000 + time.getUTCMilliseconds()) * 1000 * 1000
    expect(msg.timespan.compare(Long.fromNumber(nanos))).toEqual(0)
  })

  Object.values(types).forEach(t => {
    test(`Should decode scalar ${t} from binary`, () => {
      const bin = readFileSync(join(__dirname, '../bin', `s_${t}`))
      const msg = dec(bin)
      testScalarType(t, msg)
    })

    test(`Should decode list ${t} from binary`, () => {
      const bin = readFileSync(join(__dirname, '../bin', `l_${t}`))
      const msg = dec(bin)
      if (t === 'char') {
        expect(msg).toEqual('xx')
      } else {
        expect(Array.isArray(msg)).toEqual(true)
        testListType(t, msg)
      }
    })
  })
})

function testScalarType (k, v, a) {
  switch (k) {
    case 'boolean':
      expect(typeof v).toEqual('boolean')
      expect(v).toEqual(true)
      break
    case 'guid':
      expect(typeof v).toEqual('string')
      expect(v).toEqual('22ca1f77-a1bc-975c-d42f-212d0f1ec446')
      break
    case 'char':
    case 'symbol':
      expect(typeof v).toEqual('string')
      expect(v).toEqual('xxx')
      break
    case 'byte':
    case 'short':
    case 'int':
    case 'real':
    case 'float':
      expect(typeof v).toEqual('number')
      expect(v).toEqual(1)
      break
    case 'long':
      expect(typeof v).toEqual('object')
      expect(v).toEqual({ high: 0, low: 1, unsigned: false })
      break
    case 'timestamp':
      expect(typeof v).toEqual('object')
      expect(v).toEqual(new Date('2049-02-24T22:25:17.321Z'))
      break
    case 'month':
      expect(typeof v).toEqual('object')
      expect(v).toEqual(new Date('2019-02-01T00:00:00.000Z'))
      break
    case 'date':
      expect(typeof v).toEqual('object')
      expect(v).toEqual(new Date('2019-02-25T00:00:00.000Z'))
      break
    case 'datetime':
      expect(typeof v).toEqual('object')
      expect(v).toEqual(new Date('2019-02-25T22:25:17.322Z'))
      break
    case 'timespan':
      expect(typeof v).toEqual('object')
      expect(v).toEqual(new Date('2019-02-25T22:31:42.420Z'))
      break
    case 'minute':
      expect(typeof v).toEqual('object')
      expect(v).toEqual(new Date('2000-01-01T22:25:00.000Z'))
      break
    case 'second':
      expect(typeof v).toEqual('object')
      expect(v).toEqual(new Date('2000-01-01T22:25:17.000Z'))
      break
    case 'time':
      expect(typeof v).toEqual('object')
      expect(v).toEqual(new Date('2000-01-01T22:25:17.321Z'))
      break
    default:
      // NO-OP
  }
}

function testListType (k, v, a) {
  switch (k) {
    case 'boolean':
      expect(typeof v[0]).toEqual('boolean')
      expect(typeof v[1]).toEqual('boolean')
      expect(v[0]).toEqual(true)
      expect(v[1]).toEqual(true)
      break
    case 'guid':
      expect(typeof v[0]).toEqual('string')
      expect(typeof v[1]).toEqual('string')
      expect(v[0]).toEqual('22ca1f77-a1bc-975c-d42f-212d0f1ec446')
      expect(v[1]).toEqual('d38bd95f-316c-ec87-b75b-ddb5e7d05134')
      break
    case 'char':
    case 'symbol':
      expect(typeof v[0]).toEqual('string')
      expect(typeof v[1]).toEqual('string')
      expect(v[0]).toEqual('xxx')
      expect(v[1]).toEqual('xxx')
      break
    case 'byte':
    case 'short':
    case 'int':
    case 'real':
    case 'float':
      expect(typeof v[0]).toEqual('number')
      expect(typeof v[1]).toEqual('number')
      expect(v[0]).toEqual(1)
      expect(v[1]).toEqual(1)
      break
    case 'long':
      expect(typeof v[0]).toEqual('object')
      expect(typeof v[1]).toEqual('object')
      expect(v[0]).toEqual({ high: 0, low: 1, unsigned: false })
      expect(v[1]).toEqual({ high: 0, low: 1, unsigned: false })
      break
    case 'timestamp':
      expect(typeof v[0]).toEqual('object')
      expect(typeof v[1]).toEqual('object')
      expect(v[0]).toEqual(new Date('2049-02-24T22:25:17.321Z'))
      expect(v[1]).toEqual(new Date('2049-02-24T22:25:17.321Z'))
      break
    case 'month':
      expect(typeof v[0]).toEqual('object')
      expect(typeof v[1]).toEqual('object')
      expect(v[0]).toEqual(new Date('2019-02-01T00:00:00.000Z'))
      expect(v[1]).toEqual(new Date('2019-02-01T00:00:00.000Z'))
      break
    case 'date':
      expect(typeof v[0]).toEqual('object')
      expect(typeof v[1]).toEqual('object')
      expect(v[0]).toEqual(new Date('2019-02-25T00:00:00.000Z'))
      expect(v[1]).toEqual(new Date('2019-02-25T00:00:00.000Z'))
      break
    case 'datetime':
      expect(typeof v[0]).toEqual('object')
      expect(typeof v[1]).toEqual('object')
      expect(v[0]).toEqual(new Date('2019-02-25T22:25:17.322Z'))
      expect(v[1]).toEqual(new Date('2019-02-25T22:25:17.322Z'))
      break
    case 'timespan':
      expect(typeof v[0]).toEqual('object')
      expect(typeof v[1]).toEqual('object')
      expect(v[0]).toEqual(new Date('2007-07-10T16:07:14.751Z'))
      expect(v[1]).toEqual(new Date('2009-11-26T12:54:36.307Z'))
      break
    case 'minute':
      expect(typeof v[0]).toEqual('object')
      expect(typeof v[1]).toEqual('object')
      expect(v[0]).toEqual(new Date('2000-01-01T22:25:00.000Z'))
      expect(v[1]).toEqual(new Date('2000-01-01T22:25:00.000Z'))
      break
    case 'second':
      expect(typeof v[0]).toEqual('object')
      expect(typeof v[1]).toEqual('object')
      expect(v[0]).toEqual(new Date('2000-01-01T22:25:17.000Z'))
      expect(v[1]).toEqual(new Date('2000-01-01T22:25:17.000Z'))
      break
    case 'time':
      expect(typeof v[0]).toEqual('object')
      expect(typeof v[1]).toEqual('object')
      expect(v[0]).toEqual(new Date('2000-01-01T22:25:17.321Z'))
      expect(v[1]).toEqual(new Date('2000-01-01T22:25:17.321Z'))
      break
    default:
      // NO-OP
  }
}
