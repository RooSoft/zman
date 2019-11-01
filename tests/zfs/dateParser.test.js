const { parse } = require('../../lib/zfs/dateParser')

const DATE_STRING = '2019 Oct 29 14:14'

test('Should convert string to date', () => {
  const date = parse(DATE_STRING)

  expect(date.getDate()).toBe(29)
})
