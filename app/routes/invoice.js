const service = require('../services/invoice.service');
const defaultSchemas = require('./defaultSchemas');

module.exports = (app, modelsService) => {

  const registerSearchInvoices = () => {
    const url = '/api/invoice/search';
    app.post(url,
      (req, res) => {
        service.searchInvoices(modelsService, req.body)
          .then(result => res.status(result.statusCode).send(result.data))
          .catch(err => res.status(500).send(err));
      });
    app.routesInfo['Invoice'].push({ model: 'Invoice', name: 'Search invoices', method: 'POST', url: url, body: defaultSchemas.invoiceSearch });
  }

  const registerAddInvoice = () => {
    const url = '/api/invoice';
    app.post(url,
      (req, res) => {
        service.addInvoice(modelsService, req.body)
          .then(result => res.status(result.statusCode).send(result.data))
          .catch(err => { console.log(err); res.status(500).send(err) });
      });
    app.routesInfo['Invoice'].push({ model: 'Invoice', name: 'Add invoice', method: 'POST', url: url, body: defaultSchemas.invoice });
  }

  app.routesInfo['Invoice'] = [];
  registerSearchInvoices();
  registerAddInvoice();

};