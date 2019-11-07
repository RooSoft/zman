const execSync = require('child_process').execSync

const getSnapshots = () => {
  return execSync('zfs list -r -t snapshot -o creation,space',
    (error, stdout, stderr) => {
      if (error !== null) {
        console.log(stdout)
      }
    }
  ).toString()
}

const renewSnapshot = (poolName, snapshotName) => {
  const command = `zfs snapshot ${poolName}@${snapshotName}`

  console.log(command)

  execSync(command,
    (error, stdout, stderr) => {
      if (error !== null) {
        console.log(stdout)
      }
    }
  )
}

module.exports = { getSnapshots, renewSnapshot }
