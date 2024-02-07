//* LIB
const fs = require("fs");
const firebase = require("firebase/compat/app");
require("firebase/compat/auth");

const rawData = fs.readFileSync("firebaseConfig.json");
const firebaseConfig = JSON.parse(rawData);

firebase.initializeApp(firebaseConfig);

const email = "example@example.com";
const password = "examplePassword";

firebase
  .auth()
  .signInWithEmailAndPassword(email, password)
  .then((_) => {
    console.log("CONNECT FIREBASE:", "OK");
  })
  .catch((error) => {
    console.error("ERROR CONNECT:", error);
  });

const auth = firebase.auth();

module.exports = { firebase, auth };
