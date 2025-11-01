// Centralized error handler middleware for Express
module.exports = (err, req, res, next) => {
  /* eslint-disable-next-line no-console */
  console.error(err);

  // Prefer explicit `status` or `statusCode` set on custom error objects
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).send({ message });
};
