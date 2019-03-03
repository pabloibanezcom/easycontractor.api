const service = {};
const moment = require('moment');

service.isDateInMonth = (date, year, month) => {
  return moment(date).isSameOrAfter(moment([year, month - 1])) && moment(date).isBefore(moment([year, month]));
}

module.exports = service;