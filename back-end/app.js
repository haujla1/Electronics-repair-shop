import express from "express";
import { configRoutes } from "./routes/index.js";
import cors from "cors";
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
    origin: "http://ec2-54-166-200-140.compute-1.amazonaws.com",
  })
);

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://3.95.175.219:3000");
});
