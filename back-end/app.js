import express from "express";
import { configRoutes } from "./routes/index.js";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("*", (req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
  console.log();
});
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    optionsSuccessStatus: 200,
  })
);

configRoutes(app);

app.listen(process.env.BACKEND_PORT, () => {
  console.log("We've now got a server!");
  console.log(`Server running on http://localhost:${process.env.BACKEND_PORT}`);
});
