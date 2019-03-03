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
          .catch(err => { res.status(500).send(err) });
      });
    app.routesInfo['Invoice'].push({ model: 'Invoice', name: 'Add invoice', method: 'POST', url: url, body: defaultSchemas.invoice });
  }

  const registerUpdateInvoice = () => {
    const url = '/api/invoice/:invoiceId';
    app.put(url,
      (req, res) => {
        service.updateInvoice(modelsService, req.params.invoiceId, req.body)
          .then(result => res.status(result.statusCode).send(result.data))
          .catch(err => { res.status(500).send(err) });
      });
    app.routesInfo['Invoice'].push({ model: 'Invoice', name: 'Update invoice', method: 'PUT', url: url, body: defaultSchemas.invoice });
  }

  const registerDeleteInvoice = () => {
    const url = '/api/invoice/:invoiceId';
    app.delete(url,
      (req, res) => {
        service.deleteInvoice(modelsService, req.params.invoiceId)
          .then(result => res.status(result.statusCode).send(result.data))
          .catch(err => { res.status(500).send(err) });
      });
    app.routesInfo['Invoice'].push({ model: 'Invoice', name: 'Delete invoice', method: 'DELETE', url: url });
  }

  app.routesInfo['Invoice'] = [];
  registerSearchInvoices();
  registerAddInvoice();
  registerUpdateInvoice();
  registerDeleteInvoice();

};