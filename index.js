const { ConfigError } = require('./lib/errors')


try {
  require('./lib/commandLineArgumentsParser')()
} catch (e) {
  if (e instanceof ConfigError) {
    console.log(e.message)
  } else {
    throw e
  }
}
