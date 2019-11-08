const { displayStatus } = require('./commands/status')
const { renewOverdueSnapshots } = require('./commands/renew')
const { purgeExpiredSnapshots } = require('./commands/purge')

const Yargs = require('yargs')

const config = {
  alias: 'c',
  describe: 'path of the zman.yaml file',
  type: 'string',
  default: '/etc/zman/zman.yaml',
  demandOption: false
}

const frequency = {
  alias: 'f',
  describe: 'filter snapshots by frequency',
  type: 'string',
  choices: ['monthly', 'daily', 'hourly'],
  demandOption: false
}

const parse = () => {
  return Yargs
    .command({
      command: 'status',
      describe: 'get snapshots status',
      builder: {
        config,
        frequency
      },
      handler: ({ config, frequency }) => {
        displayStatus({ configFilePath: config, frequency })
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
        purgeExpiredSnapshots(argv.config)
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
