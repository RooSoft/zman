import jsyaml from 'js-yaml'
import { readFileSync } from 'fs'

export function readConfig(configFile) {
  try {
    const yamlFileContents = readFileSync('./zman.yaml', 'utf8')
    return jsyaml.safeLoad(yamlFileContents)
  } catch (e) {
    throw new Error(`Cannot load ${configFile}`)
  }
}
