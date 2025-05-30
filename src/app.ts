import express from "express";
import router from "./routes/userRoute";
import cookieParser from "cookie-parser";
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use("/user", router);
export default app;
