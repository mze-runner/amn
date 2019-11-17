'use strict';

const _static = require('./static');
const helper = require('./misc');

const amninHelper = {};

const REQ_INPUT = _static.request; // input data from user ...

/**
 * return auth data from passport middleware! 
 */
amninHelper.getAuth = (req) => {
    const { user } = req;
    if(!user){
        throw new Error('AMN: unable to get auth info');//error.create(error.GENERAL.INTERNAL_SERVER_ERROR);
    }
    return user;
}

/**
 * Get client input (body, query, params)
 */
amninHelper.getInput = (req) => {

    const _getParams = function(req){
        const { params } = req;
        return params;
    }
    if(!helper.checkSymbol(req, REQ_INPUT)){
        throw new Error('AMN: unable to find request');
    }
    const amnin = req[REQ_INPUT];
    const { in : clientInput } = amnin;
    const params = _getParams(req);
    return { ...clientInput, ...params };
}

amninHelper.getFiles = (req) => {
    const { files } = req;
    if(!files){
        throw new Error('AMN: unable to find files');
    }
    return files;
}

amninHelper.getMethod = (req) => {
    if(!helper.checkSymbol(req, REQ_INPUT)){
        throw new Error('AMN: unable to find request');
    }
    const amnin = req[REQ_INPUT];
    const { method } = amnin;
    return method || 'GET'; // assume GET by default method ....
}

 /**
  * Store a JSON object into amn request
  * @param {object} req request object from express connect middleware
  * @param {string} name string name of a reference
  * @param {object} data a JSON object to store
  */
amninHelper.push = (req, {  name, data } ) => {
    if(!helper.checkSymbol(req, REQ_INPUT)){
        throw new Error('AMN: unable to find request');
    }
    //debug('[func] putData to amnin %s', name);
    if(!typeof(name) == 'string') {
        throw new Error('AMN: reference is not a string');
    }
    if(!data || !typeof(data) == 'object'){
        throw new Error('AMN: data is not an object');
    }
    req[REQ_INPUT].data.set(name, data);
}

/**
 * get specific data object from req.amnin.data[object_name]
 * 
 * @param {object} req request object from express connect middleware
 * @param {string} name object name 
 * @param {boolean} strict strict mode, if oject not found, raise an exeption
 */
amninHelper.pop = (req, { name, strict = true } ) => {
    if(!helper.checkSymbol(req, REQ_INPUT)){
        throw new Error('AMN: unable to find request');
    }
    //debug('[func] getData from amnin %s', name);
    //debug('AMNIN: %O', amnin);
    const isExists = req[REQ_INPUT].data.has(name);
    // is case if strict node we should raise an exaption is data is not found.
    if(strict && !isExists){
        throw new Error('AMN: not such data obejct to find');
    }
    // otherwise we leave check out of scope.
    return !isExists ? undefined : req[REQ_INPUT].data.get(name);
}

module.exports = amninHelper;