class ApiError extends Error {
    statusCode;
    success;
    constructor(statusCode, message = "Internal Server Error") {
      super(message);
      this.statusCode = statusCode;
      this.success = false;
    }
  }
  
  module.exports = ApiError;
  