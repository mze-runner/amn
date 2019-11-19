'use strict';

// const debug = require('debug')('amn:in');
const _static = require('./static');
const helper = require('./misc');
const error = require('./error');

const amnin = {};

const REQ_INPUT = _static.request; // input data from user ...

/**
 * return auth data from passport middleware!
 */
amnin.getAuth = (req) => {
    const { user } = req;
    if (!user) {
        throw new Error('AMN: unable to get auth info');// error.create(error.GENERAL.INTERNAL_SERVER_ERROR);
    }
    return user;
};

/**
 * Get client input (body, query, params)
 * @param {Request} req node js Request object
 * @param {string} container [optional] one of property to hold clients data (body, params, query)
 */
amnin.getInput = (req, container) => {
    if (!container) {
        const { body, params, query } = req;
        return Object.assign(body, params, query);
    }
    if (!!container && (container === 'body' || container === 'params' || container === 'query')) {
        const input = req[container];
        if (!input) {
            throw error({ code: 500, message: 'INTERNAL_SERVER_ERROR', em: 'AMN: internal critical error' }, `unable to read client input from ${container}`);
        }
        // return Object.assign({}, { ...input } );
        return input;
    }
    throw error({ code: 500, message: 'INTERNAL_SERVER_ERROR', em: 'AMN: internal critical error' }, 'property is not valid');
};

/**
 * Get client input (body, query, params)
 */
// amnin.getInput = (req) => {
//     const { body, params, query } = req;
//     return Object.assign(body, params, query);
// }

amnin.getFiles = (req) => {
    const { files } = req;
    if (!files) {
        throw new Error('AMN: unable to find files');
    }
    return files;
};

amnin.getMethod = (req) => {
    if (!helper.checkSymbol(req, REQ_INPUT)) {
        throw new Error('AMN: unable to find request');
    }
    const amnin = req[REQ_INPUT];
    const { method } = amnin;
    return method || 'GET'; // assume GET by default method ....
};

/**
  * Store a JSON object into amn request
  * @param {object} req request object from express connect middleware
  * @param {string} name string name of a reference
  * @param {object} data a JSON object to store
  */
amnin.push = (req, { name, data }) => {
    if (!helper.checkSymbol(req, REQ_INPUT)) {
        throw new Error('AMN: unable to find request');
    }
    // debug('[func] putData to amnin %s', name);
    if (typeof (name) !== 'string') {
        throw new Error('AMN: reference is not a string');
    }
    if (!data || !typeof (data) === 'object') {
        throw new Error('AMN: data is not an object');
    }
    req[REQ_INPUT].data.set(name, data);
};

/**
 * get specific data object from req.amnin.data[object_name]
 *
 * @param {object} req request object from express connect middleware
 * @param {string} name object name
 * @param {boolean} strict strict mode, if oject not found, raise an exeption
 */
amnin.pop = (req, { name, strict = true }) => {
    if (!helper.checkSymbol(req, REQ_INPUT)) {
        throw new Error('AMN: unable to find request');
    }
    // debug('[func] getData from amnin %s', name);
    // debug('AMNIN: %O', amnin);
    const isExists = req[REQ_INPUT].data.has(name);
    // is case if strict node we should raise an exaption is data is not found.
    if (strict && !isExists) {
        // throw new Error('AMN: not such data obejct to find');
        throw error({ code: 404, message: 'NOT_FOUND', em: 'AMN: not such data to find' });
    }
    // otherwise we leave check out of scope.
    return !isExists ? undefined : req[REQ_INPUT].data.get(name);
};

module.exports = amnin;
