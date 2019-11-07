const jsyaml = require('js-yaml')
const { readFileSync } = require('fs')

const { ConfigError } = require('./errors')

const readConfig = configFile => {
  let config

  try {
    const yamlFileContents = readFileSync(configFile, 'utf8')
    config = jsyaml.safeLoad(yamlFileContents)
  } catch (e) {
    if (e.code === 'ENOENT') {
      throw new ConfigError(`Config file not found: ${configFile}`)
    }
  }

  if ((config === null) || (config === undefined)) {
    throw new ConfigError(`${configFile} doesn't contain any pool configuration`)
  }

  if (config.pools === null) {
    throw new ConfigError(`No pool found in ${configFile}`)
  }

  config.pools.forEach(pool => {
    if (pool.frequencies === undefined) {
      pool.frequencies = []
    }
  })

  return config
}

module.exports = { readConfig }
