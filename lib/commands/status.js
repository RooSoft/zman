const { table, getBorderCharacters } = require('table')
const chalk = require('chalk')
const moment = require('moment')

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
const headerStyle = chalk.underline


Array.prototype.prepend = (value) => {
  var newArray = this.slice();
  newArray.unshift(value);
  return newArray;
}

const formatSnapshots = (expireTimespanTitle, snapshots) => {
  if (snapshots.length === 0) {
    return 'no snapshots\n'
  }

  const array = snapshots
    .sort((a, b) => a.name < b.name)
    .map(({ poolName, frequency, date, expirationDate, name }) => {
      const dateString = moment(date).format('YYYY-MM-DD HH:mm')
      const expirationDateString = moment(expirationDate).format('YYYY-MM-DD HH:mm')
      const expireIn = moment.duration(new Date()-expirationDate).humanize()
      return [poolName, frequency, dateString, expirationDateString, expireIn, name]
    })

  array.unshift([
    headerStyle('POOL'),
    headerStyle('FREQUENCY'),
    headerStyle('CREATION DATE'),
    headerStyle('EXPIRATION DATE'),
    headerStyle(expireTimespanTitle),
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
  const formattedActveSnapshots = formatSnapshots('EXPIRE IN', activeSnapshots)

  console.log(headerStyle('ACTIVE SNAPSHOTS'))
  console.log('')
  console.log(formattedActveSnapshots)
  console.log()

  const formattedExpiredSnapshots = formatSnapshots('EXPIRED SINCE', expiredSnapshots)

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
  const now = new Date()

  const snapshotOutput = getSnapshots()

  const snapshots = parseSnapshots(snapshotOutput)
  const snapshotsByPool = sortSnapshotsByPool(snapshots)

  const poolSnapshots = getRelatedSnapshots(zmanConfig, snapshotsByPool)
  addExpirationDate(zmanConfig, poolSnapshots)

  const activeSnapshots = getActiveSnapshots(now, zmanConfig, poolSnapshots)
  const expiredSnapshots = getExpiredSnapshots(now, zmanConfig, poolSnapshots)
  const overdueStatuses = getOverdueStatuses(now, zmanConfig, poolSnapshots)

  showStatusInTable(activeSnapshots, expiredSnapshots, overdueStatuses)
}

module.exports = { displayStatus }
