const moment = require('moment')

const parse = dateString => {
  return moment(dateString, 'YYYY MMM D H:mm').toDate()
}

module.exports = { parse }
