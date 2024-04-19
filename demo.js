const bcrypt = require("bcrypt");

const saltRounds = 10;

// const handlePassword = async (password) => {
//   const salt = "$2b$10$QEbg.e6ig1I4rSu4ljIxDu";
//   // const salt = await bcrypt.genSalt(saltRounds);

//   console.log(`salt:: ${salt}`);

//   const hash = await bcrypt.hash(password, salt);
//   console.log(`Hash:: ${hash}`);
// };

const handlePassword = async (password) => {
  const saltRounds = 10;
  // const salt = await bcrypt.genSalt(saltRounds);
  const salt = "$2b$10$U0Lp2zaHtzqC/.61cGCtZe";

  //  $2b$10$gqjRx4X/yTzZS5MIzVvlAu  tram1234  $2b$10$gqjRx4X/yTzZS5MIzVvlAuqoMhmYdv5ffWWY2yxTO/uWrTxtA0VXy
  // $2b$10$.n7NELKxdFWpefx6TKBqIO nam1234   $2b$10$.n7NELKxdFWpefx6TKBqIO.InBI.YBPO5..mbbMs6SppvqX0UnDf.
  // $2b$10$U0Lp2zaHtzqC/.61cGCtZe phong  $2b$10$U0Lp2zaHtzqC/.61cGCtZeEuB.gyxphozW37NxmfUUNTyeNGmP81q

  console.log(`salt:: ${salt}`);

  const hash = await bcrypt.hash(password, salt);

  console.log(`Hash:: ${hash}`);
};

handlePassword("phong");

// $2b$10$0Ihy6yvhvb3ZMOgaaIBH6e
