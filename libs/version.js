const git = require('git-repo-info')

module.exports = () => {
  const { tag, lastTag, abbreviatedSha } = git();

  return tag || lastTag || abbreviatedSha
}