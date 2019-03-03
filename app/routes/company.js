const service = require('../services/company.service');
const calendarService = require('../services/calendar.service');
const defaultSchemas = require('./defaultSchemas');

module.exports = (app, modelsService) => {

  const registerAddCompany = () => {
    const url = '/api/company';
    app.post(url,
      (req, res) => {
        service.addCompany(modelsService, req.body)
          .then(result => res.status(result.statusCode).send(result.data))
          .catch(err => res.status(500).send(err));
      });
    app.routesInfo['Company'].push({ model: 'Company', name: 'Add company', method: 'POST', url: url, body: defaultSchemas.company });
  }

  const registerAddPersonToCompany = () => {
    const url = '/api/company/:companyId/person';
    app.put(url,
      (req, res) => {
        service.addPersonToCompany(modelsService, req.params.companyId, req.body)
          .then(result => res.status(result.statusCode).send(result.data))
          .catch(err => res.status(500).send(err));
      });
    app.routesInfo['Company'].push({ model: 'Company', name: 'Add person to company', method: 'PUT', url: url, body: defaultSchemas.addPersonToCompany });
  }

  const registerGetCalendar = () => {
    const url = '/api/company/:companyId/calendar/:year/:month';
    app.get(url,
      (req, res) => {
        calendarService.companyCalendar(modelsService, req.params.companyId, req.params.year, req.params.month)
          .then(result => res.status(result.statusCode).send(result.data))
          .catch(err => res.status(500).send(err));
      });
    app.routesInfo['Company'].push({ model: 'Company', name: 'Get company calendar', method: 'GET', url: url });
  }

  app.routesInfo['Company'] = [];
  registerAddCompany();
  registerAddPersonToCompany();
  registerGetCalendar();
};