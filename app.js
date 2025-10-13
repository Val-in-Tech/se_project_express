const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

app.use(express.json());
// parse URL-encoded form data (needed if tests send form data)
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    /* eslint-disable-next-line no-console */
    console.log("Connected to MongoDB");
  })
  .catch(console.error);

app.use("/", mainRouter);

app.listen(PORT, () => {
  /* eslint-disable-next-line no-console */
  console.log(`Example app listening at http://localhost:${PORT}`);
});