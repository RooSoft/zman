const { readConfig } = require('../../lib/yaml')

const { parseSnapshots } = require('../../lib/zfs/snapshotParser')
const { sortSnapshotsByPool } = require('../../lib/business/snapshotSorter')
const { getRelatedSnapshots, getExpiredSnapshots, getOverdueStatuses } = require('../../lib/business/snapshotFilter')

const DUMMY_SNAPSHOT_OUTPUT = `CREATION               NAME              AVAIL   USED  USEDSNAP  USEDDS  USEDREFRESERV  USEDCHILD
Tue Oct 29  14:14 2019  largepool/whatever@zman-hourly-2019-10-29-14:14      -   112K         -       -              -          -
Tue Sep 27  14:14 2019  largepool/whatever@zman-daily-2019-09-27-14:14      -   112K         -       -              -          -
Tue Sep 28  14:14 2019  largepool/whatever@zman-daily-2019-09-28-14:14      -   112K         -       -              -          -
Tue Jun 28  14:14 2019  largepool/whatever@zman-monthly-2019-06-28-14:14      -   112K         -       -              -          -
Tue Aug 28  14:14 2019  largepool/whatever@zman-monthly-2019-08-28-14:14      -   112K         -       -              -          -
Tue Jul 28  14:14 2019  largepool/whatever@zman-monthly-2019-07-28-14:14      -   112K         -       -              -          -
Tue Sep 28  14:14 2019  largepool/whatever@zman-monthly-2019-09-28-14:14      -   112K         -       -              -          -
Tue Oct 28  14:14 2019  largepool/whatever@zman-monthly-2019-10-28-14:14      -   112K         -       -              -          -
Tue Jul 29  14:14 2019  smallpool/zman@zman-monthly-2019-07-29-14:14      -   112K         -       -              -          -
Tue Aug 29  14:14 2019  smallpool/zman@zman-monthly-2019-08-29-14:14      -   112K         -       -              -          -
Tue Sept 29  14:14 2019  smallpool/zman@zman-monthly-2019-09-29-14:14      -   112K         -       -              -          -
Tue Oct 29  14:15 2019  smallpool/zman@zman-monthly-2019-10-29-14:15      -   112K         -       -              -          -`


test('Should sort out snapshots by pools and frequencies according to yaml config file', () => {
  const zmanConfig = readConfig('./zman.yaml')

  const snapshots = parseSnapshots(DUMMY_SNAPSHOT_OUTPUT)
  const snapshotsByPool = sortSnapshotsByPool(snapshots)
  const poolSnapshots = getRelatedSnapshots(zmanConfig, snapshotsByPool)

  expect(poolSnapshots['largepool/whatever']['hourly']).toHaveLength(1)
  expect(poolSnapshots['largepool/whatever']['daily']).toHaveLength(2)
  expect(poolSnapshots['largepool/whatever']['monthly']).toHaveLength(5)
  expect(poolSnapshots['largepool/whatever']['monthly']).toHaveLength(5)
  expect(poolSnapshots['smallpool/zman']['monthly']).toHaveLength(4)
})

test('Should sort out expired snapshots', () => {
  const zmanConfig = readConfig('./zman.yaml')

  const now = new Date('2019-11-1')

  const snapshots = parseSnapshots(DUMMY_SNAPSHOT_OUTPUT)
  const snapshotsByPool = sortSnapshotsByPool(snapshots)
  const poolSnapshots = getRelatedSnapshots(zmanConfig, snapshotsByPool)
  const expiredSnapshots = getExpiredSnapshots(now, zmanConfig, poolSnapshots)

  expect(expiredSnapshots).toHaveLength(7)

  const expiredSnapshotNames = [
    'largepool/whatever@zman-hourly-2019-10-29-14:14',
    'largepool/whatever@zman-daily-2019-09-27-14:14',
    'largepool/whatever@zman-daily-2019-09-28-14:14',
    'largepool/whatever@zman-monthly-2019-06-28-14:14',
    'largepool/whatever@zman-monthly-2019-07-28-14:14',
    'largepool/whatever@zman-monthly-2019-08-28-14:14',
    'smallpool/zman@zman-monthly-2019-07-29-14:14',
  ]

  expiredSnapshotNames.map(expiredSnapshotName => {
    const example = expiredSnapshots.filter(snapshot => snapshot.name === expiredSnapshotName)
    expect(example).toHaveLength(1)
  })
})

test('Should sort out overdue statuses', () => {
  const zmanConfig = readConfig('./zman.yaml')

  const now = new Date('2019-11-1')

  const snapshots = parseSnapshots(DUMMY_SNAPSHOT_OUTPUT)
  const snapshotsByPool = sortSnapshotsByPool(snapshots)
  const poolSnapshots = getRelatedSnapshots(zmanConfig, snapshotsByPool)
  const overdueSnapshots = getOverdueStatuses(now, zmanConfig, poolSnapshots)

  expect(overdueSnapshots).toHaveLength(4)

  const overduePoolFrequencies = [
    { pool: 'smallpool/zman', frequency: 'daily' },
    { pool: 'smallpool/zman', frequency: 'hourly' },
    { pool: 'largepool/whatever', frequency: 'daily' },
    { pool: 'largepool/whatever', frequency: 'hourly' },
  ]

  overduePoolFrequencies.map(overduePoolFrequency => {
    const example = overdueSnapshots.filter(overdueSnapshot => {
      return (overdueSnapshot.pool === overduePoolFrequency.pool)
        && (overdueSnapshot.frequency.type === overduePoolFrequency.frequency)
    })

    expect(example).toHaveLength(1)
  })
})
