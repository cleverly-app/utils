const Rest = require('../../drivers/rest')


module.exports = class commsConnector extends Rest {
  constructor(host, app, headers, templates, logger) {
    super(host, '/v1', 'Comms', app, headers, logger);
    this.templates = templates;
  }


  sendMail(to, template, data) {
    const body = {
      destination: to,
      template_id: this.templates[template] || '',
      data   
    }
    this.send('/mail', 'post', body)
      .then(({ status, data }) => {
        const { request_id, message  } = data;
        this.logger.info(
          `Mail sent to ${body.destination} in ${request_id} with status ${status}: ${message}
        `)
      })
      .catch((error) => {
        const { status, data } = error;

        if(status) {
          this.logger.error(`Mail send error [${status}]: ${data?.message || data}`)
          if(data?.errors){
            this.logger.debug(data);
            this.logger.debug(data?.errors);
            this.logger.debug(data?.stack);
          }
        } else {
          this.logger.error(`Mail send error: ${error}`);
        }
      });
  }
};
