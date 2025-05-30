import express from "express";
import dotenv from "dotenv";
import cluster from "cluster";
import os from "os";
import { connectDB } from "./config/db";
import app from "./app";

dotenv.config({
  path: "../.env",
});

const numCpu = os.cpus().length;
console.log(numCpu);
if (cluster.isPrimary) {
  for (let i = 0; i < numCpu; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    cluster.fork();
  });
} else {
  connectDB().then(() => {
    app.listen(process.env.Port, () => {
      console.log(`running on ${process.env.Port} with ${process.pid}`);
    });
  });
}
