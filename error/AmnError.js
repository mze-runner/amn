
/**
 * Exrtending base Node js Error class to add status code = http return code.
 * Additinally, adding an extended message (em) as a descriptions of an error message
 * opt - [optional] free format message...
 */
module.exports = class AmnError extends Error {
    // call constructor // by default 500 = internal server error...
    constructor ({status = 500, message = 'INTERNAL_SERVER_ERROR', em = undefined}, opt = undefined) {
    
      // Calling parent constructor of base Error class.
      super(message);
      
      // Saving class name in the property of our custom error as a shortcut.
      this.name = this.constructor.name;
  
      // Capturing stack trace, excluding constructor call from it.
      Error.captureStackTrace(this, this.constructor);
      
      // custom properties
      // message extender
      this.em = em;
      // specific cause back-end want to reveal! 
      this.cause = opt;
      // I'm going to use preferred HTTP status for this error types.
      // `500` is the default value if not specified.
      this.status = status || 500;
    }
  };