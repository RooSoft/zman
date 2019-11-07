const jsyaml = require('js-yaml')
const { readFileSync } = require('fs')

const readConfig = configFile => {
  try {
    const yamlFileContents = readFileSync(configFile, 'utf8')
    const config = jsyaml.safeLoad(yamlFileContents)

    if (config.pools === null) {
      config.pools = []
    }

    config.pools.forEach(pool => {
      if (pool.frequencies === undefined) {
        pool.frequencies = []
      }
    })

    return config
  } catch (e) {
    console.dir(e)
    throw new Error(`Cannot load ${configFile}`)
  }
}

module.exports = { readConfig }
