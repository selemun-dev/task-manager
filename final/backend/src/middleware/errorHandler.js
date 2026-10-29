/**
 * Global error handler middleware.
 * Produces a consistent JSON error body for all unhandled errors.
 */

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[${new Date().toISOString()}] ${statusCode} ${req.method} ${req.url} — ${message}`);

  res.status(statusCode).json({
    status: statusCode,
    message,
  });
}

module.exports = errorHandler;
