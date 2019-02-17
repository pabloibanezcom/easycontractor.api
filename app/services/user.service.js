const service = {};
const auth0 = require('./auth0');

service.loggedUsers = {};

service.getUser = async (modelsService, accessToken) => {
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
  // Get DB user
  const User = modelsService.getModel('User');
  let dbUser = await User.findOne({ sub: auth0User.sub });
  if (!dbUser) {
    // Create new DB user
    const objSchema = {
      sub: auth0User.sub,
      role: 'Director'
    }
    const newDbUser = new User(objSchema);
    dbUser = await newDbUser.save();
  }
  const user = {
    ...auth0User,
    id: dbUser.id,
    role: dbUser.role
  };

  return { statusCode: 200, data: user };
}

module.exports = service;