//* IMPORT
const {
  app: { radomPassword },
} = require("../../commons/configs/app.config");

const generateRandomString = (length = 10) => {
  const charsetLength = radomPassword.length;

  const password = Array.from({ length }, () =>
    radomPassword.charAt(Math.floor(Math.random() * charsetLength))
  ).join("");

  return password;
};

module.exports = { generateRandomString };
