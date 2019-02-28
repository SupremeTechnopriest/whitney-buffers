import { types, structs } from './_private/aliases'
import enc from './src/encode'
import dec from './src/decode'
import * as typed from './src/typed'

const defaultExport = { enc, dec }

// Populate types
Object.keys(types).forEach(k => {
  defaultExport[k] = typed[k]
  defaultExport[k.toUpperCase()] = typed[k.toUpperCase()]
})

// Populate structures
structs.forEach(k => {
  defaultExport[k] = typed[k]
})

export default defaultExport
