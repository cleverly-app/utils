/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const { getHost, getLoggerLevel, logDb } = require('./utils');

const { dbOption } = require('./constants')

class MongoDatabase {
  constructor(
    debug,
    directory,
    host,
    port, 
    db,
    user,
    pass,
    auth = { authSource: 'admin' },
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
    this.dbURI = `mongodb://${this.host}/${this.name}`;
    this.logger = logger;
    this.loggerLevel = getLoggerLevel(this.debug);

    this.db = false;

    this.dbOption = {
      ...dbOption,
      ...config,
      logger: this.log.bind(this),
      loggerLevel: this.loggerLevel,
    };
 
    if (user !== false && pass !== false) {
      config.auth = auth;
      config.user = user;
      config.pass = pass;
    }
    
    MongoDatabase.instance = this;
    
    this.connect();
  }

  log(message, detail) {
    logDb(this.logger, message, detail)
  }

  setNotifications() {
    const connection = this.db.client;

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
          this.logger.info(`Connection started @ ${this.dbURI}`)
          this.bindModels()
          this.setNotifications()
        })
        .catch(err => (
          this.logger.error(`Error starting connection @ ${this.dbURI}: ${err.message}`)
        ));
    }
    return true
  }

}

module.exports = MongoDatabase
