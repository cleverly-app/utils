/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const { environments } = require('../constants');
  const logger = require('./logger.driver');
const { env, mongo, debug } = environments;
const {
  host, port, database, user = false, pass = false, prefix, poolsize, timeout
} = mongo;

class MongoDatabase {
  constructor(modelDirectory) {
    this.modelDirectory = modelDirectory
    this.env = env;
    this.db = database;
    this.port = !!port && Number.isInteger(parseInt(port, 10)) ? `:${port}` : '';
    this.dbURI = `${prefix}://${host}${this.port}/${this.db}`;
    this.instance = false;

    this.dbOption = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      autoIndex: true,
      poolSize: poolsize,
      serverSelectionTimeoutMS: timeout,
      logger: logger.debug,
      loggerLevel: debug ? 'debug' : 'info',
    };
    if (user !== false && pass !== false) {
      this.dbOption.auth = { authSource: 'admin' };
      this.dbOption.user = user;
      this.dbOption.pass = pass;
    }
    this.connect();

  }

  setNotifications(connection) {
    connection.on('error', (err) => {
      logger.error(`Error connecting to MongoDb @ ${this.dbURI}: ${err.message}`)
    });
    connection.on('connecting', () => {
      logger.info(`Connecting to MongoDB @ ${this.dbURI}`);
    });
    connection.on('connected', () => {
      logger.info(`Successfully connected to MongoDB @ ${this.dbURI} `);
    });
    connection.on('reconnected', () => {
      logger.info(`Reconnected to MongoDB @ ${this.dbURI}`);
    });
    connection.on('disconnecting', () => {
      logger.info(`Disconnecting from MongoDB @ ${this.dbURI}`);
    });
    connection.on('disconnected', () => {
      logger.info(`Disconnected from MongoDB @ ${this.dbURI}`);
    });
    connection.on('close', () => {
      logger.info(`Client MongoDB closed @ ${this.dbURI}`);
    });
    connection.on('close', () => {
      logger.info(`Client MongoDB closed @ ${this.dbURI}`);
    });
  }

  bindModels(directory) {
    fs
      .readdirSync(this.modelDirectory)
      .filter((file) => (!['.', 'index.js', 'schemas', directory].includes(file)))
      .forEach((file) => {
        const [name] = file.split('.');
        const model = `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
        const modelPath = path.join(this.modelDirectory, file);
        const schema = require(modelPath);
        this.instance.model(model, schema);
      });
  }


  connect () {
    if (this.instance === false) {
      this.instance = mongoose.createConnection(this.dbURI, this.dbOption)
      this.instance
      .then(() => {
        logger.info(`Instance started @ ${this.dbURI}`);
      })
      .catch(err => {
        logger.error(`Error on start mongo connection @ ${this.dbURI}: ${err.message}`);
      });
      this.bindModels(this.modelDirectory)
      this.setNotifications(this.instance.client)
    }
    return true
  }

}

module.exports = MongoDatabase
