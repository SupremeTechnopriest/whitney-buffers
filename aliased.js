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

export const encode = newExport.encode
export const decode = newExport.decode

export const dict = newExport.dict
export const list = newExport.list

export const boolean = newExport.boolean
export const guid = newExport.guid
export const byte = newExport.byte
export const short = newExport.short
export const int = newExport.int
export const long = newExport.long
export const real = newExport.real
export const float = newExport.float
export const char = newExport.char
export const symbol = newExport.symbol
export const timestamp = newExport.timestamp
export const month = newExport.month
export const date = newExport.date
export const datetime = newExport.datetime
export const timespan = newExport.timespan
export const minute = newExport.minute
export const second = newExport.second
export const time = newExport.time

export const booleans = newExport.booleans
export const guids = newExport.guids
export const bytes = newExport.bytes
export const shorts = newExport.shorts
export const ints = newExport.ints
export const longs = newExport.longs
export const reals = newExport.reals
export const floats = newExport.floats
export const chars = newExport.chars
export const symbols = newExport.symbols
export const timestamps = newExport.timestamps
export const months = newExport.months
export const dates = newExport.dates
export const datetimes = newExport.datetimes
export const timespans = newExport.timespans
export const minutes = newExport.minutes
export const seconds = newExport.seconds
export const times = newExport.times

export default newExport
