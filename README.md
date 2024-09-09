# utils
Lib for utils cross the ecosystem

# Contibute
1. Clone the repo
1. Add/Update feature
1. Validate the tests
1. Commit to branch 
1. Create pull request
1. Validate funcitonaluty installing the branch in anyproject
1. Merge pull request
1. Create version

# Guide to start
* Add to your package.json the following line:
`"utils": "git+https://github.com/cleverly-app/utils.git#{{tag or branch}}"`

### Peer dependencies:

You should install manually the following dependencies on depend what component you will to use:
* libs/versiojn
  *  "git-repo-info": "^2.1.1"

* drivers/rest
  * "axios": "^1.4.0",
  * "valid-url": "^1.0.9"

* drivers/logger
  * "winston": "^3.9.0"

* database/mongo
  * "mongoose": "^5.11.13"

* connectors/Comms/http
  * "axios": "^1.4.0",
  * "valid-url": "^1.0.9"



