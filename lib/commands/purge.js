const { analyzeZfsPool } = require('../zfs/analyzer')
const { purgeSnapshot } = require('../zfs/runner')

const purgeExpiredSnapshots = configFilePath => {
  const { expiredSnapshots } = analyzeZfsPool(configFilePath)

  expiredSnapshots.map(snapshot => {
    purgeSnapshot(snapshot.name)
  })
}

module.exports = { purgeExpiredSnapshots }
