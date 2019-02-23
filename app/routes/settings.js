const service = require('../services/settings.service');
const defaultSchemas = require('./defaultSchemas');

module.exports = (app, modelsService) => {

  const registerGetSettings = () => {
    const url = '/api/settings';
    app.get(url,
      (req, res) => {
        service.getSettings(modelsService)
          .then(result => res.status(result.statusCode).send(result.data))
          .catch(err => res.status(500).send(err));
      });
    app.routesInfo['Settings'].push({ model: 'Settings', name: 'Get settings', method: 'GET', url: url });
  }

  const registerAddInvoice = () => {
    const url = '/api/settings';
    app.put(url,
      (req, res) => {
        service.updateSettings(modelsService, null, req.body)
          .then(result => res.status(result.statusCode).send(result.data))
          .catch(err => { console.log(err); res.status(500).send(err) });
      });
    app.routesInfo['Settings'].push({ model: 'Settings', name: 'Update Settings', method: 'PUT', url: url, body: defaultSchemas.settings });
  }

  app.routesInfo['Settings'] = [];
  registerGetSettings();
  registerAddInvoice();

};