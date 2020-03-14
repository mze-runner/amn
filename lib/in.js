'use strict';

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
            throw error({ status: 500, code: 'INTERNAL_SERVER_ERROR', message: 'AMN: internal critical error', exp: `Unable to read client input from ${container}` });
        }
        return input;
    }
    throw error({ status: 500, code: 'INTERNAL_SERVER_ERROR', message: 'AMN: internal critical error'});
};

amnin.files = (req) => {
    const { files } = req;
    if (!files) {
        //throw error({ status : 500, code : 'INTERNAL_SERVER_ERROR', message : 'AMN: unable to find files' });
        return [];
    }
    return files;
};

amnin.method = (req) => {
    if (!helper.checkSymbol(req, REQ_INPUT)) {
        throw error({ status : 500, code : 'INTERNAL_SERVER_ERROR', message : 'AMN: unable to find request' });
    }
    const amnin = req[REQ_INPUT];
    const { method } = amnin;
    return method || 'GET'; // assume GET by default method ....
};

module.exports = amnin;
