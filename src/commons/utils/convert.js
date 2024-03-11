const formatPhone = (phone) => {
  const formattedPhone = phone.startsWith("0")
    ? `+84${phone.substring(1)}`
    : `+${phone}`;
  return formattedPhone;
};

const splitUsername = (email) => {
  const username = email.substring(0, email.indexOf("@"));
  return username;
};

const getURIFromTemplate = (template, data) => {
  return template.replace(/\${(\w+)}/g, (_, key) => data[key]);
};

module.exports = { formatPhone, splitUsername, getURIFromTemplate };
