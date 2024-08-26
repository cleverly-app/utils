const Rest = require('../../drivers/rest')


module.exports = class subscriptionConector extends Rest {
  constructor(host, app, headers, templates, logger) {
    super(host, '/v1', 'Comms', app, headers, logger);
    this.templates = templates;
  }

  check(tenant) {
    return this.send(`/subscription/${tenant}/valid`)
   }
 
  create(tenant, company, description, firstName, lastName, email) {
     const body = {
       tenant, 
       company,
       description,
       owner_first_name: firstName,
       owner_last_name: lastName,
       owner_email: email,
     }
     return this.send(`/subscription`, 'post', body)
   }
 
  get(tenants = []) {
    const query = tenants.join(',');
    return this.send(`/subscription?tenants=${query}`);
  }

};
