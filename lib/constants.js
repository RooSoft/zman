const frequencyPriorities = {
  monthly: 1,
  daily: 2,
  hourly: 3
}

const snapshotValidityTestingMethods = {
  'monthly': (snapshotDate, currentDate) => snapshotDate.setMonth(snapshotDate.getMonth() + 1) < currentDate,
  'daily': (snapshotDate, currentDate) => snapshotDate.setDate(snapshotDate.getDate() + 1) < currentDate,
  'hourly': (snapshotDate, currentDate) => snapshotDate.setHours(snapshotDate.getHours() + 1) < currentDate
}

module.exports = { frequencyPriorities, snapshotValidityTestingMethods }
