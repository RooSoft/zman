const filterActiveSnapshotsByDate = (frequencyType, date, snapshots) => {
  return snapshots[frequencyType].filter(snapshot => {
    return date <= snapshot.expirationDate
  })
}

const filterExpiredSnapshotsByDate = (frequencyType, date, snapshots) => {
  return snapshots[frequencyType].filter(snapshot => {
    return date > snapshot.expirationDate
  })
}

module.exports = { filterActiveSnapshotsByDate, filterExpiredSnapshotsByDate }
