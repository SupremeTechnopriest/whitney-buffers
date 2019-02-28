import wb from '../aliased'

export const obj = {
  boolean: false,
  booleans: [false, true],
  guid: '4fd620c0-ac4d-49f9-9ef8-19c5233aaf4d',
  guids: [
    '768fdeae-d244-413f-ab45-abbab6635813',
    '4fd620c0-ac4d-49f9-9ef8-19c5233aaf4d'
  ],
  byte: 1,
  bytes: [1, 2],
  short: 10,
  shorts: [10, 11],
  int: 2147483646,
  ints: [1, 2147483646],
  long: ['0xFFFFFFFF', '0x22222222'],
  longs: [['0xFFFFFFFF', '0x22222222'], ['0xFFFFFFFF', '0x22222222']],
  real: 21474.8359375,
  reals: [1, -21474.8359375],
  float: 0.12345,
  floats: [1.12345, 0.12345],
  char: 'a',
  chars: ['a', 'A'],
  symbol: '`sym',
  symbols: ['`test', '`sym'],
  timestamp: new Date(),
  timestamps: [new Date(), new Date()],
  month: new Date(),
  months: [new Date(), new Date()],
  date: new Date(),
  dates: [new Date(), new Date()],
  datetime: new Date(),
  datetimes: [new Date(), new Date()],
  timespan: new Date(),
  timespans: [new Date(), new Date()],
  minute: new Date(),
  minutes: [new Date(), new Date()],
  second: new Date(),
  seconds: [new Date(), new Date()],
  time: new Date(),
  times: [new Date(), new Date()]
}

export const objTyped = {}
Object.keys(obj).forEach(k => {
  if (k === 'long') {
    objTyped[k] = wb[k](...obj[k])
  } else {
    objTyped[k] = wb[k](obj[k])
  }
})

export const validUntypedNulls = {
  emptyString: '',
  emptyArray: [],
  emptyObject: {},
  zero: 0,
  negative: -1,
  null: null,
  false: false
}
export const invalidUntypedNulls = {
  undefined: undefined
}
