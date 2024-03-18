const yourself = new Map();

yourself
  .set("fullname", "Nguyen Tien Tai")
  .set("age", 24)
  .set("job", "developer and teacher");

const valueForKeyAge = yourself.get("fullname");
console.log("Value for age:", valueForKeyAge);
