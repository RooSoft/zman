const execSync = require('child_process').execSync

const executeCommand = command => {
  return execSync(command,
    (error, stdout, stderr) => {
      if (error !== null) {
        console.dir(error)
        console.log(stdout)
      }
    }
  )
}

const getSnapshots = () => {
  const command = 'zfs list -r -t snapshot -o creation,space'

  return executeCommand(command).toString()
}

const renewSnapshot = (snapshotName) => {
  const command = `zfs snapshot ${snapshotName}`

  console.log(command)

  executeCommand(command)
}

const purgeSnapshot = (snapshotName) => {
  const command = `zfs destroy ${snapshotName}`

  console.log(command)

  executeCommand(command)
}

module.exports = { getSnapshots, renewSnapshot, purgeSnapshot }
