const { analyzeZfsPool } = require('../zfs/analyzer')

const moment = require('moment')

const renewOverdueSnapshots = configFilePath => {
  const { overdueStatuses } = analyzeZfsPool(configFilePath)

  overdueStatuses.map(renewal => {
    const now = new Date()
    const dateString = moment(now).format('YYYY-MM-DD-HH:mm')

    const command = `zfs snapshot ${renewal.pool}@zman-${renewal.frequency.type}-${dateString}`
    console.log(command)
  })
}

module.exports = { renewOverdueSnapshots }
