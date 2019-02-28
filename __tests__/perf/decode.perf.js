import suite from '../suite'
import enc from '../../src/encode'
import dec from '../../src/decode'
import { obj, objTyped } from '../data'

const untyped = enc(obj)
const typed = enc(objTyped)
const json = JSON.stringify(obj)

suite
  .add('decode#untyped', function () {
    dec(untyped)
  })
  .add('decode#typed', function () {
    dec(typed)
  })
  .add('decode#json', function () {
    JSON.parse(json)
  })
