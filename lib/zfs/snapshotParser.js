const { parse } = require('./dateParser.js')

const R = require('ramda')

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

const parseSnapshots = output => {
  const cleanup = R.pipe(
    R.split('\n'),
    R.drop(1)
  )

  const lines = cleanup(output)

  return lines.map(line => parseSnapshot(line))
}

module.exports = { parseSnapshots }
