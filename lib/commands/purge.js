const { readConfig } = require('../yaml')
const { analyzeZfsPool } = require('../zfs/analyzer')
const { purgeSnapshot } = require('../zfs/runner')

const purgeExpiredSnapshots = configFilePath => {
  const { expiredSnapshots } = analyzeZfsPool(configFilePath)
  const zmanConfig = readConfig(configFilePath)

  expiredSnapshots.map(snapshot => {
    purgeSnapshot(zmanConfig.zfs, snapshot.name)
  })
}

module.exports = { purgeExpiredSnapshots }
