import { parse } from './dateParser.mjs'

import R from 'ramda'

const DUMMY_SNAPSHOT_OUTPUT = `CREATION               NAME              AVAIL   USED  USEDSNAP  USEDDS  USEDREFRESERV  USEDCHILD
Tue Oct 29  9:39 2019  smallpool/zman@zman-monthly-2019-09-30-14:14      -   112K         -       -              -          -
Tue Oct 29  9:55 2019  smallpool/zman@zman-monthly-2019-10-30-14:15      -   112K         -       -              -          -`

const removeDuplicateSpaces = str => {
  return str.replace(/\s+/g, " ")
}

const parseSnapshot = line => {
  const tokens = removeDuplicateSpaces(line).split(' ')

  const year = tokens[4]
  const month = tokens[1]
  const day = tokens[2]
  const time = tokens[3]
  const dateString = `${year} ${month} ${day} ${time}`
  const name = tokens[5]
  const frequency = R.split('-')(name)[1]
  const poolName = R.split('@')(name)[0]

  return {
    poolName,
    frequency,
    date: parse(dateString),
    name
  }
}

export function getSnapshots(poolName, frequency) {
  const cleanup = R.pipe(
    R.split('\n'),
    R.drop(1)
  )

  const lines = cleanup(DUMMY_SNAPSHOT_OUTPUT)
  let output = []

  lines.forEach(line => {
    const snapshot = parseSnapshot(line)

    if((snapshot.poolName === poolName) && (snapshot.frequency === frequency)) {
      output.push(snapshot)
    }
  })

  return output
}
