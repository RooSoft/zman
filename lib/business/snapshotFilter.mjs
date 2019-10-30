import { getSnapshots } from '../zfs/index.mjs'
import {
  getMonthlyExpiredSnapshots,
  getDailyExpiredSnapshots,
  getHourlyExpiredSnapshots } from './snapshotExpirationFilter.mjs'

import R from 'ramda'

export function getRelatedSnapshots(zmanConfig) {
  let snapshots = {}

  zmanConfig.pools.forEach(poolConfig => {
    const poolSnapshots = snapshots[poolConfig.name] = {}

    poolConfig.frequencies.forEach(frequency => {
      const frequencySnapshots = poolSnapshots[frequency.type] = []
      const snapshot = getSnapshots(poolConfig.name, frequency.type)

      frequencySnapshots.push(snapshot)
    })
  })

  return snapshots
}

export function getExpiredSnapshots(zmanConfig, snapshots) {
  const monthlyExpiredSnapshots = getMonthlyExpiredSnapshots(zmanConfig, snapshots)
  const dailyExpiredSnapshots = getDailyExpiredSnapshots(zmanConfig, snapshots)
  const hourlyExpiredSnapshots = getHourlyExpiredSnapshots(zmanConfig, snapshots)

  return [...monthlyExpiredSnapshots, ...dailyExpiredSnapshots, ...hourlyExpiredSnapshots]
}

export function getOverdueSnapshots(zmanConfig, snapshots) {
  return []
}
