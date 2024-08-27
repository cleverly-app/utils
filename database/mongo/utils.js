const getLoggerLevel = (debug) => {
  return debug
    ? 'debug'
    : 'info';
}

const logDb = (logger, message, { type: level }) => logger.log({ level, message });

module.exports = { 
  getLoggerLevel,
  logDb,
}