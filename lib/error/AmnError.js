/**
 * Exrtending base Node js Error class to add status code = http return code.
 * Additinally, adding an extended message (em) as a descriptions of an error message
 * opt - [optional] free format message...
 */
module.exports = class AmnError extends Error {
  // call constructor // by default 500 = internal server error...
  /**
   * 
   * @param {number} status - http status code
   * @param {string} code - errror string code
   * @param {string} message - error code string 
   * @param {string} exp - [optinal] explanation, an extra string to explain the nature of an error
   */
  constructor ({ status, code /*  string */, message, exp = undefined}) {
    
    // Calling parent constructor of base Error class.
    super(message);
    
    // Saving class name in the property of our custom error as a shortcut.
    this.name = this.constructor.name;
    
    // I'm going to use preferred HTTP status for this error types.
    // `500` is the default value if not specified.
    this.status = status || 500;

    // pass code 
    this.code = code || 'INTERNAL_SERVER_ERROR';

    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor);
    
    // custom properties
    // message extender to explain more is needed
    this.explain = exp;
  }
};