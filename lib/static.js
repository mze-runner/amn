'use strict';

module.exports = {
    request : Symbol('amnReqeustSymbol'), // input data from user ...
    response : Symbol('amnResponseSymbol'), // output data from server ... 
    global : Symbol('amnGlobalSymbol'),
    // 
    FORWARD : 'FORWARD', // must not be a symbol to be able to overwrite 
};