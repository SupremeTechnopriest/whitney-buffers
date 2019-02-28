import { api, types, structs } from './_private/aliases'
import defaultExport from './_default'

const newExport = {}
Object.keys(defaultExport).forEach(k => {
  if (api[k]) {
    newExport[api[k]] = defaultExport[k]
  }
  if (types[k]) {
    newExport[types[k]] = defaultExport[k]
    newExport[`${types[k]}s`] = defaultExport[k.toUpperCase()]
  }
  if (structs.indexOf(k) > -1) {
    newExport[k] = defaultExport[k]
  }
})

export default newExport
