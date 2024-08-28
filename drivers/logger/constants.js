const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  trace: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  debug: 'gray',
  trace: 'magenta'
};

const date ='YYYY-MM-DD HH:mm:ss.SSS';

module.exports = {
  levels,
  colors,
  date
}