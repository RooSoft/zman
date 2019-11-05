const { addExpirationDate } = require('../../lib/business/snapshotExpirationDateManager')
const { readConfig } = require('../../lib/yaml')

const zmanConfig = readConfig('./zman.yaml')

test('Should not crash trying to add expiration dates on an empty set', () => {
  addExpirationDate(zmanConfig, {})
})
