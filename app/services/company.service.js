const service = {};

service.addElementToCompany = async (modelsService, companyId, property, element) => {
  const company = await modelsService.getModel('Company').findById(companyId);
  if (!company[property].find(e => element)) {
    company[property].push(element);
    await company.save();
  }
}

service.addCompany = async (modelsService, companyBody) => {
  try {
    const Company = modelsService.getModel('Company');
    const objSchema = {
      name: companyBody.name,
      url: companyBody.url,
      companyNumber: companyBody.companyNumber,
      registeredAdress: companyBody.registeredAdress,
      incorporationDate: companyBody.incorporationDate
    }
    const company = new Company(objSchema);
    const doc = await company.save();
    return { statusCode: 200, data: doc };
  }
  catch (err) {
    return { statusCode: 500, data: err };
  }
}

service.addPersonToCompany = async (modelsService, companyId, requestBody) => {
  try {
    const Company = modelsService.getModel('Company');
    const Person = modelsService.getModel('Person');
    const company = await Company.findById(companyId);
    const person = await Person.findById(requestBody.personId);
    if (!person) {
      return { statusCode: 400, data: 'There is no person for that id' };
    }
    const propsToUpdate = getCompanyAndPersonPropsFromRole(requestBody.role);
    if (!propsToUpdate) {
      return { statusCode: 400, data: 'You must define a valid role' };
    }
    if (company[propsToUpdate.companyProp].find(p => p.id === requestBody.personId) ||
      (person[propsToUpdate.personProp]).find(c => c.id === companyId)) {
      return { statusCode: 400, data: 'Person already playing that role in that company' };
    }
    company[propsToUpdate.companyProp].push(requestBody.personId);
    person[propsToUpdate.personProp].push(companyId);
    await company.save();
    await person.save();
    return { statusCode: 200, data: `${person.firstName} ${person.lastName} has been added as ${requestBody.role} to ${company.name}` };
  }
  catch (err) {
    return { statusCode: 500, data: err };
  }
}

const getCompanyAndPersonPropsFromRole = (role) => {
  switch (role) {
    case 'director':
      return {
        companyProp: 'directors',
        personProp: 'companiesAsDirector'
      };
    case 'shareholder':
      return {
        companyProp: 'shareholders',
        personProp: 'companiesAsShareholder'
      };
    case 'accountant':
      return {
        companyProp: 'accountants',
        personProp: 'companiesAsAccountant'
      };
    default:
      return null;
  }
}


module.exports = service;