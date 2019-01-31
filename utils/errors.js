class serverError extends Error {
  constructor(status = 500, message = 'Error', error, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    // Pass message to parent constructor
    console.log(message);
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, serverError);
    }
    console.log(this.stack);

    this.error = error || 'No more details';
    this.message = message;
    this.status = status;
  }
}

module.exports = serverError;
