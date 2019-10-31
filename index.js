const { readConfig } = require('./lib/yaml.js')
const { getRelatedSnapshots, getExpiredSnapshots, getOverdueStatuses } = require('./lib/business/snapshotFilter.js')

const zmanConfig = readConfig('./zman.yaml')

const poolSnapshots = getRelatedSnapshots(zmanConfig)

const now = new Date()

const expiredSnapshots = getExpiredSnapshots(now, zmanConfig, poolSnapshots)
const overdueStatuses = getOverdueStatuses(now, zmanConfig, poolSnapshots)

console.log('expired snapshots')
console.log('-----------------')
console.dir(expiredSnapshots)
console.log('overdue statuses')
console.log('-----------------')
console.dir(overdueStatuses)
