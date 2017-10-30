const moment = require("moment");

const _dateValidation = (date) => {
  return moment(date, 'YYYY-MM-DD', true);
}

const _dateTimeValidation = (date) => {
  return moment(date, 'YYYY-MM-DDTHH:mm:ss.sssZ', true);
}

module.exports = {
  date: _dateValidation,
  dateTime: _dateTimeValidation
}