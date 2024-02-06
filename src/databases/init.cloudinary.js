//* LIB
const cloudinary = require("cloudinary");

//* IMPORT
const {
  cloud: { name, api_key, api_secret },
} = require("../commons/configs/cloudinary.config");

cloudinary.config({
  cloud_name: name,
  api_key,
  api_secret,
});

checkCloudinaryConnectivity = async () => {
  try {
    const pingResponse = await cloudinary.api.ping();
    console.info(
      "CLOUDINARY IS CONNECTED:",
      pingResponse?.status.toUpperCase()
    );
  } catch (error) {
    console.error("Error checking Cloudinary connectivity:", error);
  }
};

checkCloudinaryConnectivity();

module.exports = cloudinary;
