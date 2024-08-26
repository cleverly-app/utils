const line = (info) => {
  return (
    `[${info.timestamp}] ${info.level}: ${info.message}`
  );
}

module.exports = { line }