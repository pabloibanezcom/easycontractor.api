const service = require('../services/person.service');
const defaultSchemas = require('./defaultSchemas');

module.exports = (app, modelsService) => {

  const registerAddPerson = () => {
    const url = '/api/person';
    app.post(url,
      (req, res) => {
        service.addPerson(modelsService, req.body)
          .then(result => res.status(result.statusCode).send(result.data))
          .catch(err => res.status(500).send(err));
      });
    app.routesInfo['Person'].push({ model: 'Person', name: 'Add person', method: 'POST', url: url, body: defaultSchemas.person });
  }

  app.routesInfo['Person'] = [];
  registerAddPerson();
};