const moment = require("moment-timezone");

const convertToTz = async (params) => {
  try {
    let tz = params?.tz ? params.tz : TZ;
    let format = params?.format ? params.format : "";
    let [hour, minute, second] = params?.time ? params?.time.split(":") : [moment(params.date).tz(tz).hour(), moment(params.date).tz(tz).minute(), moment(params.date).tz(tz).second()]
    let convertedDate = moment(params.date).tz(tz).hour(hour).minute(minute).second(second).format(format);
    return convertedDate;
  } catch (error) {
    logger.error("Error - convertToTz", error);
    throw new Error(error);
  }
};

module.exports = {
  convertToTz,
};
