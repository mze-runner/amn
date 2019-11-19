'use strict';

const debug = require('debug')('amn:out');
const _static = require('./static');
const helper = require('./misc');

const amnoutHelper = {};

const GLOBAL_AMN_KEY = _static.global;
const RES_OUTPUT = _static.response;
//const output = 'amnout'; // output data from server ... 

//amnoutHelper.setResponse = (res, { prettify, data, empty = false, created = false} ) => {
amnoutHelper.setResponse  = (res, { reference, data, empty = false} ) => {
    // general check .... 
    // other than that we need to be ensure global object has amn
    if(!helper.checkSymbol(global, GLOBAL_AMN_KEY)){
        throw new Error('AMN not found!');
    }
    if(!helper.checkSymbol(res, RES_OUTPUT)){
        throw new Error('AMN: unable to find response.');
    }
    
    // if empty set to true, assume that response with empty-body
    // we ignore data as this is an addition to pretty function 
    // in case data needs to be added into amnout use putData!!!
    if(empty){
        res[RES_OUTPUT].content = false;
        res[RES_OUTPUT].forward = false; // do a response ...
        return;
    }
    if(!typeof(data) === 'object') {
        throw new Error('AMN: data object is not provided');
    }
    // [1] preffity is a string
    if(typeof(reference) !== 'string'){
        throw new Error('AMN: pretty reference is not provided');
    }
    const func = global[GLOBAL_AMN_KEY].maps.prettify.get(reference);
    if(typeof(func) !== 'function'){
        throw new Error('AMN: pretty function is not found');
    }

    res[RES_OUTPUT].data.set(reference, data); // we can store various data
    res[RES_OUTPUT].reference = reference; // must be a string, a reference to function ... 
    res[RES_OUTPUT].prettification = func; // must be a function to run prettification...
    res[RES_OUTPUT].content = true;
    res[RES_OUTPUT].forward = false; // do a response ...-
}

/**
 * Extract into onver the amn response
 * @param {object} res response object
 */
amnoutHelper.getResponse = (res) => {
    if(!helper.checkSymbol(res, RES_OUTPUT)){
        throw new Error('AMN: unable to find response.');
    }
    const { content, reference, prettification, forward  } = res[RES_OUTPUT];
    return { content, name : reference, prettification, forward };
}

/**
 * Extract object/data subject to response
 */
amnoutHelper.getData = (res, { name }) => {
    if(!helper.checkSymbol(res, RES_OUTPUT)){
        throw new Error('AMN: unable to find response.');
    }
    if(typeof(name) !== 'string'){
        throw new Error('AMN: name os not a string');
    }
    const { data } = res[RES_OUTPUT];
    if(!data || typeof(data) !== 'object'){
        throw new Error('AMN: unable to extract data');
    }
    const obj = data.get(name);
    return obj;
}

module.exports = amnoutHelper;