const ApiError = require("./apiError.js");
const errorHandler = (error, req, res, next) => {
  console.log("error come up is ----> ",error)
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      message: error.message,
      success: false,
    });
    return;
  }
  res.status(500).send("Something went wrong");
};

module.exports = errorHandler;
