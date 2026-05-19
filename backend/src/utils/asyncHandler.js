/**
 * Wraps an async route handler and forwards errors to Express error middleware.
 * Usage: router.get("/path", asyncHandler(myController))
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
