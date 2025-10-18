
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const auth = require("./middlewares/auth");
const errorHandler = require("./middlewares/errorHandler");


const app = express();
const { PORT = 3001 } = process.env;

app.use(cors());
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


// Public routes
app.post('/signin', require('./controllers/users').loginUser);
app.post('/signup', require('./controllers/users').createUser);
app.get('/items', require('./routes/clothingItem'));

// Protect all other routes
app.use(auth);

// Main router (all protected routes)
app.use("/", mainRouter);


// Centralized error handler (should be last)
app.use(errorHandler);

app.listen(PORT, () => {
  /* eslint-disable-next-line no-console */
  console.log(`Example app listening at http://localhost:${PORT}`);
});