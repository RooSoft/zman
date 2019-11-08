const { readConfig } = require('../lib/yaml')
const { ConfigError } = require('../lib/errors')

test('Should be able to read config file', () => {
  const zmanConfig = readConfig('tests/config/zman.yaml')

  expect(zmanConfig).toHaveProperty('pools')
  expect(zmanConfig.pools).toHaveLength(3)

  const smallpool = zmanConfig.pools[0]

  expect(smallpool.name).toBe('smallpool/zman')
  expect(smallpool.frequencies).toHaveLength(3)

  const largepool = zmanConfig.pools[2]

  expect(largepool.name).toBe('largepool/whatever')
  expect(largepool.frequencies).toHaveLength(3)
})

test('Should fail to load nonexisting config file', () => {
  const configFile = 'tests/config/doNotExist.yaml'
console.log('hellloooooooo')
  expect(() => {
    readConfig(configFile)
  }).toThrow(new ConfigError(`Config file not found: ${configFile}`))
})

test('Should fail on empty pool list' , () => {
  const configFile = 'tests/config/emptyPoolList.yaml'

  expect(() => {
    readConfig(configFile)
  }).toThrow(new ConfigError(`No pool found in ${configFile}`))
})

test('Should fail on an empty config file' , () => {
  const configFile = 'tests/config/emptyFile.yaml'

  expect(() => {
    readConfig(configFile)
  }).toThrow(new ConfigError(`${configFile} doesn't contain any pool configuration`))
})
