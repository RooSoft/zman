const { analyzeZfsPool } = require('../zfs/analyzer')

const purgeExpiredSnapshots = configFilePath => {
  const { expiredSnapshots } = analyzeZfsPool(configFilePath)

  expiredSnapshots.map(snapshot => {
    const command = `zfs destroy ${snapshot.name}`
    console.log(command)
  })
}

module.exports = { purgeExpiredSnapshots }
