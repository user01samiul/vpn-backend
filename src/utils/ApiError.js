//handling API errors
//search node API Error class
class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong", //deafault value
    errors = [],
    stack = ""
  ) {
    super(message); 
    this.statusCode = statusCode;
    this.data = null; 
    this.message = message; 
    this.success = false; 
    this.errors = errors; 

    if (stack) {
      //to identify where is error
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
