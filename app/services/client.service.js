const companyService = require('./company.service');

const service = {};

service.searchClients = async (modelsService, body) => {
  try {
    const clients = await modelsService.getModel('Client').find({ company: body.companyId });
    return { statusCode: 200, data: clients };
  }
  catch (err) {
    return { statusCode: 500, data: err };
  }
}

service.addClient = async (modelsService, clientBody) => {
  try {
    const Client = modelsService.getModel('Client');
    const objSchema = {
      key: clientBody.key,
      name: clientBody.name,
      sector: clientBody.sector,
      web: clientBody.web,
      address: clientBody.address,
      logo: clientBody.logo,
      company: clientBody.company
    }
    const client = new Client(objSchema);
    const doc = await client.save();
    await companyService.addElementToCompany(modelsService, clientBody.company, 'clients', doc.id);
    return { statusCode: 200, data: doc };
  }
  catch (err) {
    return { statusCode: 500, data: err };
  }
}

service.addPersonToClient = async (modelsService, clientId, requestBody) => {
  try {
    const Client = modelsService.getModel('Client');
    const Person = modelsService.getModel('Person');
    const client = await Client.findById(clientId);
    const person = await Person.findById(requestBody.personId);
    if (!person) {
      return { statusCode: 400, data: 'There is no person for that id' };
    }
    if (client.people.find(p => p.id === requestBody.personId)) {
      return { statusCode: 400, data: 'Person already in that company' };
    }
    client.people.push(requestBody.personId);
    await client.save();
    return { statusCode: 200, data: `${person.firstName} ${person.lastName} has been added to ${client.name}` };
  }
  catch (err) {
    return { statusCode: 500, data: err };
  }
}

module.exports = service;