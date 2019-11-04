const { table, getBorderCharacters } = require('table')
const moment = require('moment')

const { readConfig } = require('../yaml')
const { getSnapshots } = require('../zfs/runner')
const { parseSnapshots } = require('../zfs/snapshotParser')
const { sortSnapshotsByPool } = require('../business/snapshotSorter')
const { getRelatedSnapshots, getExpiredSnapshots, getOverdueStatuses } = require('../business/snapshotFilter')

const zmanConfig = readConfig('./zman.yaml')

Array.prototype.prepend = (value) => {
  var newArray = this.slice();
  newArray.unshift(value);
  return newArray;
}

const formatSnapshots = snapshots => {
  const array = snapshots
    .sort((a, b) => a.name < b.name)
    .map(({ poolName, frequency, date, name }) => {
      const dateString = moment(date).format('YYYY-MM-DD HH:mm')
      return [poolName, frequency, dateString, name]
    })

  array.unshift(['', '', '', ''])
  array.unshift(['POOL', 'FREQUENCY', 'CREATION DATE', 'NAME'])

  return table(array, {
    border: getBorderCharacters(`void`),
    columnDefault: {
      paddingLeft: 0,
      paddingRight: 3
    },
    drawHorizontalLine: () => {
      return false
    }
  })
}

const formatOverdueStatuses = overdueStatuses => {
  const array = overdueStatuses
    .sort((a, b) => a.pool < b.pool)
    .map(({ pool, frequency }) => {
      return [pool, frequency.type]
    })

  array.unshift(['POOL', 'FREQUENCY'])

  return table(array, {
    border: getBorderCharacters(`void`),
    columnDefault: {
      paddingLeft: 0,
      paddingRight: 3
    },
    drawHorizontalLine: () => {
      return false
    }
  })
}

const showStatusInTable = (activeSnapshots, expiredSnapshots, overdueStatuses) => {
  const formattedActveSnapshots = formatSnapshots(activeSnapshots)

  console.log('ACTIVE SNAPSHOTS')
  console.log('----------------')
  console.log('')
  console.log(formattedActveSnapshots)
  console.log()

  const formattedExpiredSnapshots = formatSnapshots(expiredSnapshots)

  console.log('EXPIRED SNAPSHOTS')
  console.log('-----------------')
  console.log('')
  console.log(formattedExpiredSnapshots)
  console.log()

  const formattedOverdueStatuses = formatOverdueStatuses(overdueStatuses)

  console.log('OVERDUE POOLS')
  console.log('-------------')
  console.log('')
  console.log(formattedOverdueStatuses)
}

const displayStatus = () => {
  const snapshotOutput = getSnapshots()

  const snapshots = parseSnapshots(snapshotOutput)
  const snapshotsByPool = sortSnapshotsByPool(snapshots)

  const poolSnapshots = getRelatedSnapshots(zmanConfig, snapshotsByPool)

  const now = new Date()

  const activeSnapshots = [] // getActiveStatuses(now, zmanConfig, poolSnapshots)
  const expiredSnapshots = getExpiredSnapshots(now, zmanConfig, poolSnapshots)
  const overdueStatuses = getOverdueStatuses(now, zmanConfig, poolSnapshots)

  showStatusInTable(activeSnapshots, expiredSnapshots, overdueStatuses)
}

module.exports = { displayStatus }
