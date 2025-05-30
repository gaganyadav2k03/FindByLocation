"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const cluster_1 = __importDefault(require("cluster"));
const os_1 = __importDefault(require("os"));
const db_1 = require("./config/db");
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config({
    path: "../.env",
});
const numCpu = os_1.default.cpus().length;
console.log(numCpu);
if (cluster_1.default.isPrimary) {
    for (let i = 0; i < numCpu; i++) {
        cluster_1.default.fork();
    }
    cluster_1.default.on("exit", (worker, code, signal) => {
        cluster_1.default.fork();
    });
}
else {
    (0, db_1.connectDB)().then(() => {
        app_1.default.listen(process.env.Port, () => {
            console.log(`running on ${process.env.Port} with ${process.pid}`);
        });
    });
}
