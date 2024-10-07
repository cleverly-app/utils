const Rest = require('../../drivers/rest');

const { timeout } = require('../../drivers/rest/constants')

const logger = {
  debug: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
};

jest.mock('uuid', () => ({
  v4: jest.fn()
}));

jest.mock('valid-url', () => ({
  isUri: jest.fn()
}));

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  })),
}));

const urlValidator = require('valid-url');
const axios = require('axios');

const host = 'host';
const base = '/test';
const client = 'test';
const app = 'test';
const headers = {};

const path = '/test';
const data = { param1: 'param1' };

const headersExpeceted = {
  trace_id: undefined
}


test('Initialization invalid host', () => {

  urlValidator.isUri.mockReturnValue(false);
  try {
    new Rest('invalid');
  } catch (e) {
    expect(e.message).toBe("invalid is Invalid");
  }
});

test('Initialization', () => {

  urlValidator.isUri.mockReturnValue(true);

  const instanceOne = new Rest(
    host,
    base,
    client,
    app,
    headers,
    logger,
  );

  expect(urlValidator.isUri).toHaveBeenCalledWith(host)
  expect(axios.create).toHaveBeenCalledWith({
    baseURL: host,
    headers: { 
      'Content-Type': 'application/json',
      'client-name': client,
      'app-name': app,
      ...headers, 
    }
  })

});

test('Healthcheck', () => {

  urlValidator.isUri.mockReturnValue(true);
  
  const instanceOne = new Rest(
    host,
    base,
    client,
    app,
    headers,
    logger,
  );
  
  instanceOne.axios.get.mockReturnValue(Promise.resolve({ data: "data" }));

  instanceOne.health()

  expect(instanceOne.axios.get).toHaveBeenCalledWith("", { timeout, headers: headersExpeceted })

});


test('Healthcheck Fail', async () => {

  urlValidator.isUri.mockReturnValue(true);
  
  const instanceOne = new Rest(
    host,
    base,
    client,
    app,
    headers,
    logger,
  );
  
  instanceOne.axios.get.mockReturnValue(Promise.reject({ data: "data" }));

  const health = await instanceOne.health();

  expect(health.running).toBe(false);
  expect(health.client).toBe(client);
  expect(health.app).toBe(app);
  expect(health.error.message).toBe('Service test is Down: undefined');

  expect(instanceOne.axios.get).toHaveBeenCalledWith("", { timeout, headers: headersExpeceted })

});


test('Healthcheck with 60000ms Timeout', () => {

  urlValidator.isUri.mockReturnValue(true);

  const config = { timeout: 60000 };
  
  const instanceOne = new Rest(
    host,
    base,
    client,
    app,
    headers,
    logger,
  );
  
  instanceOne.axios.get.mockReturnValue(Promise.resolve({ data: "data" }));

  instanceOne.health(config)

  expect(instanceOne.axios.get).toHaveBeenCalledWith("", { ...config, headers: headersExpeceted })

});


test('Get', () => {

  urlValidator.isUri.mockReturnValue(true);
  
  const instanceOne = new Rest(
    host,
    base,
    client,
    app,
    headers,
    logger,
  );
  
  instanceOne.axios.get.mockReturnValue(Promise.resolve({ data: "data" }));

  instanceOne.send(path, 'get');

  expect(instanceOne.axios.get).toHaveBeenCalledWith(`${base}${path}`, { timeout, headers: headersExpeceted  })

});


test('Post', () => {

  urlValidator.isUri.mockReturnValue(true);
  
  const instanceOne = new Rest(
    host,
    base,
    client,
    app,
    headers,
    logger,
  );
  
  instanceOne.axios.post.mockReturnValue(Promise.resolve({ data: "data" }));

  instanceOne.send(path, 'post', data);

  expect(instanceOne.axios.post).toHaveBeenCalledWith(`${base}${path}`, data, { timeout, headers: headersExpeceted  })

});

test('Put', () => {

  urlValidator.isUri.mockReturnValue(true);
  
  const instanceOne = new Rest(
    host,
    base,
    client,
    app,
    headers,
    logger,
  );
  
  instanceOne.axios.put.mockReturnValue(Promise.resolve({ data: "data" }));

  instanceOne.send(path, 'put', data);

  expect(instanceOne.axios.put).toHaveBeenCalledWith(`${base}${path}`, data, { timeout, headers: headersExpeceted  })

});


test('Patch', () => {

  urlValidator.isUri.mockReturnValue(true);
  
  const instanceOne = new Rest(
    host,
    base,
    client,
    app,
    headers,
    logger,
  );
  
  instanceOne.axios.patch.mockReturnValue(Promise.resolve({ data: "data" }));

  instanceOne.send(path, 'patch', data);

  expect(instanceOne.axios.patch).toHaveBeenCalledWith(`${base}${path}`, data, { timeout, headers: headersExpeceted  })

});


test('Delete', () => {

  urlValidator.isUri.mockReturnValue(true);
  
  const instanceOne = new Rest(
    host,
    base,
    client,
    app,
    headers,
    logger,
  );
  
  instanceOne.axios.delete.mockReturnValue(Promise.resolve({ data: "data" }));

  instanceOne.send(path, 'delete', data);

  expect(instanceOne.axios.delete).toHaveBeenCalledWith(`${base}${path}`, { data, timeout, headers: headersExpeceted  })

});


test('Create instance with TO 50000ms', () => {

  urlValidator.isUri.mockReturnValue(true);

  const config = { timeout: 50000 };
  
  const instanceOne = new Rest(
    host,
    base,
    client,
    app,
    headers,
    logger,
    config
  );
  
  instanceOne.axios.get.mockReturnValue(Promise.resolve({ data: "data" }));

  instanceOne.health();

  expect(instanceOne.axios.get).toHaveBeenCalledWith("", { ...config, headers: headersExpeceted })

});


test('Overwrite config for instance with TO 50000ms', () => {

  urlValidator.isUri.mockReturnValue(true);

  const config = { timeout: 50000 };
  const config2 = { timeout: 60000 };

  
  const instanceOne = new Rest(
    host,
    base,
    client,
    app,
    headers,
    logger,
    config
  );
  
  instanceOne.axios.get.mockReturnValue(Promise.resolve({ data: "data" }));

  instanceOne.health(config2);

  expect(instanceOne.axios.get).toHaveBeenCalledWith("", { ...config2, headers: headersExpeceted })

});

test('Sending traceId', () => {

  urlValidator.isUri.mockReturnValue(true);

  const config = { timeout: 50000 };

  const instanceOne = new Rest(
    host,
    base,
    client,
    app,
    headers,
    logger,
    config,
    'string'
  );
  
  instanceOne.axios.get.mockReturnValue(Promise.resolve({ data: "data" }));

  instanceOne.send(path, 'get', data, {}, 'string');

  expect(instanceOne.axios.get).toHaveBeenCalledWith(`${base}${path}`, { ...config, headers: { trace_id: 'string' } });

});