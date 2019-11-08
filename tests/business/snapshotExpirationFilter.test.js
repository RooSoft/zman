const { readConfig } = require('../../lib/yaml')

const { parseSnapshots } = require('../../lib/zfs/snapshotParser')
const { sortSnapshotsByPool } = require('../../lib/business/snapshotSorter')
const { getRelatedSnapshots } = require('../../lib/business/snapshotFilter')
const { addExpirationDate } = require('../../lib/business/snapshotExpirationDateManager')

const {
  filterActiveSnapshotsByDate,
  filterExpiredSnapshotsByDate
} = require('../../lib/business/snapshotExpirationFilter')


const DUMMY_SNAPSHOT_OUTPUT = `CREATION               NAME              AVAIL   USED  USEDSNAP  USEDDS  USEDREFRESERV  USEDCHILD
Tue Oct 29  14:14 2019  largepool/whatever@zman-hourly-2019-10-29-14:14      -   112K         -       -              -          -
Tue Sep 27  14:14 2019  largepool/whatever@zman-daily-2019-09-27-14:14      -   112K         -       -              -          -
Tue Sep 28  14:14 2019  largepool/whatever@zman-daily-2019-09-28-14:14      -   112K         -       -              -          -
Tue Jun 28  14:14 2019  largepool/whatever@zman-monthly-2019-06-28-14:14      -   112K         -       -              -          -
Tue Jul 28  14:14 2019  largepool/whatever@zman-monthly-2019-07-28-14:14      -   112K         -       -              -          -
Tue Aug 28  14:14 2019  largepool/whatever@zman-monthly-2019-08-28-14:14      -   112K         -       -              -          -
Tue Sep 28  14:14 2019  largepool/whatever@zman-monthly-2019-09-28-14:14      -   112K         -       -              -          -
Tue Oct 28  14:14 2019  largepool/whatever@zman-monthly-2019-10-28-14:14      -   112K         -       -              -          -
Tue Jul 29  14:14 2019  smallpool/zman@zman-monthly-2019-07-29-14:14      -   112K         -       -              -          -
Tue Aug 29  14:14 2019  smallpool/zman@zman-monthly-2019-08-29-14:14      -   112K         -       -              -          -
Tue Sept 29  14:14 2019  smallpool/zman@zman-monthly-2019-09-29-14:14      -   112K         -       -              -          -
Tue Oct 29  14:15 2019  smallpool/zman@zman-monthly-2019-10-29-14:15      -   112K         -       -              -          -`

test('Should keep only active largepool/whatever dailies', () => {
  const poolName = 'largepool/whatever'
  const frequencyType = 'daily'

  const zmanConfig = readConfig('tests/config/zman.yaml')
  const snapshots = parseSnapshots({ output: DUMMY_SNAPSHOT_OUTPUT })
  const snapshotsByPool = sortSnapshotsByPool(snapshots)
  const poolSnapshots = getRelatedSnapshots(zmanConfig, snapshotsByPool)
  addExpirationDate(zmanConfig, poolSnapshots)

  const firstDate = new Date('2019-10-10')
  const firstActiveSnapshotsSet = filterActiveSnapshotsByDate(frequencyType, firstDate, poolSnapshots[poolName])

  expect(firstActiveSnapshotsSet).toHaveLength(2)

  const secondDate = new Date('2019-11-10')
  const secondActiveSnapshotsSet = filterActiveSnapshotsByDate(frequencyType, secondDate, poolSnapshots[poolName])

  expect(secondActiveSnapshotsSet).toHaveLength(0)
})

test('Should keep only expired largepool/whatever dailies', () => {
  const poolName = 'largepool/whatever'
  const frequencyType = 'daily'

  const zmanConfig = readConfig('tests/config/zman.yaml')
  const snapshots = parseSnapshots({ output: DUMMY_SNAPSHOT_OUTPUT })
  const snapshotsByPool = sortSnapshotsByPool(snapshots)
  const poolSnapshots = getRelatedSnapshots(zmanConfig, snapshotsByPool)
  addExpirationDate(zmanConfig, poolSnapshots)

  const firstDate = new Date('2019-10-10')
  const firstExpiredSnapshotsSet = filterExpiredSnapshotsByDate(frequencyType, firstDate, poolSnapshots[poolName])

  expect(firstExpiredSnapshotsSet).toHaveLength(0)

  const secondDate = new Date('2019-11-10')
  const secondExpiredSnapshotsSet = filterExpiredSnapshotsByDate(frequencyType, secondDate, poolSnapshots[poolName])

  expect(secondExpiredSnapshotsSet).toHaveLength(2)
})
