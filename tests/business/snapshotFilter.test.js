const { readConfig } = require('../../lib/yaml')

const { parseSnapshots } = require('../../lib/zfs/snapshotParser')
const { sortSnapshotsByPool } = require('../../lib/business/snapshotSorter')
const { addExpirationDate } = require('../../lib/business/snapshotExpirationDateManager')
const {
  getRelatedSnapshots,
  getActiveSnapshots,
  getExpiredSnapshots,
  getOverdueStatuses
} = require('../../lib/business/snapshotFilter')


const POPULATED_SNAPSHOT_OUTPUT = `CREATION               NAME              AVAIL   USED  USEDSNAP  USEDDS  USEDREFRESERV  USEDCHILD
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

const EMPTY_SNAPSHOT_OUTPUT = `CREATION               NAME              AVAIL   USED  USEDSNAP  USEDDS  USEDREFRESERV  USEDCHILD
Tue Oct 29  9:39 2019  smallpool/zman@1      -   112K         -       -              -          -
Tue Oct 29  9:55 2019  smallpool/zman@2      -   112K         -       -              -          -`

const ONE_SNAPSHOT_OUTPUT = `CREATION               NAME              AVAIL   USED  USEDSNAP  USEDDS  USEDREFRESERV  USEDCHILD
Tue Oct 29  9:39 2019  smallpool/zman@1      -   112K         -       -              -          -
Tue Oct 29  9:55 2019  smallpool/zman@2      -   112K         -       -              -          -
Tue Oct 31  14:14 2019  largepool/whatever@zman-monthly-2019-10-29-14:14      -   112K         -       -              -          -`


test('Should get empty related snapshots object after parsing an empty snapshot set', () => {
  const zmanConfig = readConfig('./zman.yaml')

  const snapshots = parseSnapshots(EMPTY_SNAPSHOT_OUTPUT)
  const snapshotsByPool = sortSnapshotsByPool(snapshots)

  const poolSnapshots = getRelatedSnapshots(zmanConfig, snapshotsByPool)

  expect(poolSnapshots).toMatchObject({})
})

test('Should return an empty object trying to get expired snapshots on an empty snapshot set', () => {
  const zmanConfig = readConfig('./zman.yaml')

  const now = new Date('2019-11-1')

  const expiredSnapshots = getExpiredSnapshots(now, zmanConfig, {})

  expect(expiredSnapshots).toMatchObject({})
})

test('Should return an empty object trying to get active snapshots on an empty snapshot set', () => {
  const zmanConfig = readConfig('./zman.yaml')

  const now = new Date('2019-11-1')

  const activeSnapshots = getActiveSnapshots(now, zmanConfig, {})

  expect(activeSnapshots).toMatchObject({})
})

test('Should return all possible overdue statuses on an empty snapshot set', () => {
  const zmanConfig = readConfig('./zman.yaml')

  const now = new Date('2019-11-1')

  const overdueStatuses = getOverdueStatuses(now, zmanConfig, {})

  expect(overdueStatuses).toMatchObject([
    {
      pool: 'smallpool/zman',
      frequency: { type: 'monthly', quantity: 3 }
    },
    {
      pool: 'smallpool/zman',
      frequency: { type: 'daily', quantity: 31 }
    },
    {
      pool: 'smallpool/zman',
      frequency: { type: 'hourly', quantity: 24 }
    },
    {
      pool: 'largepool/whatever',
      frequency: { type: 'monthly', quantity: 2 }
    },
    {
      pool: 'largepool/whatever',
      frequency: { type: 'daily', quantity: 33 }
    },
    {
      pool: 'largepool/whatever',
      frequency: { type: 'hourly', quantity: 24 }
    },
  ])
})

test('Should work properly on a set with only one hourly snapshot', () => {
  const zmanConfig = readConfig('./zman.yaml')

  const snapshots = parseSnapshots(ONE_SNAPSHOT_OUTPUT)
  const snapshotsByPool = sortSnapshotsByPool(snapshots)

  const poolSnapshots = getRelatedSnapshots(zmanConfig, snapshotsByPool)
  addExpirationDate(zmanConfig, poolSnapshots)

  expect(poolSnapshots['smallpool/zman']).toMatchObject({})
  expect(poolSnapshots['largepool/whatever']['hourly']).toHaveLength(0)
  expect(poolSnapshots['largepool/whatever']['daily']).toHaveLength(0)
  expect(poolSnapshots['largepool/whatever']['monthly']).toHaveLength(1)

  const now = new Date('2019-11-1 0:00')

  const overdueStatuses = getOverdueStatuses(now, zmanConfig, poolSnapshots)

  expect(overdueStatuses).toMatchObject([
    {
      pool: 'smallpool/zman',
      frequency: { type: 'monthly', quantity: 3 }
    },
    {
      pool: 'smallpool/zman',
      frequency: { type: 'daily', quantity: 31 }
    },
    {
      pool: 'smallpool/zman',
      frequency: { type: 'hourly', quantity: 24 }
    },
    {
      pool: 'largepool/whatever',
      frequency: { type: 'daily', quantity: 33 }
    },
    {
      pool: 'largepool/whatever',
      frequency: { type: 'hourly', quantity: 24 }
    }
  ])
})

test('Should sort snapshots by pools and frequencies according to yaml config file', () => {
  const zmanConfig = readConfig('./zman.yaml')

  const snapshots = parseSnapshots(POPULATED_SNAPSHOT_OUTPUT)
  const snapshotsByPool = sortSnapshotsByPool(snapshots)

  const poolSnapshots = getRelatedSnapshots(zmanConfig, snapshotsByPool)

  expect(poolSnapshots['largepool/whatever']['hourly']).toHaveLength(1)
  expect(poolSnapshots['largepool/whatever']['daily']).toHaveLength(2)
  expect(poolSnapshots['largepool/whatever']['monthly']).toHaveLength(5)
  expect(poolSnapshots['largepool/whatever']['monthly']).toHaveLength(5)
  expect(poolSnapshots['smallpool/zman']['monthly']).toHaveLength(4)
})

test('Should find active snapshots', () => {
  const zmanConfig = readConfig('./zman.yaml')

  const now = new Date('2019-11-1')

  const snapshots = parseSnapshots(POPULATED_SNAPSHOT_OUTPUT)
  const snapshotsByPool = sortSnapshotsByPool(snapshots)
  const poolSnapshots = getRelatedSnapshots(zmanConfig, snapshotsByPool)
  addExpirationDate(zmanConfig, poolSnapshots)

  const activeSnapshots = getActiveSnapshots(now, zmanConfig, poolSnapshots)

  expect(activeSnapshots).toHaveLength(5)

  const activeSnapshotNames = [
    'largepool/whatever@zman-monthly-2019-09-28-14:14',
    'largepool/whatever@zman-monthly-2019-10-28-14:14',
    'smallpool/zman@zman-monthly-2019-08-29-14:14',
    'smallpool/zman@zman-monthly-2019-09-29-14:14',
    'smallpool/zman@zman-monthly-2019-10-29-14:15',
  ]

  activeSnapshotNames.map(activeSnapshotName => {
    const example = activeSnapshots.filter(snapshot => snapshot.name === activeSnapshotName)
    expect(example).toHaveLength(1)
  })
})

test('Should find expired snapshots', () => {
  const zmanConfig = readConfig('./zman.yaml')

  const now = new Date('2019-11-1')

  const snapshots = parseSnapshots(POPULATED_SNAPSHOT_OUTPUT)
  const snapshotsByPool = sortSnapshotsByPool(snapshots)
  const poolSnapshots = getRelatedSnapshots(zmanConfig, snapshotsByPool)
  addExpirationDate(zmanConfig, poolSnapshots)

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

test('Should find overdue statuses', () => {
  const zmanConfig = readConfig('./zman.yaml')

  const now = new Date('2019-11-1')

  const snapshots = parseSnapshots(POPULATED_SNAPSHOT_OUTPUT)
  const snapshotsByPool = sortSnapshotsByPool(snapshots)
  const poolSnapshots = getRelatedSnapshots(zmanConfig, snapshotsByPool)
  addExpirationDate(zmanConfig, poolSnapshots)

  const overdueStatuses = getOverdueStatuses(now, zmanConfig, poolSnapshots)

  expect(overdueStatuses).toMatchObject([
    {
      pool: 'smallpool/zman',
      frequency: { type: 'daily', quantity: 31 }
    },
    {
      pool: 'smallpool/zman',
      frequency: { type: 'hourly', quantity: 24 }
    },
    {
      pool: 'largepool/whatever',
      frequency: { type: 'daily', quantity: 33 }
    }, {
      pool: 'largepool/whatever',
      frequency: { type: 'hourly', quantity: 24 }
    }
  ])
})
