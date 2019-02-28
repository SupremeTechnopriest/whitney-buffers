import { now } from 'microtime'
import wb from '../../index'
import enc from '../../src/encode'
import dec from '../../src/decode'
// import { obj, objTyped } from '../data'

const obj = {}
const objTyped = {}

for (let i = 0; i < 1000; i++) {
  obj[i] = i
  objTyped[i] = wb.i(i)
}

const utStart = now()
const untyped = enc(obj)
const utTime = now() - utStart
const tStart = now()
const typed = enc(objTyped)
const tTime = now() - tStart
const jStart = now()
const json = JSON.stringify(obj)
const jTime = now() - jStart

console.log()
console.log('Encoded untyped binary:   ', untyped.byteLength, ' bytes in', utTime, 'ns')
console.log('Encoded typed binary:     ', typed.byteLength, ' bytes in', tTime, 'ns')
console.log('Encoded stringified JSON: ', Buffer.byteLength(json), ' bytes in', jTime, 'ns')

const dutStart = now()
dec(untyped)
const dutTime = now() - dutStart
const dtStart = now()
enc(typed)
const dtTime = now() - dtStart
const djStart = now()
JSON.parse(json)
const djTime = now() - djStart

console.log()
console.log('Decoded untyped binary:   ', untyped.byteLength, ' bytes in', dutTime, 'ns')
console.log('Decoded typed binary:     ', typed.byteLength, ' bytes in', dtTime, 'ns')
console.log('Decoded stringified JSON: ', Buffer.byteLength(json), ' bytes in', djTime, 'ns')
