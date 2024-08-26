const winston = require('winston');

const { levels, colors, date } = require('./constants');

const { line } = require('./utils');
 
const { combine, timestamp, printf, colorize, align } = winston.format;

class Logger {
  
  constructor(environment, level = 'info', format = date, ) {
    if (Logger.instance) {
      return Logger.instance;
    }

    winston.addColors({ levels, colors })

    this.environment = environment;
    this.logger = winston.createLogger({
      levels,
      level,
      format: combine(
        colorize({ all: true }),
        timestamp({ format }),
        align(),
        printf(line)
      ),
      transports: [new winston.transports.Console()],
    });
    

    Logger.instance = this;

  }

}

module.exports = Logger
