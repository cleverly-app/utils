/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const { getHost } = require('./utils');

const { dbOption, getLoggerLevel } = require('./constants');

const { environments } = require('../constants');
const logger = require('./logger.driver');
const { env, mongo, debug } = environments;
const {
  host, port, database, user = false, pass = false, prefix, poolsize, timeout
} = mongo;

class MongoDatabase {
  constructor(
    debug,
    directory,
    host,
    port, 
    db,
    config = {},
    logger = console,
  ) {
    if (MongoDatabase.instance) {
      return MongoDatabase.instance;
    }

    this.directory = directory;
    this.debug = debug;
    this.name = db;
    this.host = getHost(host, port)
    this.dbURI = `mongodb://${this.host}${this.port}/${this.db}`;
    this.logger = logger;
    this.loggerLevel = getLoggerLevel(this.debug);

    this.db = false;

    this.dbOption = {
      ...dbOption,
      ...config,
      logger: this.logger,
      loggerLevel: this.loggerLevel,
    };
    
    MongoDatabase.instance = this;
    
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

  bindModels() {
    const exclude = [
      '.',
      'index.js',
      'schemas',
      directory
    ];

    return fs
      .readdirSync(this.directory)
      .filter((file) => (!exclude.includes(file)))
      .forEach((file) => {
        const [name] = file.split('.');
        const model = `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
        const modelPath = path.join(this.modelDirectory, file);
        const schema = require(modelPath);
        this.instance.model(model, schema);
      });
  }


  connect () {
    if (this.db === false) {
      this.db = mongoose.createConnection(this.dbURI, this.dbOption)
        .then(() => {
          this.logger.info(`Instance started @ ${this.dbURI}`)
          this.bindModels(this.di)
        })
        .catch(err => (
          this.logger.error(`Error starting connection @ ${this.dbURI}: ${err.message}`)
        ));
        this.setNotifications(this.db.client)
    }
    return true
  }

}

module.exports = MongoDatabase
