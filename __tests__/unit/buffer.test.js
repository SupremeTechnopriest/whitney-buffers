/* eslint-env jest */

import Buffer from '../../buffer'

describe('[NODE] buffer', () => {
  describe('Buffer.from()', () => {
    test('Should throw error when passed non Uint8Array', () => {
      expect(() => { Buffer.from('string') })
        .toThrow('Buffer.from() requires a Uint8Array')
    })
    test('Should create a buffer from a Uint8Array', () => {
      const b = Buffer.from(new Uint8Array(1))
      expect(b).toBeInstanceOf(Buffer)
      expect(b.byteLength).toEqual(1)
    })
  })

  describe('Buffer.alloc()', () => {
    test('Should create a buffer with default size', () => {
      const b = Buffer.alloc()
      expect(b).toBeInstanceOf(Buffer)
      expect(b.byteLength).toEqual(0)
    })

    test('Should create a buffer with supplied size', () => {
      const b = Buffer.alloc(3)
      expect(b).toBeInstanceOf(Buffer)
      expect(b.byteLength).toEqual(3)
    })
  })

  describe('Buffer.byteLength()', () => {
    test('Should return the byteLength of the supplied string', () => {
      expect(Buffer.byteLength('hello')).toEqual(5)
    })

    test('Should cast other types to a string', () => {
      expect(Buffer.byteLength(1)).toEqual(1)
    })
  })

  describe('buffer.toString()', () => {
    test('Should return an empty string for empty buffer', () => {
      const b = Buffer.alloc()
      expect(b.toString()).toEqual('')
    })

    test('Should return 1 byte utf8 encoded string', () => {
      const b = Buffer.alloc(5)
      b.write('hello', 0)
      expect(b.toString()).toEqual('hello')
    })

    test('Should return a 3 byte utf8 character', () => {
      const str = 'œ'
      const b = Buffer.alloc(Buffer.byteLength(str))
      b.write(str, 0)
      expect(b.toString()).toEqual(str)
    })

    test('Should return a 3 byte utf8 character', () => {
      const str = '嗨'
      const b = Buffer.alloc(Buffer.byteLength(str))
      b.write(str, 0)
      expect(b.toString()).toEqual(str)
    })

    test('Should return a 4 byte utf8 character', () => {
      const str = '𠜎'
      const b = Buffer.alloc(Buffer.byteLength(str))
      b.write(str, 0)
      expect(b.toString()).toEqual(str)
    })

    test('Should decoded in chunks', () => {
      let str = ''
      for (let i = 0; i < 0x1000 + 1; i++) {
        str += String.fromCharCode(0x30A0 + Math.random() * (0x30FF - 0x30A0 + 1))
      }
      const b = Buffer.alloc(Buffer.byteLength(str))
      b.write(str, 0)
      expect(b.toString()).toEqual(str)
    })
  })

  describe('buffer.indexOf()', () => {
    test('Should return the index of value', () => {
      const b = Buffer.alloc(6)
      const eb = Buffer.alloc(0)
      b.write('abcdef')
      expect(b.indexOf('')).toEqual(-1)
      expect(b.indexOf('', 1)).toEqual(-1)
      expect(b.indexOf('', b.length + 1)).toEqual(-1)
      expect(b.indexOf('', Infinity)).toEqual(-1)

      expect(b.indexOf('a')).toEqual(0)
      expect(b.indexOf('a', 1)).toEqual(1)
      expect(b.indexOf('a', -7)).toEqual(-1)
      expect(b.indexOf('a', -4)).toEqual(2)
      expect(b.indexOf('a', b.length)).toEqual(5)
      expect(b.indexOf('a', -b.length)).toEqual(0)
      expect(b.indexOf('a', NaN)).toEqual(5)

      expect(eb.indexOf('a')).toEqual(-1)
      expect(eb.indexOf('a', 1)).toEqual(-1)
      expect(eb.indexOf('a', b.length + 1)).toEqual(-1)
      expect(eb.indexOf('a', Infinity)).toEqual(-1)
    })
  })

  describe('buffer.slice()', () => {
    test('Modifying buffer created by .slice() modifies original memory', () => {
      const b1 = Buffer.alloc(26)
      for (let i = 0; i < 26; i++) {
        b1[i] = i + 97 // 97 is ASCII a
      }

      const b2 = b1.slice(0, 3)
      expect(b2.toString()).toEqual('abc')

      b2[0] = '!'.charCodeAt(0)
      expect(b1.toString().slice(0, 3)).toEqual('!bc')
    })

    test('Modifying parent buffer modifies .slice() buffer memory', () => {
      const b1 = Buffer.alloc(26)
      for (let i = 0; i < 26; i++) {
        b1[i] = i + 97 // 97 is ASCII a
      }

      const b2 = b1.slice(0, 3)
      expect(b2.toString()).toEqual('abc')

      b1[0] = '!'.charCodeAt(0)
      expect(b2.toString()).toEqual('!bc')
    })

    test('Should recover from bad offsets', () => {
      const b = Buffer.alloc(26)
      for (let i = 0; i < 26; i++) {
        b[i] = i + 97 // 97 is ASCII a
      }
      const b2 = b.slice(-27, 3)
      const b3 = b.slice(27, 3)
      const b4 = b.slice(0, -1)
      const b5 = b.slice(0, 27)

      expect(b2.toString()).toEqual('abc')
      expect(b3.toString()).toEqual('')
      expect(b4.toString().slice(0, 3)).toEqual('abc')
      expect(b5.toString().slice(0, 3)).toEqual('abc')
    })
  })

  describe('buffer.write()', () => {
    test('Should throw on overflowed buffer', () => {
      const b = Buffer.alloc(0)
      expect(() => { b.write('hello', 1) }).toThrow()
    })
  })

  describe('buffer[read/write]UInt8()', () => {
    test('buffer.writeInt* string should get parsed as number', () => {
      const b = Buffer.alloc(64)
      b.writeInt16LE('1003', 0)
      expect(b.readInt16LE(0)).toEqual(1003)
    })

    test('buffer.writeUInt8 a fractional number will get Math.floored', () => {
      const b = Buffer.alloc(1)
      b.writeInt8(5.5, 0)
      expect(b[0]).toEqual(5)
    })

    test('Should throw when write value is out of bounds', () => {
      const b = Buffer.alloc(1)
      expect(() => { b.writeUInt8(100000) }).toThrow('"value" argument is out of bounds')
    })

    test('Should throw when write offset is out of range', () => {
      const b = Buffer.alloc(1)
      expect(() => { b.writeUInt8(1, 2) }).toThrow('Index out of range')
    })

    test('Should throw when read offset is not a uint', () => {
      const b = Buffer.alloc(1)
      expect(() => { b.readUInt8(-1) }).toThrow('offset is not uint')
    })

    test('Should throw when read offset is out of range', () => {
      const b = Buffer.alloc(1)
      expect(() => { b.readUInt8(2) }).toThrow('Trying to access beyond buffer length')
    })

    test('Should write/read with no offset', () => {
      const b = Buffer.alloc(1)
      b.writeUInt8(1)
      expect(b.readUInt8(0)).toEqual(1)
    })

    test('Should write/read with offset', () => {
      const b = Buffer.alloc(2)
      b.writeUInt8(1, 1)
      expect(b.readUInt8(1)).toEqual(1)
    })
  })

  describe('buffer.{read/write}Int{8,16,32}[LE]', () => {
    const x = 'Int'
    const ys = [8, 16, 32]
    const val = -3
    for (let i = 0; i < ys.length; i++) {
      const y = ys[i]
      const z = y === 8 ? '' : 'LE'
      const b = Buffer.alloc(y / 8)
      const writefn = 'write' + x + y + z
      const readfn = 'read' + x + y + z
      test(`${writefn}()/${readfn}()`, () => {
        expect(() => { b[writefn](val, 0) }).not.toThrow()
        expect(b[readfn](0)).toEqual(val)
      })
    }
  })

  describe('buffer.{read/write}Int{8,16,32}[LE] overflow', () => {
    const x = 'Int'
    const ys = [8, 16, 32]
    const val = -3
    for (let i = 0; i < ys.length; i++) {
      const y = ys[i]
      const z = y === 8 ? '' : 'LE'
      const b = Buffer.alloc((y / 8) - 1)
      const next = Buffer.alloc(4)
      next.writeInt32LE(0, 0)

      const writefn = 'write' + x + y + z
      const readfn = 'read' + x + y + z
      test(`${writefn}()/${readfn}()`, () => {
        expect(() => { b[writefn](val, 0) }).toThrow()
        // check that nothing leaked to next buffer.
        expect(next.readInt32LE(0)).toEqual(0)
        // check that no bytes are read from next buffer.
        next.writeInt32LE(~0, 0)
        expect(() => { b[readfn](0, true) }).toThrow()
      })
    }
  })

  describe('buffer.{read/write}{Float/Double}LE', () => {
    test('write/read valid float', () => {
      var b = Buffer.alloc(4)
      const val = 3.1415926
      expect(b.writeFloatLE(val, 0)).toEqual(4)
      expect(b.readFloatLE(0)).toBeCloseTo(val, 6)
    })

    test('write/read Infinity as a float', () => {
      var b = Buffer.alloc(4)
      expect(b.writeFloatLE(Infinity, 0)).toEqual(4)
      expect(b.readFloatLE(0)).toEqual(Infinity)
    })

    test('write/read -Infinity as a float', () => {
      var b = Buffer.alloc(4)
      expect(b.writeFloatLE(-Infinity, 0)).toEqual(4)
      expect(b.readFloatLE(0)).toEqual(-Infinity)
    })

    test('write/read valid double', () => {
      var b = Buffer.alloc(8)
      const val = 3.1415926535897932
      expect(b.writeDoubleLE(val, 0)).toEqual(8)
      expect(b.readDoubleLE(0)).toBeCloseTo(val, 16)
    })

    test('write/read Infinity as a double', () => {
      var b = Buffer.alloc(8)
      expect(b.writeDoubleLE(Infinity, 0)).toEqual(8)
      expect(b.readDoubleLE(0)).toEqual(Infinity)
    })

    test('write/read -Infinity as a double', () => {
      var b = Buffer.alloc(8)
      expect(b.writeDoubleLE(-Infinity, 0)).toEqual(8)
      expect(b.readDoubleLE(0)).toEqual(-Infinity)
    })

    test('write/read float greater than max', () => {
      var b = Buffer.alloc(4)
      expect(b.writeFloatLE(4e38, 0)).toEqual(4)
      expect(b.readFloatLE(0)).toEqual(Infinity)
    })

    test('write/read float less than min', () => {
      var b = Buffer.alloc(4)
      expect(b.writeFloatLE(-4e40, 0)).toEqual(4)
      expect(b.readFloatLE(0)).toEqual(-Infinity)
    })
  })
})
