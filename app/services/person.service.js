const service = {};

service.addPerson = async (modelsService, personBody) => {
  try {
    const Person = modelsService.getModel('Person');
    const objSchema = {
      email: personBody.email,
      firstName: personBody.firstName,
      lastName: personBody.lastName,
      countryResidence: personBody.countryResidence,
      address: personBody.address,
      dateOfBirth: personBody.dateOfBirth,
      nationality: personBody.nationality,
      phone: personBody.phone
    }
    const person = new Person(objSchema);
    const doc = await person.save();
    return { statusCode: 200, data: doc };
  }
  catch (err) {
    return { statusCode: 500, data: err };
  }
}

module.exports = service;