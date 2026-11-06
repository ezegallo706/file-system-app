class ServiceError extends Error {
  constructor(statusCode, responseBody) {
    super(responseBody.error);
    this.statusCode = statusCode;
    this.responseBody = responseBody;
  }
}

module.exports = ServiceError;