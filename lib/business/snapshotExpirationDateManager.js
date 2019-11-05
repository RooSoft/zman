const getFilterMethodByFrequencyType = (frequencyType, quantity) => {
  const methods = {
    'monthly': snapshotDate => {
      const expirationDate = new Date(snapshotDate.getTime())

      expirationDate.setMonth(snapshotDate.getMonth() + quantity)

      return expirationDate
    },
    'daily': snapshotDate => {
      const expirationDate = new Date(snapshotDate.getTime())

      expirationDate.setDate(snapshotDate.getDate() + quantity)

      return expirationDate
    },
    'hourly': snapshotDate => {
      const expirationDate = new Date(snapshotDate.getTime())

      expirationDate.setHours(snapshotDate.getHours() + quantity)

      return expirationDate
    }
  }

  return methods[frequencyType]
}

const addExpirationDate = (zmanConfig, snapshots) => {
  zmanConfig.pools.forEach(poolConfig => {
    if (snapshots.hasOwnProperty(poolConfig.name)) {
      const poolSnapshots = snapshots[poolConfig.name]

      poolConfig.frequencies.forEach(frequency => {
        if (poolSnapshots.hasOwnProperty(frequency.type)) {
          return poolSnapshots[frequency.type].map(snapshot => {
            const filter = getFilterMethodByFrequencyType(frequency.type, frequency.quantity)

            snapshot.expirationDate = new Date(filter(snapshot.date))

            return snapshot
          })
        } else {
          return []
        }
      })
    }
  })
}

module.exports = { addExpirationDate }
