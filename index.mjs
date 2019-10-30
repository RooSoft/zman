import { readConfig } from './lib/yaml.mjs'
import { getSnapshots } from './lib/zfs/index.mjs'

const zmanConfig = readConfig('./zman.yaml')
let snapshots = {}

zmanConfig.pools.forEach(poolConfig => {
  const poolSnapshots = snapshots[poolConfig.name] = {}

  poolConfig.frequencies.forEach(frequency => {
    const frequencySnapshots = poolSnapshots[frequency.type] = []
    const snapshot = getSnapshots(poolConfig.name, frequency.type)

    frequencySnapshots.push(snapshot)
  })
})

console.dir(snapshots, { depth: null })
