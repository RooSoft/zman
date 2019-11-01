const sortSnapshotsByPool = snapshots => {
  return snapshots.reduce((sorted, snapshot) => {
    if(sorted.hasOwnProperty(snapshot.poolName)) {
      sorted[snapshot.poolName].push(snapshot)
    } else {
      sorted[snapshot.poolName] = [snapshot]
    }

    return sorted
  }, {})
}

module.exports = { sortSnapshotsByPool }
