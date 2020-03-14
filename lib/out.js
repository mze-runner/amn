'use strict';

const _static = require('./static');
const helper = require('./misc');
const error = require('./error');

const amnoutHelper = {};

const GLOBAL_AMN_KEY = _static.global;
const RES_OUTPUT = _static.response;
// const output = 'amnout'; // output data from server ...

// amnoutHelper.setResponse = (res, { prettify, data, empty = false, created = false} ) => {
amnoutHelper.setResponse = (res, { name, data, empty = false }) => {
    // general check ....
    // const amnout = res[output];
    // other than that we need to be ensure global object has amn
    if (!helper.checkSymbol(global, GLOBAL_AMN_KEY)) {
        throw error({ status : 500, code : 'INTERNAL_SERVER_ERROR', message : 'AMN not found in global scope' });
        //throw new Error('AMN not found!');
    }
    if (!helper.checkSymbol(res, RES_OUTPUT)) {
        throw error({ status : 500, code : 'INTERNAL_SERVER_ERROR', message : 'AMN: unable to find Response(res), you may provide Request(req) instead' });
    }

    // if empty set to true, assume that response with empty-body
    // we ignore data as this is an addition to pretty function
    // in case data needs to be added into amnout use putData!!!
    if (empty) {
        res[RES_OUTPUT].content = false;
        res[RES_OUTPUT].forward = false; // do a response ...
        return;
    }
    if (!data || typeof data !== 'object') {
        throw error({ status : 500, code : 'INTERNAL_SERVER_ERROR', message : 'AMN: data object is not provided' });
    }
    // [1] preffity is a string
    if (!name || typeof name !== 'string') {
        throw error({ status : 500, code : 'INTERNAL_SERVER_ERROR', message : 'AMN: name is not provided' });
    }
    const func = global[GLOBAL_AMN_KEY].maps.prettify.get(name);
    if (typeof func !== 'function') {
        throw error({ status : 500, code : 'INTERNAL_SERVER_ERROR', message : 'AMN: pretty function is not found' });
    }
    res[RES_OUTPUT].data.set(name, data); // we can store various data
    res[RES_OUTPUT].reference = name; // must be a string, a reference to function ...
    res[RES_OUTPUT].prettification = func; // must be a function to run prettification...
    res[RES_OUTPUT].content = true;
    res[RES_OUTPUT].forward = false; // do a response ...-
};

/**
 * Extract amn response details
 * @param {object} res response object
 */
amnoutHelper.getResponse = (res) => {
    if (!helper.checkSymbol(res, RES_OUTPUT)) {
        throw error({ status : 500, code : 'INTERNAL_SERVER_ERROR', message : 'AMN: unable to find response' });
    }
    const response = res[RES_OUTPUT];
    if(!response || typeof response !== 'object'){
        throw error({ status : 500, code : 'INTERNAL_SERVER_ERROR', message : 'AMN: unable to find response' });
    }
    const { content, reference, prettification, forward } = response;
    return { content, name: reference, prettification, forward };
};

/**
 * Extract object/data subject to response
 */
amnoutHelper.getData = (res, { name }) => {
    if (!helper.checkSymbol(res, RES_OUTPUT)) {
        throw error({ status : 500, code : 'INTERNAL_SERVER_ERROR', message : 'AMN: unable to find response' });
    }
    if (!name || typeof name !== 'string') {
        throw error({ status : 500, code : 'INTERNAL_SERVER_ERROR', message : 'AMN: name os not a string' });
    }
    const { data } = res[RES_OUTPUT];
    if (!data || typeof data !== 'object') {
        throw error({ status : 500, code : 'INTERNAL_SERVER_ERROR', message : 'AMN: unable to extract data' });
    }
    const obj = data.get(name);
    return obj;
};

module.exports = amnoutHelper;
