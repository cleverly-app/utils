const dbOption = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
  autoIndex: true,
  poolSize: 10,
  serverSelectionTimeoutMS: 5000,
};

module.exports = {
  dbOption
}