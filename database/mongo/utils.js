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

module.exports = { 
  getHost,
  getLoggerLevel,
}