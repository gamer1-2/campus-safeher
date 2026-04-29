const bcrypt = require('bcryptjs');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@campussafeher.com";
const ADMIN_PASSWORD_PLAIN = process.env.ADMIN_PASSWORD || "admin123";

const salt = bcrypt.genSaltSync(10);
const ADMIN_PASSWORD_HASHED = bcrypt.hashSync(ADMIN_PASSWORD_PLAIN, salt);

module.exports = {
  ADMIN_EMAIL,
  ADMIN_PASSWORD_HASHED
};
