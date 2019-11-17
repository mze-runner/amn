'use strick';

/**
 * The function to help to check whether symbol exist with in the given object
 * @param {object} object 
 * @param {symbol} symbol 
 */
const _checkSymbol = (object, symbol) => {
    if(typeof(object) !== 'object'){
        throw new Error('AMN: unable to check the symbol');
    }
    if(typeof(symbol) !== 'symbol'){
        throw new Error('AMN: unable to check the symbol');
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
    if(typeof(object) !== 'object'){
        throw new Error('AMN: unable to check the symbol');
    }
    if(typeof(symbol) !== 'symbol'){
        throw new Error('AMN: unable to check the symbol');
    }
    object[symbol] = undefined;
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