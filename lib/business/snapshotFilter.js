const { snapshotValidityTestingMethods } = require('../constants')

const {
  filterActiveSnapshotsByDate,
  filterExpiredSnapshotsByDate
} = require('./snapshotExpirationFilter.js')


const getRelatedSnapshots = (zmanConfig, snapshotsByPool) => {
  let relatedSnapshots = {}

  zmanConfig.pools.forEach(poolConfig => {
    const poolSnapshots = relatedSnapshots[poolConfig.name] = {}

    if ((poolConfig.frequencies.length > 0)
      && (snapshotsByPool.hasOwnProperty(poolConfig.name))) {
      poolConfig.frequencies.forEach(frequency => {
        poolSnapshots[frequency.type] =
          snapshotsByPool[poolConfig.name].filter(snapshot => snapshot.frequency === frequency.type)
      })
    }
  })

  return relatedSnapshots
}

const getActiveSnapshots = (date, zmanConfig, snapshots) => {
  let activeSnapshots = []

  zmanConfig.pools.forEach(poolConfig => {
    const poolSnapshots = snapshots[poolConfig.name]

    poolConfig.frequencies.forEach(frequency => {
      const frequencyActiveSnapshots =
        filterActiveSnapshotsByDate(frequency.type, date, poolSnapshots)

      activeSnapshots = [...activeSnapshots, ...frequencyActiveSnapshots]
    })
  })

  return activeSnapshots
}

const getExpiredSnapshots = (date, zmanConfig, snapshots) => {
  let expiredSnapshots = []

  zmanConfig.pools.forEach(poolConfig => {
    const poolSnapshots = snapshots[poolConfig.name]

    poolConfig.frequencies.forEach(frequency => {
      const frequencyExpiredSnapshots =
        filterExpiredSnapshotsByDate(frequency.type, date, poolSnapshots)

      expiredSnapshots = [...expiredSnapshots, ...frequencyExpiredSnapshots]
    })
  })

  return expiredSnapshots
}

const isOverdue = (frequency, latestSnapshotDate, currentDate) => {
  let snapshotDate = new Date(latestSnapshotDate.getTime()) // clone last snapshot date

  return snapshotValidityTestingMethods[frequency](snapshotDate, currentDate)
}

const findLatestSnapshotDate = snapshots => {
  return snapshots.reduce((latestDate, snapshot) => {
    return latestDate > snapshot.date ? latestDate : snapshot.date
  }, new Date(0))
}

const findIfPoolIsOverdue = (date, frequency, poolSnapshots) => {
  if (!poolSnapshots || !poolSnapshots.hasOwnProperty(frequency)) {
    return true
  }

  const latestDate = findLatestSnapshotDate(poolSnapshots[frequency])

  return isOverdue(frequency, latestDate, date)
}

const getOverdueStatuses = ({ date, zmanConfig, poolName, frequency, snapshots }) => {
  let overdueStatuses = []

  zmanConfig.pools.forEach(poolConfig => {
    if (!poolName || poolConfig.name === poolName) {
      const poolSnapshots = snapshots[poolConfig.name]

      poolConfig.frequencies
        .filter(poolFrequency => frequency ? poolFrequency.type === frequency : true)
        .forEach(poolFrequency => {
          const isPoolOverdue = findIfPoolIsOverdue(date, poolFrequency.type, poolSnapshots)

          if (isPoolOverdue) {
            const poolStatus = { pool: poolConfig.name, frequency: poolFrequency }

            overdueStatuses.push(poolStatus)
          }
        })
    }
  })

  return overdueStatuses
}

module.exports = { getRelatedSnapshots, getActiveSnapshots, getExpiredSnapshots, getOverdueStatuses }
