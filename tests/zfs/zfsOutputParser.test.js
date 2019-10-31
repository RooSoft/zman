const { getSnapshots } = require('../../lib/zfs/outputParser')

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

test('Should parse smallpool/zman monthly snapshots', () => {
  const poolName = 'smallpool/zman'
  const frequency = 'monthly'

  const poolSnapshots = getSnapshots(poolName, frequency, DUMMY_SNAPSHOT_OUTPUT)

  if (poolSnapshots.length !== 4) {
    throw new Error(`Should parse 4 shapshots, got ${poolSnapshots.length}`)
  }
})

test('Should parse largepool/whatever daily snapshots', () => {
  const poolName = 'largepool/whatever'
  const frequency = 'daily'

  const poolSnapshots = getSnapshots(poolName, frequency, DUMMY_SNAPSHOT_OUTPUT)

  if (poolSnapshots.length !== 2) {
    throw new Error(`Should parse 2 shapshots, got ${poolSnapshots.length}`)
  }
})

test('Should parse largepool/whatever hourly snapshots', () => {
  const poolName = 'largepool/whatever'
  const frequency = 'hourly'

  const poolSnapshots = getSnapshots(poolName, frequency, DUMMY_SNAPSHOT_OUTPUT)

  if (poolSnapshots.length !== 1) {
    throw new Error(`Should parse 1 shapshots, got ${poolSnapshots.length}`)
  }
})
