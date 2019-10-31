import { getSnapshots } from '../zfs/index.mjs'
import { filterExpiredSnapshotsByDate } from './snapshotExpirationFilter.mjs'


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
        filterExpiredSnapshotsByDate(frequency.type, frequency.quantity, date, poolSnapshots)

        expiredSnapshots = [...expiredSnapshots, ...frequencyExpiredSnapshots]
    })
  })

  return expiredSnapshots
}

const isOverdue = (frequency, lastSnapshotDate, date) => {
  let snapshotDate = new Date(lastSnapshotDate.getTime()) // clone last snapshot date

  const methods = {
    'monthly': () => snapshotDate.setMonth(snapshotDate.getMonth()+1) < date,
    'daily': () => snapshotDate.setDate(snapshotDate.getDate()+1) < date,
    'hourly': () => snapshotDate.setHours(snapshotDate.getHours()+1) < date
  }

  return methods[frequency.type]()
}

export function getOverdueStatuses(date, zmanConfig, snapshots) {
  let overdueStatuses = []

  zmanConfig.pools.forEach(poolConfig => {
    const poolSnapshots = snapshots[poolConfig.name]

    poolConfig.frequencies.forEach(frequency => {
      if(poolSnapshots[frequency.type].length > 0) {
        const latestDate = poolSnapshots[frequency.type].reduce((latestDate, snapshot) => {
          return latestDate > snapshot.date ? latestDate : snapshot.date
        }, new Date(0))

        if(isOverdue(frequency, latestDate, date)) {
          overdueStatuses.push({
            pool: poolConfig.name,
            frequency
          })
        }
      } else {
        overdueStatuses.push({
          pool: poolConfig.name,
          frequency
        })
      }
    })
  })

  return overdueStatuses
}
