import moment from 'moment'

export function parse (dateString) {
  return moment(dateString, 'YYYY MMM D H:mm').toDate()
}
