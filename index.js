const { readConfig } = require('./lib/yaml')
const snapshotOutput = require('./data/dummySnapshots')
const { parseSnapshots } = require('./lib/zfs/snapshotParser')
const { sortSnapshotsByPool } = require('./lib/business/snapshotSorter')
const { getRelatedSnapshots, getExpiredSnapshots, getOverdueStatuses } = require('./lib/business/snapshotFilter')

const zmanConfig = readConfig('./zman.yaml')

const snapshots = parseSnapshots(snapshotOutput)
const snapshotsByPool = sortSnapshotsByPool(snapshots)

const poolSnapshots = getRelatedSnapshots(zmanConfig, snapshotsByPool)

const now = new Date()

const expiredSnapshots = getExpiredSnapshots(now, zmanConfig, poolSnapshots)
const overdueStatuses = getOverdueStatuses(now, zmanConfig, poolSnapshots)

console.log('expired snapshots')
console.log('-----------------')
console.dir(expiredSnapshots)
console.log('overdue statuses')
console.log('-----------------')
console.dir(overdueStatuses)
