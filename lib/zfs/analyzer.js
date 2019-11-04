const { readConfig } = require('../yaml')

const { getSnapshots } = require('../zfs/runner')
const { parseSnapshots } = require('../zfs/snapshotParser')
const { addExpirationDate } = require('../business/snapshotExpirationDateManager')
const { sortSnapshotsByPool } = require('../business/snapshotSorter')

const {
  getRelatedSnapshots,
  getActiveSnapshots,
  getExpiredSnapshots,
  getOverdueStatuses
} = require('../business/snapshotFilter')

const zmanConfig = readConfig('./zman.yaml')

const analyzeZfsPool = () => {
  const now = new Date()

  const snapshotOutput = getSnapshots()

  const snapshots = parseSnapshots(snapshotOutput)
  const snapshotsByPool = sortSnapshotsByPool(snapshots)

  const poolSnapshots = getRelatedSnapshots(zmanConfig, snapshotsByPool)
  addExpirationDate(zmanConfig, poolSnapshots)

  const activeSnapshots = getActiveSnapshots(now, zmanConfig, poolSnapshots)
  const expiredSnapshots = getExpiredSnapshots(now, zmanConfig, poolSnapshots)
  const overdueStatuses = getOverdueStatuses(now, zmanConfig, poolSnapshots)

  return { activeSnapshots, expiredSnapshots, overdueStatuses }
}

module.exports = { analyzeZfsPool }
