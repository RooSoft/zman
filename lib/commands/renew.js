const { analyzeZfsPool } = require('../zfs/analyzer')

const moment = require('moment')

const R = require('ramda')

const priorities = {
  monthly: 1,
  daily: 2,
  hourly: 3
}

const renewOverdueSnapshots = () => {
  const { overdueStatuses } = analyzeZfsPool()

  const pools = R.compose(
    R.uniq,
    R.map(status => status.pool)
  )(overdueStatuses)

  const renewals = pools.map(pool => {
    const frequency = R.compose(
      R.nth(0),
      R.map(status => status.frequency),
      R.sortBy(R.prop('priority')),
      R.map(frequency => ({ frequency, priority: priorities[frequency]})),
      R.map(status => status.frequency.type),
      R.filter(status => status.pool === pool)
    )(overdueStatuses)

    return {pool, frequency}
  })

  renewals.map(renewal => {
    const now = new Date()
    const dateString = moment(now).format('YYYY-MM-DD-HH:mm')

    const command = `zfs snapshot ${renewal.pool}@zman-${renewal.frequency}-${dateString}`
    console.dir(command)
  })
}

module.exports = { renewOverdueSnapshots }
