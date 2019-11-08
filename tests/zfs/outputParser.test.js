const { readConfig } = require('../../lib/yaml')

const { parseSnapshots } = require('../../lib/zfs/snapshotParser')
const { sortSnapshotsByPool } = require('../../lib/business/snapshotSorter')
const { getRelatedSnapshots } = require('../../lib/business/snapshotFilter')

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


test('Should correctly parse snapshots', () => {
  const zmanConfig = readConfig('tests/config/zman.yaml')
  const snapshots = parseSnapshots({ output: DUMMY_SNAPSHOT_OUTPUT })
  const snapshotsByPool = sortSnapshotsByPool(snapshots)

  const poolSnapshots = getRelatedSnapshots(zmanConfig, snapshotsByPool)

  expect(poolSnapshots['smallpool/zman']['monthly']).toHaveLength(4)
  expect(poolSnapshots['largepool/whatever']['daily']).toHaveLength(2)
  expect(poolSnapshots['largepool/whatever']['hourly']).toHaveLength(1)
})
