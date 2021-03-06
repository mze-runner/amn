'use strict';

const _static = require('./static');
const helper = require('./misc');
const error = require('./error');

const REQ_INPUT = _static.request; // input data from user ...

const store = {};

/**
 * Store a JSON object into amn request
 * @param {object} req request object from express connect middleware
 * @param {string} name string name of a reference
 * @param {object} data a JSON object to store
 */
store.push = (req, { name, data }) => {
    if (!helper.checkSymbol(req, REQ_INPUT)) {
        throw error({
            status: 500,
            code: 'INTERNAL_SERVER_ERROR',
            message: 'AMN: unable to find request',
        });
    }
    if (typeof name !== 'string') {
        throw error({
            status: 500,
            code: 'INTERNAL_SERVER_ERROR',
            message: 'AMN: reference is not a string',
        });
    }
    if (!data || typeof data !== 'object') {
        throw error({
            status: 500,
            code: 'INTERNAL_SERVER_ERROR',
            message: 'AMN: data is not an object',
        });
    }
    req[REQ_INPUT].data.set(name, data);
};

/**
 * get specific data object from req.amnin.data[object_name]
 *
 * @param {object} req request object from express connect middleware
 * @param {string} name object name
 * @param {boolean} strict strict mode, if object not found, raise an exception
 */
store.pull = (req, { name, strict = true }) => {
    if (!helper.checkSymbol(req, REQ_INPUT)) {
        throw error({
            status: 500,
            code: 'INTERNAL_SERVER_ERROR',
            message: 'AMN: unable to find request',
        });
        //throw new Error('AMN: unable to find request');
    }
    const isExists = req[REQ_INPUT].data.has(name);
    // is case if strict node we should raise an exaption is data is not found.
    if (strict && !isExists) {
        throw error({
            status: 404,
            code: 'NOT_FOUND',
            message: 'AMN: not such data to find',
        });
    }
    // otherwise we leave check out of scope.
    return !isExists ? undefined : req[REQ_INPUT].data.get(name);
};

/**
 * get specific data object from req.amnin.data[object_name]
 * after data removes from store
 *
 * @param {object} req request object from express connect middleware
 * @param {string} name object name
 * @param {boolean} strict strict mode, if object not found, raise an exception
 */
store.pop = (req, { name, strict = true }) => {
    if (!helper.checkSymbol(req, REQ_INPUT)) {
        throw error({
            status: 500,
            code: 'INTERNAL_SERVER_ERROR',
            message: 'AMN: unable to find request',
        });
        //throw new Error('AMN: unable to find request');
    }
    const isExists = req[REQ_INPUT].data.has(name);
    // is case if strict node we should raise an exaption is data is not found.
    if (strict && !isExists) {
        throw error({
            status: 404,
            code: 'NOT_FOUND',
            message: 'AMN: not such data to find',
        });
    }
    // otherwise we leave check out of scope.
    return !isExists ? undefined : req[REQ_INPUT].data.get(name);
};

module.exports = store;
