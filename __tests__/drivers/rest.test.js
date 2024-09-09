const Rest = require('../../drivers/rest');

const { timeout } = require('../../drivers/rest/constants')

const logger = {
  debug: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
};


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
const client = '/test';
const app = 'test';
const headers = {};

const path = '/test';
const data = { param1: 'param1' };


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

  expect(instanceOne.axios.get).toHaveBeenCalledWith("", { timeout })

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

  expect(instanceOne.axios.get).toHaveBeenCalledWith("", config)

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

  expect(instanceOne.axios.get).toHaveBeenCalledWith(`${base}${path}`, { timeout })

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

  expect(instanceOne.axios.post).toHaveBeenCalledWith(`${base}${path}`, data, { timeout })

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

  expect(instanceOne.axios.put).toHaveBeenCalledWith(`${base}${path}`, data, { timeout })

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

  expect(instanceOne.axios.patch).toHaveBeenCalledWith(`${base}${path}`, data, { timeout })

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

  expect(instanceOne.axios.delete).toHaveBeenCalledWith(`${base}${path}`, { data, timeout })

});