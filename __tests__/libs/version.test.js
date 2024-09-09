const version = require('../../libs/version');

jest.mock('git-repo-info', () => jest.fn());

const git = require('git-repo-info')


test('Get version from abbreviatedSha', () => {
  git.mockReturnValue({
    abbreviatedSha: 'abc',
  });
  expect(version()).toBe('abc');
});


test('Get version from lastTag', () => {
  git.mockReturnValue({
    abbreviatedSha: 'abc',
    lastTag: '0.0.1'
  });

  expect(version()).toBe('0.0.1');
});


test('Get version from tag', () => {
  git.mockReturnValue({
    abbreviatedSha: 'abc',
    lastTag: '0.0.1',
    tag: '1.0.0'
  });

  expect(version()).toBe('1.0.0');
});