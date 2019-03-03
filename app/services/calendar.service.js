const service = {};
const moment = require('moment');
const dateService = require('./date.service');

service.companyCalendar = async (modelsService, companyId, year, month) => {
  try {
    const company = await modelsService.getModel('Company')
      .findById(companyId)
      .populate({ path: 'clients', select: 'name logo workingDays' });
    if (!company) {
      return res.status(401).json({ error: 'No company found!' });
    }
    const daysInMonth = {};
    for (let i = 0; i < moment().daysInMonth(`${year}-${month}`, 'YYYY-MM'); i++) {
      daysInMonth[i + 1] = { loggedWork: [] };
    }

    // Get working days
    company.clients.forEach(client => {
      client.workingDays.filter(workingDay => dateService.isDateInMonth(workingDay.date, year, month)).forEach(workingDay => {
        daysInMonth[moment(workingDay.date).date()].loggedWork.push({ client: { _id: client._id, name: client.name, logo: client.logo }, time: workingDay.time });
      });
    });

    return { statusCode: 200, data: daysInMonth };
  }
  catch (err) {
    return { statusCode: 500, data: err };
  }
}

module.exports = service;