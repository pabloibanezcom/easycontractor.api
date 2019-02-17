const axios = require('axios');

const instance = axios.create({
  baseURL: `https://${process.env.AUTH0_DOMAIN}`
});

module.exports = instance;
