import { types, structs } from './_private/aliases'
import enc from './src/encode'
import dec from './src/decode'
import * as typed from './src/typed'

const defaultExport = {
  enc,
  dec,
  aliased: {
    encode: enc,
    decode: dec
  }
}

// Arthur Style
Object.keys(types).forEach(k => {
  defaultExport[k] = typed[k]
  defaultExport[k.toUpperCase()] = typed[k.toUpperCase()]
})

// Aliased
Object.keys(types).forEach(k => {
  defaultExport.aliased[types[k]] = defaultExport[k]
  defaultExport.aliased[`${types[k]}s`] = defaultExport[k.toUpperCase()]
})

// Structures
structs.forEach(k => {
  defaultExport[k] = typed[k]
  defaultExport.aliased[k] = typed[k]
})

export default defaultExport
