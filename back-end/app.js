import express from "express";
const app = express();
import { configRoutes } from "./routes/index.js";

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('*', (req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`)

    next();
    console.log();
});

configRoutes(app);

app.listen(3000, async () => {
    console.log('Server is now running on http://localhost:3000.');
});