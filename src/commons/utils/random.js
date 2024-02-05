//* IMPORT
const {
  app: { radomPassword },
} = require("../../commons/configs/app.config");

const generateRandomPassword = (length = 20) => {
  const charsetLength = radomPassword.length;

  const password = Array.from({ length }, () =>
    radomPassword.charAt(Math.floor(Math.random() * charsetLength))
  ).join("");

  return password;
};

module.exports = { generateRandomPassword };
