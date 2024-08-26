const winston = require('winston');

const { environments } = require('../constants');

const { combine, timestamp, printf, colorize, align } = winston.format;

const logLevels ={
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
    trace: 4,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'cyan',
    debug: 'gray',
    trace: 'magenta'
  }
};

winston.addColors(logLevels)

const logger = winston.createLogger({
  levels: logLevels.levels,
  level: environments.log_level || 'info',
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [new winston.transports.Console()],
});

module.exports = logger
