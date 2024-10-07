const random = require('../../libs/random');

jest.mock('uuid', () => ({
  v4: jest.fn()
}));

const uuid = require('uuid')

test('Get random string', () => {
  uuid.v4.mockReturnValue('string');
  expect(random()).toBe('string');
});

