import path from "path";
import express from "express";
import apiRouter from "./routes";

const app = express();

let p = path.join(__dirname, "../../public");

app.use(express.static(p));
app.use(express.json());
app.use(apiRouter);

const port = 5000;
app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
