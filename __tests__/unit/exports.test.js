/* eslint-env jest */
import { api, types, structs } from '../../_private/aliases'
import wbDefault, { enc, dec, i, I, list, dict } from '../../index'
import wbAliased, { encode, decode, int, ints, list as aList, dict as aDict } from '../../aliased'
import wbAll from '../../all'
import wbBuffer from '../../buffer'

describe('[NODE] exports', () => {
  describe('default', () => {
    describe('types', () => {
      Object.keys(types).forEach(k => {
        test(`Should have ${k} export`, () => {
          expect(wbDefault[k]).toBeDefined()
          expect(wbDefault[types[k]]).toBeUndefined()
        })
        test(`Should have ${k.toUpperCase()} export`, () => {
          expect(wbDefault[k.toUpperCase()]).toBeDefined()
          expect(wbDefault[types[`${k}s`]]).toBeUndefined()
        })
      })
    })

    describe('destructured imports', () => {
      test('should import from default export', () => {
        expect(enc).toBeDefined()
        expect(dec).toBeDefined()
        expect(i).toBeDefined()
        expect(I).toBeDefined()
        expect(list).toBeDefined()
        expect(dict).toBeDefined()
      })
      test('should import from aliased export', () => {
        expect(encode).toBeDefined()
        expect(decode).toBeDefined()
        expect(int).toBeDefined()
        expect(ints).toBeDefined()
        expect(aList).toBeDefined()
        expect(aDict).toBeDefined()
      })
    })

    describe('api', () => {
      Object.keys(api).forEach(k => {
        test(`Should have ${k} export`, () => {
          expect(wbDefault[k]).toBeDefined()
          expect(wbDefault[types[k]]).toBeUndefined()
        })
      })
    })

    describe('structs', () => {
      structs.forEach(k => {
        test(`Should have ${k} export`, () => {
          expect(wbDefault[k]).toBeDefined()
        })
      })
    })
  })

  describe('aliased', () => {
    describe('types', () => {
      Object.keys(types).forEach(k => {
        test(`Should have ${types[k]} export`, () => {
          expect(wbAliased[types[k]]).toBeDefined()
          expect(wbAliased[k]).toBeUndefined()
        })
        test(`Should have ${types[k]}s export`, () => {
          expect(wbAliased[`${types[k]}s`]).toBeDefined()
          expect(wbAliased[k.toUpperCase()]).toBeUndefined()
        })
      })
    })

    describe('api', () => {
      Object.keys(api).forEach(k => {
        test(`Should have ${api[k]} export`, () => {
          expect(wbAliased[api[k]]).toBeDefined()
          expect(wbAliased[k]).toBeUndefined()
        })
      })
    })

    describe('structs', () => {
      structs.forEach(k => {
        test(`Should have ${k} export`, () => {
          expect(wbAliased[k]).toBeDefined()
        })
      })
    })
  })

  describe('all', () => {
    describe('types', () => {
      Object.keys(types).forEach(k => {
        test(`Should have ${types[k]} export`, () => {
          expect(wbAll.aliased[types[k]]).toBeDefined()
          expect(wbAll[k]).toBeDefined()
        })
        test(`Should have ${types[k]}s export`, () => {
          expect(wbAll.aliased[`${types[k]}s`]).toBeDefined()
          expect(wbAll[k.toUpperCase()]).toBeDefined()
        })
      })
    })

    describe('api', () => {
      Object.keys(api).forEach(k => {
        test(`Should have ${api[k]} export`, () => {
          expect(wbAll.aliased[api[k]]).toBeDefined()
          expect(wbAll[k]).toBeDefined()
        })
      })
    })

    describe('structs', () => {
      structs.forEach(k => {
        test(`Should have ${k} export`, () => {
          expect(wbAll.aliased[k]).toBeDefined()
          expect(wbAll[k]).toBeDefined()
        })
      })
    })
  })

  describe('buffer', () => {
    test('Should export the buffer shim', () => {
      expect(wbBuffer).toBeDefined()
    })
  })
})
