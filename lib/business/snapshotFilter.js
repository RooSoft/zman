const { filterExpiredSnapshotsByDate } = require('./snapshotExpirationFilter.js')


const getRelatedSnapshots = (zmanConfig, snapshotsByPool) => {
  let relatedSnapshots = {}

  zmanConfig.pools.forEach(poolConfig => {
    const poolSnapshots = relatedSnapshots[poolConfig.name] = {}

    poolConfig.frequencies.forEach(frequency => {
      if (poolSnapshots.hasOwnProperty(frequency.type)) {
        poolSnapshots[frequency.type] =
          snapshotsByPool[poolConfig.name].filter(snapshot => snapshot.frequency === frequency.type)
      }
    })
  })

  return relatedSnapshots
}

const getExpiredSnapshots = (date, zmanConfig, snapshots) => {
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
    'monthly': () => snapshotDate.setMonth(snapshotDate.getMonth() + 1) < date,
    'daily': () => snapshotDate.setDate(snapshotDate.getDate() + 1) < date,
    'hourly': () => snapshotDate.setHours(snapshotDate.getHours() + 1) < date
  }

  return methods[frequency.type]()
}

const getOverdueStatuses = (date, zmanConfig, snapshots) => {
  let overdueStatuses = []

  zmanConfig.pools.forEach(poolConfig => {
    const poolSnapshots = snapshots[poolConfig.name]

    poolConfig.frequencies.forEach(frequency => {
      if (
        poolSnapshots.hasOwnProperty(frequency.type)
        && poolSnapshots[frequency.type].length > 0
      ) {
        const latestDate = poolSnapshots[frequency.type].reduce((latestDate, snapshot) => {
          return latestDate > snapshot.date ? latestDate : snapshot.date
        }, new Date(0))

        if (isOverdue(frequency, latestDate, date)) {
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

module.exports = { getRelatedSnapshots, getExpiredSnapshots, getOverdueStatuses }
