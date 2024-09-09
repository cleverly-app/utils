
const axios = require('axios');
const urlValidator = require('valid-url');

const { timeout } = require('./constants');

module.exports = class Rest {
  constructor(
    host, 
    base = '/', 
    client = 'Unknown', 
    app = 'Unknown', 
    headers = {},
    logger = console,
    config = {},
  ) {
    this.app = app;
    this.client = client;
    this.host = host;
    this.base = base;
    this.logger = logger;
    this.config = {
      timeout,
      ...config,
    }

    if (!urlValidator.isUri(this.host)) {
      throw new Error(`${this.host} is Invalid`);
    }

    this.headers = { 
      'Content-Type': 'application/json',
      'client-name': this.client,
      'app-name': this.app,
      ...headers, 
    }
    
    this.axios = axios.create({
      baseURL: this.host,
      headers: this.headers,
    });
  }

  call(route, method, data, config) {
    this.logger.debug(route);
    this.logger.debug(method);
    this.logger.debug(data);
    this.logger.debug(config);
    switch (method.toUpperCase()) {
      case 'POST':
        return this.axios.post(route, data, config);
      case 'PUT':
        return this.axios.put(route, data, config);
      case 'PATCH':
          return this.axios.patch(route, data, config);
      case 'DELETE':
        return this.axios.delete(route, { data, ...config });
      default:
        return this.axios.get(route, config);
    }
  }

  send(route = '/', method = 'get', data = {}, config = {}) {
    const { logger, client, host } = this;
    const verb = method.toUpperCase();
    const base = route === '' ? '' : this.base;
    const path = `${base}${route}`

    const request = `${client} - [${verb}] ${host}${path}`;

    logger.info(`Requesting: ${request}`);

    return this.call(path, verb, data, { ...this.config, ...config })
      .then((response) => {
        logger.debug(`Success: ${request}`);
        
        if (response)
          return this.constructor.response(response);

        throw new Error(`Service ${client} return empty response`);
      })  
      .catch(({ response, code }) => {
        logger.error(`Fail (${code} - ${response?.status || '000'}]): ${request}`);
        
        if(response)          
          return this.constructor.response(response);

        throw new Error(`Service ${client} is Down: ${code}`);
      });
  }

  static response({ data, status }) {
    return { data, status: parseInt(status, 10) };
  }

  health(config = {}) {
    return this.send('', 'get', {}, config)
      .then(({ data }) => data)
      .catch(e => {
        this.logger.debug(e)
        return {
          running: false,
          client: this.client,
          app: this.app,
          error: {
            message: e?.message,
            e,
          }
        }
      })
  }
};