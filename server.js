//* IMPORT
const app = require("./src/app");


const PORT = 5000

const server = app.listen(PORT, () => {
    console.info(`Api backend start with http://localhost:${PORT}`);
});

// Then we ctrl + c
process.on("SIGINT", () => {
    server.close(() => console.log(`Exit Server Express`));
});