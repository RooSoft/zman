const { displayStatus } = require('./commands/status')
const { renewOverdueSnapshots } = require('./commands/renew')

const Yargs = require('yargs')

const parse = () => {
  return Yargs
    .command({
      command: 'status',
      describe: 'get snapshots status',
      builder: {
        config: {
          alias: 'f',
          describe: 'path of the zman.yaml file',
          type: 'string',
          default: './zman.yaml',
          demandOption: false
        }
      },
      handler: argv => {
        displayStatus(argv.config)
      }
    })
    .command({
      command: 'renew',
      describe: 'renew overdue snapshots',
      handler: yargs => {
        renewOverdueSnapshots(yargs.configFilePath)
      }
    })
    .command({
      command: 'purge',
      describe: 'purge expired snapshots',
      handler: () => {
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
