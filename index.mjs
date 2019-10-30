import { readConfig } from './lib/yaml.mjs'

const pools = readConfig('./zman.yaml')

console.dir(pools, {depth: null})
