const JWT = {
  ADMIN_SECRET: "myjwtadminsecret",
  USER_SECRET: "myjwtadminsecret",
  EXPIRES_IN: "24h",
  REFRESH_EXPIRES_IN: "30d",
  JWT_SECRET: "your_jwt_secret_key_here",
  CLIENT_EXPIRES_IN: "30d",

  CHANGE_PASSWORD_SUCCESS: 1,
  PASSWORD_USE_ERROR: 2,
  PASSWORD_NOT_MATCH: 0,
};
const ROLE = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  SUB_ADMIN: "SUB_ADMIN",
  CANDIDATE: "CANDIDATE",
  EMPLOYER: "EMPLOYER",
};

const PLATFORM = {
  ADMIN: ["ADMIN", "SUPER_ADMIN", "SUB_ADMIN"],
  WEB_AND_DEVICE: ["CANDIDATE", "EMPLOYER"],
};

const MODULE = {
  ADMIN: "admin",
  CLIENT: "client",
  DEVICE: "device",
};
const LOGIN = {
  SUCCESS: 0,
  PASSWORD_WRONG: 3,
  ACCOUNT_NOT_FOUND: 1,
  ACCOUNT_NOT_VERIFIED: 2,
  ACCOUNT_DEACTIVATED:4
};

const OTPTYPE = {
  SIGNUPOTP: 'signupOtp',
  FORGETPASSOTP: 'forgetPassOtp'

};
const ADD_TIME = {
  ADD: 10,
  YEAR: 2,
  MONTHS: 1,
  HOURS: 24,
}

const OTP_EXPIRY_TIME = {
  MINUTE: 2
}

const EMPLOYER_STATUS = {
  PENDING: 1,
  APPROVED: 2,
  DECLINE: 3,
}

const CANDIDATE_STATUS = {
  PENDING: 1,
  APPROVED: 2,
  DECLINE: 3,
}


const EMPLOYER_MAIL_STATUS = {
  PENDING: "pending approval ",
  APPROVED: "approved",
  DECLINE: "declined",
}

const SSO_REGISTER = 'ssoRegister'
module.exports = {
  JWT,
  ROLE,
  PLATFORM,
  MODULE,
  LOGIN,
  OTPTYPE,
  SSO_REGISTER,
  ADD_TIME,
  EMPLOYER_STATUS,
  EMPLOYER_MAIL_STATUS,
  OTP_EXPIRY_TIME,
  CANDIDATE_STATUS
};
