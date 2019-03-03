const service = require('../services/client.service');
const defaultSchemas = require('./defaultSchemas');

module.exports = (app, modelsService) => {

  const registerSearchClients = () => {
    const url = '/api/client/search';
    app.post(url,
      (req, res) => {
        service.searchClients(modelsService, req.body)
          .then(result => res.status(result.statusCode).send(result.data))
          .catch(err => res.status(500).send(err));
      });
    app.routesInfo['Client'].push({ model: 'Client', name: 'Search clients', method: 'POST', url: url, body: defaultSchemas.searchClients });
  }

  const registerAddClient = () => {
    const url = '/api/client';
    app.post(url,
      (req, res) => {
        service.addClient(modelsService, req.body)
          .then(result => res.status(result.statusCode).send(result.data))
          .catch(err => res.status(500).send(err));
      });
    app.routesInfo['Client'].push({ model: 'Client', name: 'Add client', method: 'POST', url: url, body: defaultSchemas.client });
  }

  const registerAddPersonToClient = () => {
    const url = '/api/client/:clientId/person';
    app.put(url,
      (req, res) => {
        service.addPersonToClient(modelsService, req.params.clientId, req.body)
          .then(result => res.status(result.statusCode).send(result.data))
          .catch(err => res.status(500).send(err));
      });
    app.routesInfo['Client'].push({ model: 'Client', name: 'Add person to client', method: 'PUT', url: url, body: defaultSchemas.addPersonToClient });
  }

  const registerAddWorkingDaysToClient = () => {
    const url = '/api/client/:clientId/days';
    app.put(url,
      (req, res) => {
        service.addWorkingDaysToClient(modelsService, req.params.clientId, req.body)
          .then(result => res.status(result.statusCode).send(result.data))
          .catch(err => res.status(500).send(err));
      });
    app.routesInfo['Client'].push({ model: 'Client', name: 'Add working days to client', method: 'PUT', url: url, body: defaultSchemas.addWorkingDaysToClient });
  }

  app.routesInfo = {};
  app.routesInfo['Client'] = [];
  registerSearchClients();
  registerAddClient();
  registerAddPersonToClient();
  registerAddWorkingDaysToClient();
};