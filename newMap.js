const anotherMap = new Map();

anotherMap
  .set("fullname", "Nguyen Tien Tai")
  .set("age", 24)
  .set("job", "developer and teacher");

const data = anotherMap.get("age");
console.log(data);
