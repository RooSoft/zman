const { displayStatus } = require('./commands/status')
const { renewOverdueSnapshots } = require('./commands/renew')

const Yargs = require('yargs')

const config = {
  alias: 'f',
  describe: 'path of the zman.yaml file',
  type: 'string',
  default: '/etc/zman/zman.yaml',
  demandOption: false
}

const parse = () => {
  return Yargs
    .command({
      command: 'status',
      describe: 'get snapshots status',
      builder: { config },
      handler: argv => {
        displayStatus(argv.config)
      }
    })
    .command({
      command: 'renew',
      describe: 'renew overdue snapshots',
      builder: { config },
      handler: argv => {
        renewOverdueSnapshots(argv.config)
      }
    })
    .command({
      command: 'purge',
      describe: 'purge expired snapshots',
      builder: { config },
      handler: argv => {
        console.log(`+++ purging all statuses with ${argv.config}`)
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
