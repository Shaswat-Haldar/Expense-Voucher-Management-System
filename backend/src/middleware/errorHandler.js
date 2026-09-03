export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.code === 'ECONNREFUSED' || (err.errors && err.errors.some(e => e.code === 'ECONNREFUSED'))) {
    statusCode = 503;
    message = 'Database connection refused. Please make sure PostgreSQL is running on localhost:5432 and the credentials in backend/.env are correct.';
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: statusCode,
      message,
      ...(err.details && { details: err.details })
    }
  });
};
