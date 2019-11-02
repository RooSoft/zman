// commands: status, renew, purge

const parse = () => {
  return require('yargs')
    .command({
      command: 'status',
      describe: 'get snapshots status',
      handler: yargs => {
        console.log('+++ displaying statuses')
      }
    })
    .command({
      command: 'renew',
      describe: 'renew overdue snapshots',
      handler: yargs => {
        console.log('+++ renewing all statuses')
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
    .argv
}

module.exports = parse
