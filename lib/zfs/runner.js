const execSync = require('child_process').execSync

const getSnapshots = () => {
  return execSync('zfs list -r -t snapshot -o creation,space smallpool/zman',
    (error, stdout, stderr) => {
      if (error !== null) {
        console.log(stdout)
      }
    }
  ).toString()
}

module.exports = { getSnapshots }
