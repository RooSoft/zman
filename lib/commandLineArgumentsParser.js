const { displayStatus } = require('./commands/status')
const { renewOverdueSnapshots } = require('./commands/renew')

const Yargs = require('yargs')

const parse = () => {
  return Yargs
    .command({
      command: 'status',
      describe: 'get snapshots status',
      handler: () => {
        displayStatus()
      }
    })
    .command({
      command: 'renew',
      describe: 'renew overdue snapshots',
      handler: () => {
        renewOverdueSnapshots()
      }
    })
    .command({
      command: 'purge',
      describe: 'purge expired snapshots',
      handler: yargs => {
        console.log('+++ purging all statuses')
      }
    })
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      description: 'Run with verbose logging'
    })
    .demandCommand()
    .recommendCommands()
    .strict()
    .argv
}

module.exports = parse
