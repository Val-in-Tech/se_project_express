// Centralized error handler middleware for Express
module.exports = (err, req, res, next) => {
  // Default to 500 if status not set
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).send({ message });
};
