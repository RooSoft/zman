const jsyaml = require('js-yaml')
const { readFileSync } = require('fs')

const readConfig = configFile => {
  try {
    const yamlFileContents = readFileSync('./zman.yaml', 'utf8')
    return jsyaml.safeLoad(yamlFileContents)
  } catch (e) {
    throw new Error(`Cannot load ${configFile}`)
  }
}

module.exports = { readConfig }
