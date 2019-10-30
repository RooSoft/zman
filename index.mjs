import { readConfig } from './lib/yaml.mjs'
import { getRelatedSnapshots, getExpiredSnapshots, getOverdueSnapshots } from './lib/business/snapshotFilter.mjs'

const zmanConfig = readConfig('./zman.yaml')

const snapshots = getRelatedSnapshots(zmanConfig)

const expiredSnapshots = getExpiredSnapshots(snapshots)
const overdueSnapshots = getOverdueSnapshots(snapshots)

console.dir(snapshots, { depth: null })
console.log('expired snapshots')
console.log('-----------------')
console.dir(expiredSnapshots)
console.log('overdue snapshots')
console.log('-----------------')
console.dir(overdueSnapshots)
