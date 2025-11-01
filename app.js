
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const { errors: celebrateErrors } = require('celebrate');
const validation = require('./middlewares/validation');
const auth = require("./middlewares/auth");
const errorHandler = require("./middlewares/errorHandler");
const { requestLogger, errorLogger } = require('./middlewares/logger');


const app = express();
const { PORT = 3001 } = process.env;

app.use(cors());
app.use(express.json());
// parse URL-encoded form data (needed if tests send form data)
app.use(express.urlencoded({ extended: true }));

// request logger (logs incoming requests)
app.use(requestLogger);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    /* eslint-disable-next-line no-console */
    console.log("Connected to MongoDB");
  })
  .catch(console.error);


// Public routes with validation
app.post('/signin', validation.validateLogin, require('./controllers/usersController').loginUser);
app.post('/signup', validation.validateUserBody, require('./controllers/usersController').createUser);
// Expose GET /items publicly, but keep other item routes protected (POST/DELETE require auth)
app.get('/items', require('./controllers/clothingItemController').getItems);

// Protect all other routes
app.use(auth);

// Main router (all protected routes)
app.use("/", mainRouter);


// error logger should run after routes and before error handlers
app.use(errorLogger);

// celebrate error handler (must be before our centralized error handler)
app.use(celebrateErrors());

// Centralized error handler (should be last)
app.use(errorHandler);

app.listen(PORT, () => {
  /* eslint-disable-next-line no-console */
  console.log(`Example app listening at http://localhost:${PORT}`);
});