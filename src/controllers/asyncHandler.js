module.exports = function asyncHandler(handler) {
  return (req, res, next) => {
    return Promise.resolve(handler(req, res)).catch((error) => {
      if (error.statusCode) {
        return res.status(error.statusCode).json(error.responseBody);
      }
      return next(error);
    });
  };
};