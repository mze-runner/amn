const AmnError = require('./AmnError');
/**
 * A wrapper to isolate application from Error implementation!
 * Creates and returns an Error/Custom Error object
 * @param reason - an object with message and code, can be undefined, in this case 500 (server error) emits.
 * @returns {AmnError} error object
 */
module.exports = (reason) => new AmnError(reason);
