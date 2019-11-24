'use strict';

// const debug = require('debug')('amn:in');
const _static = require('./static');
const helper = require('./misc');
const error = require('./error');

const amnin = {};

const REQ_INPUT = _static.request; // input data from user ...

/**
 * Get client input (body, query, params)
 * @param {Request} req node js Request object
 * @param {string} container [optional] one of property to hold clients data (body, params, query)
 */
amnin.input = (req, container) => {
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

amnin.files = (req) => {
    const { files } = req;
    if (!files) {
        throw new Error('AMN: unable to find files');
    }
    return files;
};

amnin.method = (req) => {
    if (!helper.checkSymbol(req, REQ_INPUT)) {
        throw new Error('AMN: unable to find request');
    }
    const amnin = req[REQ_INPUT];
    const { method } = amnin;
    return method || 'GET'; // assume GET by default method ....
};

module.exports = amnin;
