const service = {};
const auth0 = require('./auth0');

service.loggedUsers = {};

service.getUser = async (modelsService, accessToken) => {
  try {
    // Get Auth0 user
    let auth0User = null;
    if (!accessToken) {
      return res.status(403).json({ error: 'No credentials sent!' });
    }
    auth0User = service.loggedUsers[accessToken];
    if (!auth0User) {
      const res = await auth0.get('/userinfo', { headers: { 'Authorization': accessToken } });
      if (!res.data) {
        return res.status(401).json({ error: 'No user found!' });
      }
      service.loggedUsers[accessToken] = res.data;
      auth0User = res.data;
    }
    // Get DB person
    const Person = modelsService.getModel('Person');
    let person = await Person.findOne({ email: auth0User.email })
      .populate({ path: 'companiesAsDirector companiesAsShareholder companiesAsAccountant', select: 'name url' });
    if (!person) {
      // Create new person
      const objSchema = {
        email: auth0User.email
      }
      const newPerson = new Person(objSchema);
      person = await newPerson.save();
    }
    const user = {
      ...auth0User,
      person: {
        ...person._doc
      }
    };

    return { statusCode: 200, data: user };
  }
  catch (err) {
    return { statusCode: 500, data: err };
  }

}

module.exports = service;