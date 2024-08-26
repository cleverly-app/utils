const axios = require('axios');
const urlValidator = require('valid-url');
const logger = require('./logger.driver');

module.exports = class Rest {
  constructor(host, base = '/', headers = {}, name, app, id) {
    this.host = `${host}${base}`;
    if (!urlValidator.isUri(this.host)) {
      throw new Error(`${this.host} is Invalid`);
    }
    this.axios = axios.create({
      baseURL: this.host,
      headers: { 
        'Content-Type': 'application/json',
        'app-name': app,
        ...headers, 
      },
    });
    this.name = name;
    this.id = id;
  }

  call() {
    switch (this.method.toUpperCase()) {
      case 'POST':
        return this.axios.post(this.route, this.data);
      case 'PUT':
        return this.axios.put(this.route, this.data);
      case 'PATCH':
          return this.axios.patch(this.route, this.data);
      case 'DELETE':
        return this.axios.delete(this.route, this.data);
      default:
        return this.axios.get(this.route);
    }
  }

  send($route = '', method = 'get', data = {}) {
    this.route = $route;
    this.method = method;
    this.data = data;
    this.info = `Request to ${this.name}: [${this.method.toUpperCase()}] to ${this.host}${this.route}`
    return this.call()
      .then(this.then.bind(this))
      .catch(this.catch.bind(this));
  }

  then(response) {
    logger.debug(`Success ${this.info}`)
    if (response) {
      return this.constructor.response(response);
    }
    throw new Error(`Service ${this.name} return empty response`);
  }

  catch({ response, code }) {
    logger.error(`Fail ${this.info} - ${code}`)

    if (response) return this.constructor.response(response);

    throw new Error(`Service ${this.name} is Down: ${code}`);
  }

  static response({ data, status }) {
    return { data, status: parseInt(status, 10) };
  }
};