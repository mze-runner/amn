'use strick';

/**
 * The function to help to check whether symbol exist with in the given object
 * @param {object} object 
 * @param {symbol} symbol 
 */
const _checkSymbol = (object, symbol) => {
    if(typeof object !== 'object'){
        throw error({ status : 500, code : 'INTERNAL_SERVER_ERROR', message : 'AMN: unable to check the symbol' });
    }
    if(typeof symbol !== 'symbol'){
        throw error({ status : 500, code : 'INTERNAL_SERVER_ERROR', message : 'AMN: unable to check the symbol' });
    }
    const arr = Object.getOwnPropertySymbols(object);
    return (arr.indexOf(symbol) > -1);
};

/**
 * Create Map
 */
const _createMap = () => new Map();

/**
 * Erase object data within the host object 
 * @param {object} object 
 * @param {symbol} symbol 
 */
const _erase = (object, symbol) => {
    if(!object || typeof object !== 'object'){
        throw error({ status : 500, code : 'INTERNAL_SERVER_ERROR', message : 'AMN: unable to check the symbol' });
    }
    if(!symbol || typeof symbol  !== 'symbol'){
        throw error({ status : 500, code : 'INTERNAL_SERVER_ERROR', message : 'AMN: unable to check the symbol' });
    }
    delete object[symbol];
};

/**
 * FORWARD function to to pass to response.
 * @param {object} data 
 */
const _forward = (data) => data;

module.exports = {
    checkSymbol : _checkSymbol,
    createMap : _createMap,
    erase : _erase,
    _forward,
}