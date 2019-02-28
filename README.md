<h1 style="text-align:center">[wb]</h1>
<p style="text-align:center">A self describing binary protocol written in javascript that is based on Arthur Whitney's Q binary protocol.</p>

![npm](https://img.shields.io/npm/v/whitney-buffers.svg)
![npm](https://img.shields.io/npm/dt/whitney-buffers.svg)
![Travis](https://img.shields.io/travis/SupremeTechnopriest/whitney-buffers.svg)
[![Test Coverage](https://api.codeclimate.com/v1/badges/04acbf38f8a40e587026/test_coverage)](https://codeclimate.com/github/SupremeTechnopriest/whitney-buffers/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/04acbf38f8a40e587026/maintainability)](https://codeclimate.com/github/SupremeTechnopriest/whitney-buffers/maintainability)

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)


## Why
- JSON data is wastefully large and shouldn't be sent over the wire without encoding
- Schema driven protocols bloat your javascript code as the amount of data structures increase

## Benefits
- Flexible schema
- Real Longs (64 bit integers) via [Long.js](https://www.npmjs.com/package/long)
- ~7kb (minified and gzipped). Source code will never grow.
- Send data typed for smaller message size or untyped for faster encoding and decoding
- Interoperable with Kdb+ (see http://code.kx.com/q/interfaces/)

## Installation
Whitney Buffers work with node.js and the browser.
Install from npm or grab the latest release.

`npm i --save whitney-buffers` or `yarn add whitney-buffers`

If you use webpack, browserify, rollup or similar, you can include a stripped down version of buffer to save on export size.

```javascript
import 'whitney-buffers/buffer'
import wb from 'whitney-buffers'
```

⚠️ Be aware that this will overwrite the window object for Buffer.  It only contains the methods needed for whitney-buffers to operate.  If you use buffers elsewhere in your application you should omit including this implementation.

⚠️ Also, including the buffer shim will not guarantee that your bundler will omit adding the full Buffer global to your package. Please refer to your module packager's documentation to find the appropriate configuration.

## Usage

This module exposes functions in Q style by default. If you prefer to use the aliased module:

```javascript
import wb from 'whitney-buffers/aliased'
```
On either the default or the aliased module you can use destructured imports as well as their respective default imports:

```javascript
// Default
import wb from 'whitney-buffers'
wb.enc({ works: wb.b(true) })
```
```javascript
// Aliased
import wb from 'whitney-buffers/aliased'
wb.encode({ works: wb.bool(true) })
```
or
```javascript
// Default
import { enc, b } from 'whitney-buffers'
enc({ works: b(true) })
```
```javascript
// Aliased
import { encode, boolean } from 'whitney-buffers/aliased'
encode({ works: boolean(true) })
```

## API

### `enc(Object)` alias: encode
Encodes an `Object` into a `Uint8Array|Buffer`

```javascript
import { enc } from 'whitney-buffers'
const pkt = enc({ hello: 'world' })
// pkt = Uint8Array(38) [...]
```
with alias:
```javascript
import { encode } from 'whitney-buffers/aliased'
const pkt = encode({ hello: 'world' })
// pkt = Uint8Array(38) [...]
```

### `dec(Uint8Array|Buffer)` alias: decode
Decodes a `Uint8Array|Buffer` from an `Object`

```javascript
import { enc, dec } from 'whitney-buffers'
const pkt = enc({ hello: 'world' })
const msg = dec(pkt)
// msg = { hello: 'world' }
```
with alias:
```javascript
import { encode, decode } from 'whitney-buffers/aliased'
const pkt = encode({ hello: 'world' })
const msg = decode(pkt)
// msg = { hello: 'world' }
```

## Types
Types allow you to encode a piece of data as a specific type.  This can save you a lot of bytes in your packets, with the trade off of slightly slower encode and decode times.

To use a define a type you just pass your value to the desired type function:

```javascript
import { enc, b, i, f, j } from 'whitney-buffers'
const pkt = enc({
  bool: b(true),
  int: i(-1),
  float: f(3.14),
  long: j('0xFFFFFFFF', '0x22222222')
})
// pkt = Uint8Array(66) [...]
```
The types are also exposed as aliases:
```javascript
import { encode, boolean, int, float, long } from 'whitney-buffers'
const pkt = enc({
  bool: boolean(true),
  int: int(-1),
  float: float(3.14),
  long: long('0xFFFFFFFF', '0x22222222')
})
// pkt = Uint8Array(66) [...]
```
Types have a scalar representation and a vector representation. Take the `timestamp` for example:

```javascript
import { enc, p, P } from 'whitney-buffers'
const pkt = enc({
  t: p(new Date()),
  ts: P([new Date(), new Date()])
})
// pkt = Uint8Array(73) [...]
```
Vector representations are aliased as well and are expressed as the plural of the type:
```javascript
import { encode, timestamp, timestamps } from 'whitney-buffers'
const pkt = encode({
  t: timestamp(new Date()),
  ts: timestamps([new Date(), new Date()])
})
// pkt = Uint8Array(73) [...]
```

Below is a map of all the types, their vector representations, their size in bytes and their definition.

| Type      | Scalar | Vector | Aliased Scalar | Alaised Vector | Size | Definition                          |
|-----------|--------|--------|----------------|----------------|------|-------------------------------------|
| Boolean   | b      | B      | boolean        | booleans       | 1    | b(bool: `boolean`)                  |
| GUID      | g      | G      | guid           | guids          | 16   | g(guid: `string`)                   |
| Byte      | x      | X      | byte           | bytes          | 1    | x(byte: `number`)                   |
| Short     | h      | H      | short          | shorts         | 2    | h(byte: `number`)                   |
| Integer   | i      | I      | int            | ints           | 4    | i(byte: `number`)                   |
| Long      | j      | J      | long           | longs          | 8    | j([ low: `number`, high: `number`]) |
| Real      | e      | E      | real           | reals          | 4    | e(real: `number`)                   |
| Float     | f      | F      | float          | floats         | 8    | f(float: `number`)                  |
| Character | c      | C      | char           | chars          | 1    | c(char: `number`)                   |
| Symbol    | s      | S      | symbol         | symbols        | ~    | s(symbol: `string`)                 |
| Timestamp | p      | P      | timestamp      | timestamps     | 8    | p(timestamp: `date`)                |
| Month     | m      | M      | month          | months         | 4    | m(month: `date`)                    |
| Date      | d      | D      | date           | dates          | 4    | d(date: `date`)                     |
| Datetime  | z      | Z      | datetime       | datetimes      | 8    | z(datetime: `date`)                 |
| Timespan  | n      | N      | timespan       | timespans      | 8    | n(timespan: `date`)                 |
| Minute    | u      | U      | minute         | minutes        | 4    | u(minute: `date`)                   |
| Second    | v      | V      | second         | seconds        | 4    | v(second: `date`)                   |
| Time      | t      | T      | time           | times          | 4    | t(time: `date`)                     |


## Structures

There are two structures available in both the default and aliased exports. They have the same name in both modules:

### `dict(Object)` Define a typed map
This method is used internally by the encoder on all objects. It is exposed for you to encode your own typed maps explicitly, but is not required.

```javascript
import { enc, dict, b, i, f, j } from 'whitney-buffers'
const pkt = enc(dict({
  bool: b(true),
  int: i(-1),
  float: f(3.14),
  long: j('0xFFFFFFFF', '0x22222222')
}))
// pkt = Uint8Array(66)
```

### `list(Array)`
This method is for describing arrays of mixed types:

```javascript
import { enc, list, b, i, f, j } from 'whitney-buffers'
const pkt = enc(list([
  b(true),
  i(-1),
  f(3.14),
  j('0xFFFFFFFF', '0x22222222')
]))
// pkt = Uint8Array(39)
```

# Tips and Tricks

### Object keys

All your keys are encoded as symbols (which are essentially strings).  You should try to keep your keys short in order to keep your packet size small. One trick that I have been using is to have a shared map of your keys and only pass an int as the key.  Something like this:

```javascript
// A shared class
class Keys {
  constructor(arr = []) {
    this.arr = arr
  }
  get (str) {
    const key = this.arr.indexOf(str)
    if (key === -1) throw new Error('key not found')
    return key
  }
  set (obj) {
    const o = {}
    for (let key in obj) {
      const name = this.arr[key]
      if (name) {
        o[name] = obj[key]
      }
    }
    return o
  }
}

```

```javascript
// ✌️"Schema"✌️ definition shared by encoding side and decoding side
export const signup = [
  'name',
  'email'
]
```

```javascript
// Message creator
import { enc, s } from 'whitney-buffers'
import Keys, { signupSchema } from '@my/shared-schemas'
import send from './somewhere'
const signupKeys = new Keys(signupSchema)
send(enc({
  [signup.get('name')]: s('Archimedes'),
  [signup.get('email')]: s('archimedes@syracuse.gr')
}))
```

```javascript
// Message receiver
import { dec, s } from 'whitney-buffers'
import Keys, { signup } from '@my/shared-schemas'
import receive from './somewhere'
const keys = new Keys(signup)
receive.on('message', event => {
  const msg = keys.set(dec(event))
  // msg = {
  //  name: Archimedes,
  //  email: archimedes@syracuse.gr
  // }
})
```

### Nulls and empty types

The typed API will not allow you to send an empty type. This is by design. If you want to send null or empty types you can encode the empty value without a type.  If are using types to get the smallest possible packet size, your schema design should not require null values. You end up wasting bytes for no reason.  

# Special Thanks

Special thanks to [Michael Wittig](https://cloudonaut.io) for his work on [node-q](https://github.com/michaelwittig/node-q) and [Feross Aboukhadijeh](https://feross.org/) for his work on [buffer](https://github.com/feross/buffer).  
