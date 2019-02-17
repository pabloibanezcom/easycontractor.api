const service = require('../services/user.service');

module.exports = (app, modelsService) => {

  const registerGetUser = () => {
    const url = '/api/user';
    app.get(url,
      (req, res) => {
        service.getUser(modelsService, req.headers.authorization)
          .then(result => res.status(result.statusCode).send(result.data))
          .catch(err => res.status(500).send(err));
      });
    app.routesInfo['User'].push({ model: 'User', name: 'Get user from token', method: 'GET', url: url, });
  }

  app.routesInfo['User'] = [];
  registerGetUser();
};