import { readConfig } from './lib/yaml.mjs'
import { getRelatedSnapshots, getExpiredSnapshots, getOverdueSnapshots } from './lib/business/snapshotFilter.mjs'

const zmanConfig = readConfig('./zman.yaml')

const poolSnapshots = getRelatedSnapshots(zmanConfig)

const now = new Date()

const expiredSnapshots = getExpiredSnapshots(now, zmanConfig, poolSnapshots)
const overdueSnapshots = getOverdueSnapshots(now, zmanConfig, poolSnapshots)

console.log('expired snapshots')
console.log('-----------------')
console.dir(expiredSnapshots)
console.log('overdue snapshots')
console.log('-----------------')
console.dir(overdueSnapshots)
