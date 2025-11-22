require('dotenv').config();

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
// If this app is behind a reverse proxy (nginx), trust the proxy headers
app.set('trust proxy', 1);
const { PORT = 3001 } = process.env;

// For development and to ensure the backend echoes the incoming Origin
// we allow the server to reflect the request Origin and enable credentials.
// In production you may want to restrict this to a specific allow-list.
// Environment-aware CORS policy:
// - In development (or when NODE_ENV !== 'production') we echo the incoming Origin
//   to make local debugging easier.
// - In production we use a comma-separated whitelist from `CORS_ALLOWED` env var.
const defaultAllowed = ['https://closet.wtwr.verymad.net'];
const allowed = process.env.CORS_ALLOWED ? process.env.CORS_ALLOWED.split(',') : defaultAllowed;

let corsOptions;
if (process.env.NODE_ENV === 'production') {
  corsOptions = {
    origin: (origin, cb) => {
      // allow non-browser requests (curl, server-to-server) where origin is undefined
      if (!origin) return cb(null, true);
      if (allowed.includes(origin)) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
  };
} else {
  // development: echo origin (convenient when testing from different hosts)
  corsOptions = { origin: true, credentials: true };
}

app.use(cors(corsOptions));
// Ensure preflight requests are handled for all routes
app.options('*', cors(corsOptions));

// Add Vary header so caches and proxies don't serve a wildcard origin incorrectly
app.use((req, res, next) => {
  res.header('Vary', 'Origin');
  next();
});

app.use(express.json());
// parse URL-encoded form data (needed if tests send form data)
app.use(express.urlencoded({ extended: true }));

// Normalize incoming URLs by removing a trailing slash on non-root paths
// This avoids backend-generated redirects for routes like `/items/` and
// ensures routes defined without a trailing slash (e.g. `/items`) still match.
app.use((req, res, next) => {
  try {
    if (req.path.length > 1 && req.path.endsWith('/')) {
      // preserve query string while normalizing the path
      const qsIndex = req.url.indexOf('?');
      const qs = qsIndex >= 0 ? req.url.slice(qsIndex) : '';
      req.url = req.path.replace(/\/+$/g, '') + qs;
    }
  } catch (err) {
    // If anything goes wrong, continue to the next middleware
  }
  return next();
});

// request logger (logs incoming requests)
app.use(requestLogger);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    /* eslint-disable-next-line no-console */
    console.log("Connected to MongoDB");
  })
  .catch(console.error);


// Crash-test route for code review (intentionally crashes the server)
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

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