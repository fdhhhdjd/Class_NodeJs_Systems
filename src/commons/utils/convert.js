const formatPhone = (phone) => {
  const formattedPhone = phone.startsWith("0")
    ? `+84${phone.substring(1)}`
    : `+${phone}`;
  return formattedPhone;
};
module.exports = { formatPhone };
