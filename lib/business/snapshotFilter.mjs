import { getSnapshots } from '../zfs/index.mjs'
import { filterSnapshotsByDate } from './snapshotExpirationFilter.mjs'


export function getRelatedSnapshots(zmanConfig) {
  let snapshots = {}

  zmanConfig.pools.forEach(poolConfig => {
    const poolSnapshots = snapshots[poolConfig.name] = {}

    poolConfig.frequencies.forEach(frequency => {
      const frequencySnapshots = poolSnapshots[frequency.type] = []
      const snapshot = getSnapshots(poolConfig.name, frequency.type)

      frequencySnapshots.push(...snapshot)
    })
  })

  return snapshots
}

export function getExpiredSnapshots(date, zmanConfig, snapshots) {
  let expiredSnapshots = []

  zmanConfig.pools.forEach(poolConfig => {
    const poolSnapshots = snapshots[poolConfig.name]

    poolConfig.frequencies.forEach(frequency => {
      const frequencyExpiredSnapshots =
        filterSnapshotsByDate(frequency.type, frequency.quantity, date, poolSnapshots)

        expiredSnapshots = [...expiredSnapshots, ...frequencyExpiredSnapshots]
    })
  })

  return expiredSnapshots
}

export function getOverdueSnapshots(zmanConfig, snapshots) {
  return []
}
