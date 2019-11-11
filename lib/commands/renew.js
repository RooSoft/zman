const { readConfig } = require('../yaml')
const { analyzeZfsPool } = require('../zfs/analyzer')
const { renewSnapshot } = require('../zfs/runner')

const moment = require('moment')

const renewOverdueSnapshots = configFilePath => {
  const { overdueStatuses } = analyzeZfsPool({ configFilePath })
  const zmanConfig = readConfig(configFilePath)

  overdueStatuses.map(renewal => {
    const now = new Date()
    const dateString = moment(now).format('YYYY-MM-DD-HH:mm')

    const snapshotName = `zman-${renewal.frequency.type}-${dateString}`

    renewSnapshot(zmanConfig.zfs, `${renewal.pool}@${snapshotName}`)
  })
}

module.exports = { renewOverdueSnapshots }
