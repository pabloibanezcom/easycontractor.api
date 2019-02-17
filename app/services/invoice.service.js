const paginateResults = require('../util/paginateResults');
const service = {};

service.searchInvoices = async (modelsService, searchBody) => {
  const searchParams = {
    filter: {
    },
    sort: searchBody.sort || '',
    select: searchBody.select || '',
    populate: searchBody.populate || ''
  };
  let invoices = await modelsService.getModel('Invoice')
    .find(searchParams.filter)
    .sort(searchParams.sort)
    .select(searchParams.select)
    .populate(searchParams.populate);
  return { statusCode: 200, data: paginateResults(invoices, searchBody.pagination) };
}

service.addInvoice = async (modelsService, invoiceBody) => {
  const Invoice = await modelsService.getModel('Invoice');
  const objSchema = {
    issuedDate: invoiceBody.issuedDate,
    paymentDate: invoiceBody.paymentDate,
    client: invoiceBody.client,
    amountNet: invoiceBody.amountNet,
    amountVAT: invoiceBody.amountVAT,
    amountGross: invoiceBody.amountGross,
  }
  const invoice = new Invoice(objSchema);
  const doc = await invoice.save();
  return { statusCode: 200, data: doc };
}

module.exports = service;