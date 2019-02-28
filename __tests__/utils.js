/* eslint-env jest */
expect.extend({
  toBeAround (actual, expected, precision = 2) {
    const pass = (actual <= expected + precision && actual >= expected - precision)
    if (pass) {
      return {
        message: () => `expected ${actual} not to be around ${expected}`,
        pass: true
      }
    } else {
      return {
        message: () => `expected ${actual} to be around ${expected}`,
        pass: false
      }
    }
  }
})

export const testTime = (t, a) => {
  expect(new Date(t).getUTCMilliseconds())
    .toBeAround(a.getUTCMilliseconds())
  expect(new Date(t).getUTCSeconds())
    .toBeAround(a.getUTCSeconds())
  expect(new Date(t).getUTCMinutes())
    .toBeAround(a.getUTCMinutes())
  expect(new Date(t).getUTCHours())
    .toBeAround(a.getUTCHours())
}
