import suite from '../suite'
import enc from '../../src/encode'
import { obj, objTyped } from '../data'

suite
  .add('encode#untyped', function () {
    enc(obj)
  })
  .add('encode#typed', function () {
    enc(objTyped)
  })
  .add('encode#json', function () {
    JSON.stringify(obj)
  })
