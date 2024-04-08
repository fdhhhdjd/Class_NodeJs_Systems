//* IMPORT
import cluster from "cluster";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const cpuCount = os.cpus().length;

console.log(`The total number of CPUs: ${cpuCount}`);
console.log(`Primary pid: ${process.pid}`);

cluster.setupPrimary({
  exec: path.join(__dirname, "server.js"),
});

for (let i = 0; i < cpuCount; i++) {
  cluster.fork();
}
cluster.on("exit", (worker, code, signal) => {
  console.log(`Worker ${worker.process.pid} has been killed`);
  console.log("Starting another worker", code, signal);
  cluster.fork();
});
