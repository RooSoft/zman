const { readConfig } = require('../lib/yaml')

test('Should be able to read config file', () => {
  const zmanConfig = readConfig('tests/config/zman.yaml')

  expect(zmanConfig).toHaveProperty('pools')
  expect(zmanConfig.pools).toHaveLength(2)

  const smallpool = zmanConfig.pools[0]

  expect(smallpool.name).toBe('smallpool/zman')
  expect(smallpool.frequencies).toHaveLength(3)

  const largepool = zmanConfig.pools[1]

  expect(largepool.name).toBe('largepool/whatever')
  expect(largepool.frequencies).toHaveLength(3)
})

test('Should fail to load nonexisting config file', () => {
  expect(() => {
    readConfig('tests/config/doNotExist.yaml')
  }).toThrow()
})

test('Should work even with a empty pool list config file' , () => {
  expect(() => {
    readConfig('tests/config/emptyPoolList.yaml')
  }).not.toThrow()
})

test('Should not crash on an empty config file' , () => {
  expect(() => {
    readConfig('tests/config/emptyFile.yaml')
  }).not.toThrow()
})
