const { table, getBorderCharacters } = require('table')
const chalk = require('chalk')
const moment = require('moment')

const { readConfig } = require('../yaml')
const { getSnapshots } = require('../zfs/runner')
const { parseSnapshots } = require('../zfs/snapshotParser')
const { sortSnapshotsByPool } = require('../business/snapshotSorter')
const { getRelatedSnapshots, getExpiredSnapshots, getOverdueStatuses } = require('../business/snapshotFilter')

const zmanConfig = readConfig('./zman.yaml')
const headerStyle = chalk.underline


Array.prototype.prepend = (value) => {
  var newArray = this.slice();
  newArray.unshift(value);
  return newArray;
}

const formatSnapshots = snapshots => {
  if (snapshots.length === 0) {
    return 'no snapshots\n'
  }

  const array = snapshots
    .sort((a, b) => a.name < b.name)
    .map(({ poolName, frequency, date, name }) => {
      const dateString = moment(date).format('YYYY-MM-DD HH:mm')
      return [poolName, frequency, dateString, name]
    })

  array.unshift([
    headerStyle('POOL'),
    headerStyle('FREQUENCY'),
    headerStyle('CREATION DATE'),
    headerStyle('NAME')
  ])

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

  array.unshift([headerStyle('POOL'), headerStyle('FREQUENCY')])

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

  console.log(headerStyle('ACTIVE SNAPSHOTS'))
  console.log('')
  console.log(formattedActveSnapshots)
  console.log()

  const formattedExpiredSnapshots = formatSnapshots(expiredSnapshots)

  console.log(headerStyle('EXPIRED SNAPSHOTS'))
  console.log('')
  console.log(formattedExpiredSnapshots)
  console.log()

  const formattedOverdueStatuses = formatOverdueStatuses(overdueStatuses)

  console.log(headerStyle('OVERDUE POOLS'))
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
