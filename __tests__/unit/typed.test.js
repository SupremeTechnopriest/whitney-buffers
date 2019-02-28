/* eslint-env jest */
/* eslint-disable no-unused-expressions */
import { Typed } from '../../src/typed'

describe('[NODE] Typed', () => {
  test('Should provide toString() method', () => {
    const listType = new Typed('typedlist', [1, 2, 3], 'int')
    expect(listType.toString()).toEqual('list[int](1,2,3)')
    const type = new Typed('int', 1)
    expect(type.toString()).toEqual('int(1)')
  })

  test('Should throw when trying to access valuetype on non typedlist', () => {
    const listType = new Typed('typedlist', [1, 2, 3], 'int')
    expect(listType.valuetype).toEqual('int')
    const nonListType = new Typed('int', 1)
    expect(() => { nonListType.valuetype }).toThrow('only available for type typedlist')
  })
})
