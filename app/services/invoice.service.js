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
  try {
    const Invoice = modelsService.getModel('Invoice');
    const Client = modelsService.getModel('Client');
    // Check if client exists
    const client = await Client.findById(invoiceBody.client);
    if (!client) {
      return { statusCode: 404, data: 'There is no client for that id' };
    }
    const objSchema = {
      issuedDate: invoiceBody.issuedDate,
      paymentDate: invoiceBody.paymentDate,
      client: client.id,
      amountNet: invoiceBody.amountNet,
      amountVAT: invoiceBody.amountVAT,
      amountGross: invoiceBody.amountGross,
    }
    const invoice = new Invoice(objSchema);
    const doc = await invoice.save();
    // Add invoice to client document
    client.invoices.push(doc._id);
    await client.save();
    return { statusCode: 201, data: doc };
  }
  catch (err) {
    return { statusCode: 500, data: err };
  }
}

service.updateInvoice = async (modelsService, invoiceId, invoiceBody) => {
  try {
    const invoice = await modelsService.getModel('Invoice').findByIdAndUpdate(invoiceId, invoiceBody);
    return { statusCode: 200, data: invoice };
  }
  catch (err) {
    return { statusCode: 500, data: err };
  }
}

service.deleteInvoice = async (modelsService, invoiceId) => {
  try {
    const Invoice = modelsService.getModel('Invoice');
    const Client = modelsService.getModel('Client');
    const invoice = await Invoice.findById(invoiceId).populate({ path: 'client', select: 'name' });
    if (!invoice) {
      return { statusCode: 404, data: 'There is no invoice for that id' };
    }
    await invoice.remove();
    await Client.update({ _id: invoice.client.id }, { $pullAll: { invoices: [invoiceId] } });
    return { statusCode: 200, data: invoiceId };
  }
  catch (err) {
    return { statusCode: 500, data: err };
  }
}

module.exports = service;