const printf = (info) => {
  return (
    `[${info.timestamp}] ${info.level}: ${info.message}`
  );
}


module.exports = { printf }