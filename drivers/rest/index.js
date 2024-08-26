
const axios = require('axios');
const urlValidator = require('valid-url');

module.exports = class Rest {
  constructor(
    host, 
    base = '/', 
    client = 'Unknown', 
    app = 'Unknown', 
    headers = {},
    logger = console,
  ) {
    if (Rest.instance) {
      return Rest.instance;
    }
    
    this.app = app;
    this.client = client;
    this.host = `${host}${base}`;
    this.logger = logger

    if (!urlValidator.isUri(this.host)) {
      throw new Error(`${this.host} is Invalid`);
    }

    this.headers = { 
      'Content-Type': 'application/json',
      'client-name': this.name,
      'app-name': this.app,
      ...headers, 
    }
    
    this.axios = axios.create({
      baseURL: this.host,
      headers: this.headers,
    });

    Rest.instance = this;
  }

  call(route, method, data, config) {
    switch (method.toUpperCase()) {
      case 'POST':
        return this.axios.post(route, data, config);
      case 'PUT':
        return this.axios.put(route, data, config);
      case 'PATCH':
          return this.axios.patch(route, data, config);
      case 'DELETE':
        return this.axios.delete(route, data, config);
      default:
        return this.axios.get(route, config);
    }
  }

  send(route = '', method = 'get', data = {}, config = {}) {
    const { logger, client, host } = this;
    const verb = method.toUpperCase();

    const request = `${client} - [${verb}] ${host}${route}`;

    logger.info(`Requesting: ${request}`)

    return this.call(route, verb, data, config)
      .then((response) => {
        logger.debug(`Success: ${request}`);
        
        if (response)
          return this.constructor.response(response);

        throw new Error(`Service ${client} return empty response`);
      })

      .catch(({ response, code }) => {
        logger.error(`Fail (${code}): ${request}`);
        
        if (response && response?.status <= 200)
          return this.constructor.response(response);

        if(response)
          return Promise.reject(this.constructor.response(response));

        throw new Error(`Service ${this.name} is Down: ${code}`);
      });
  }

  static response({ data, status }) {
    return { data, status: parseInt(status, 10) };
  }
};