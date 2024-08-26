const getHost = (host, port) => {
  const portUrl = !!port && Number.isInteger(parseInt(port, 10)) 
    ? `:${port}` 
    : '';
  
  return `${host}${portUrl}`;
}

const getLoggerLevel = (debug) => {
  return debug
    ? 'debug'
    : 'info';
}

const logDb = (logger, message, { type: level }) => logger.log({ level, message });

module.exports = { 
  getHost,
  getLoggerLevel,
  logDb,
}