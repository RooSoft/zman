const filterActiveSnapshotsByDate = (frequencyType, date, snapshots) => {
  if (snapshots.hasOwnProperty(frequencyType)) {
    return snapshots[frequencyType].filter(snapshot => {
      return date <= snapshot.expirationDate
    })
  } else {
    return []
  }
}

const filterExpiredSnapshotsByDate = (frequencyType, date, snapshots) => {
  if (snapshots.hasOwnProperty(frequencyType)) {
    return snapshots[frequencyType].filter(snapshot => {
      return date > snapshot.expirationDate
    })
  } else {
    return []
  }
}

module.exports = { filterActiveSnapshotsByDate, filterExpiredSnapshotsByDate }
