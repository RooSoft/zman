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

const analyzeZfsPool = ({ configFilePath, poolName, frequency }) => {
  const now = new Date()

  const zmanConfig = readConfig(configFilePath)

  const snapshotOutput = getSnapshots(zmanConfig.zfs)

  const snapshots = parseSnapshots({ frequency, poolName, output: snapshotOutput})
  const snapshotsByPool = sortSnapshotsByPool(snapshots)

  const poolSnapshots = getRelatedSnapshots({ zmanConfig, poolName, snapshotsByPool })
  addExpirationDate(zmanConfig, poolSnapshots)

  const activeSnapshots = getActiveSnapshots(now, zmanConfig, poolSnapshots)
  const expiredSnapshots = getExpiredSnapshots(now, zmanConfig, poolSnapshots)
  const overdueStatuses = getOverdueStatuses({now, zmanConfig, poolName, frequency, snapshots: poolSnapshots})

  return { activeSnapshots, expiredSnapshots, overdueStatuses }
}

module.exports = { analyzeZfsPool }
