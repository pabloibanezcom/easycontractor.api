const service = {};
const auth0 = require('./auth0');
const defaultSettings = require('../routes/defaultSchemas/settings.json');

service.getSettings = async (modelsService, accessToken) => {
  const Settings = modelsService.getModel('Settings');
  let settings = await Settings.findOne({});
  if (!settings) {
    newSettings = new Settings({ settings: defaultSettings });
    settings = await newSettings.save();
  }
  return { statusCode: 200, data: settings.settings };
}

service.updateSettings = async (modelsService, accessToken, newSettings) => {
  const Settings = modelsService.getModel('Settings');
  let settings = await Settings.findOne({});
  settings.settings = newSettings;
  await settings.save();
  return { statusCode: 202, data: 'Settings were update successfully' };
}

module.exports = service;