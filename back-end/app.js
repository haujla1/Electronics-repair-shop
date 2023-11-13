import express from "express";
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.listen(3000, async () => {
    console.log('Server is now running on http://localhost:3000.');
});