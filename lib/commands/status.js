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

const showExpiredSnapshots = expiredSnapshots => {
  const array = expiredSnapshots
    .sort((a, b) => a.name < b.name)
    .map(({ poolName, frequency, date, name }) => {
      const dateString = moment(date).format('YYYY-MM-DD HH:mm')
      return [poolName, frequency, dateString, name]
    })

  array.unshift(['POOL', 'FREQUENCY', 'CREATION DATE', 'NAME'])

  const output = table(array, {
    border: getBorderCharacters(`void`),
    columnDefault: {
      paddingLeft: 0,
      paddingRight: 3
    },
    drawHorizontalLine: () => {
      return false
    }
  })

  console.log('EXPIRED SNAPSHOTS')
  console.log('-----------------')
  console.log('')
  console.log(output)
}

const showOverdueStatuses = overdueStatuses => {
  const array = overdueStatuses
    .sort((a, b) => a.pool < b.pool)
    .map(({ pool, frequency }) => {
      return [pool, frequency.type]
    })

  array.unshift(['POOL', 'FREQUENCY'])

  const output = table(array, {
    border: getBorderCharacters(`void`),
    columnDefault: {
      paddingLeft: 0,
      paddingRight: 3
    },
    drawHorizontalLine: () => {
      return false
    }
  })

  console.log('OVERDUE POOLS')
  console.log('-------------')
  console.log('')
  console.log(output)
}

const showStatusInTable = (expiredSnapshots, overdueStatuses) => {
  showExpiredSnapshots(expiredSnapshots)

  console.log()

  showOverdueStatuses(overdueStatuses)
}

const displayStatus = () => {
  const snapshotOutput = getSnapshots()

  const snapshots = parseSnapshots(snapshotOutput)
  const snapshotsByPool = sortSnapshotsByPool(snapshots)

  const poolSnapshots = getRelatedSnapshots(zmanConfig, snapshotsByPool)

  const now = new Date()

  const expiredSnapshots = getExpiredSnapshots(now, zmanConfig, poolSnapshots)
  const overdueStatuses = getOverdueStatuses(now, zmanConfig, poolSnapshots)

  showStatusInTable(expiredSnapshots, overdueStatuses)
}

module.exports = { displayStatus }
