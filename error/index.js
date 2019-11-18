
const AmnError = require('./AmnError');
/**
 * A wrapper to isolate application from Error implementation! 
 * Creates and returns an Error/Custom Error object
 * @param reason - an object with message and code, can be undefined, in this case 500 (server error) emits.
 * @param opt - optinal cause of error (e.g. wrong rield name, etc)
 * @returns {AmnError} error object
 */
module.exports = (reason, opt) => new AmnError(reason, opt);