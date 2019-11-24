'use strict';

// const debug = require('debug')('amn:in');
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
store.pop = (req, { name, strict = true }) => {
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

module.exports = store;