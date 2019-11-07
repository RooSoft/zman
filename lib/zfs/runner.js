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

const getSnapshots = zfsExecutablePath => {
  const command = `${zfsExecutablePath} list -r -t snapshot -o creation,space`

  return executeCommand(command).toString()
}

const renewSnapshot = (zfsExecutablePath, snapshotName) => {
  const command = `${zfsExecutablePath} snapshot ${snapshotName}`

  console.log(command)

  executeCommand(command)
}

const purgeSnapshot = (zfsExecutablePath, snapshotName) => {
  const command = `${zfsExecutablePath} destroy ${snapshotName}`

  console.log(command)

  executeCommand(command)
}

module.exports = { getSnapshots, renewSnapshot, purgeSnapshot }
