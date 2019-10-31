const getFilterMethodByFrequencyType = (frequencyType, quantity) => {
  const methods = {
    'monthly': snapshotDate => snapshotDate.setMonth(snapshotDate.getMonth()+quantity),
    'daily': snapshotDate => snapshotDate.setDate(snapshotDate.getDate()+quantity),
    'hourly': snapshotDate => snapshotDate.setHours(snapshotDate.getHours()+quantity)
  }

  return methods[frequencyType]
}

export function filterSnapshotsByDate(frequencyType, quantity, date, snapshots) {
  const filter = getFilterMethodByFrequencyType(frequencyType, quantity)

  return snapshots[frequencyType].filter(snapshot => {
    let snapshotDate = new Date(snapshot.date.getTime()) // clone snapshot date
    const snapshotExpirationDate = filter(snapshotDate)

    return date > snapshotExpirationDate
  })
}
