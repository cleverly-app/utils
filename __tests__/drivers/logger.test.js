const Logger = require('../../drivers/logger')

const { levels, colors, date } = require('../../drivers/logger/constants');

jest.mock('winston', () => ({
  format: {
    combine: jest.fn(), 
    timestamp: jest.fn(), 
    printf: jest.fn(),
    colorize: jest.fn(), 
    align: jest.fn()
  },
  addColors: jest.fn(),
  createLogger: jest.fn(() => (
    {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    }
  )),
  transports: {
    Console: jest.fn()
  }
}));

const winston = require('winston');


test('Singleton', () => {
  const instanceOne = new Logger('test', 'test');
  const instanceTwo = new Logger('test');
  expect(instanceOne).toBe(instanceTwo);
});


test('Initialziation', () => {
  const instance = new Logger('test');

  expect(instance.environment).toBe('test');
  expect(winston.addColors).toHaveBeenCalledWith({ levels, colors })
  expect(winston.createLogger).toHaveBeenCalledWith({
    levels,
    level: 'test',
    format: undefined,
    transports: [new winston.transports.Console()],
  })
});
