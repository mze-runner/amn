'use strict';

/**
 * AMN is a wrapper on express (connect middleware) communication (end-points) functionality...
 */

// AMN wrapper for general access
const debug = require('debug')('amn:core');
const _static = require('./static');
const helper = require('./misc');
const error = require('./error');

// global static name
const GLOBAL_AMN_KEY = _static.global;

if (helper.checkSymbol(global, GLOBAL_AMN_KEY)) {
    global[GLOBAL_AMN_KEY] = {};
}

// we must keep string ref in one place for all consumers...
const REQ_INPUT = _static.request;
const RES_OUTPUT = _static.response;

const prettifyMap = helper.createMap();
const preMap = helper.createMap();

const amn = {
    prettify: prettifyMap,
    pre: preMap
};

// get or create global unique symbol name ...
const amnin = require('./in');
const amnout = require('./out');

/**
 * Register the function to be build in into initialization pipeline
 *
 * @param {string} name extrenal reference to the function
 * @param {string} tag key name for the object to be build in into initialization pipeline
 * @param {function} foo function which MUST return an object to be buil in request object
 */
amn.pre = (name, tag, foo) => {

};

/**
 * Register the decorator for object or function
 *
 * @param {string} name extrenal reference to the function
 * @param {function|Object} subject function or object to use under amn
 */
amn.decorate = (name, foo) => {

};

amn.setErrorHandler = (errorHandlerFunc) => {

};
/**
 * Register the function to be build in into initialization pipeline
 *
 * @param {string} name extrenal reference to the function
 * @param {function} foo function which MUST return an object to be buil in request object
 */
amn.use = (name, foo) => {
    if (!helper.checkSymbol(global, GLOBAL_AMN_KEY)) {
        throw new Error('AMN: global synbol not found');
    }
    if (typeof (name) !== 'string') {
        throw new Error('AMN: cannot verify name');
    }
    if (typeof (foo) !== 'function') {
        throw new Error('AMN: cannot verify function');
    }
    global[GLOBAL_AMN_KEY].maps.prettify.set(name, foo);
};

amn.unuse = (name) => {
    if (!helper.checkSymbol(global, GLOBAL_AMN_KEY)) {
        throw new Error('AMN: global synbol not found');
    }
    if (typeof (name) !== 'string') {
        throw new Error('AMN: cannot verify name');
    }
    if (typeof (foo) !== 'function') {
        throw new Error('AMN: cannot verify function');
    }
    global[GLOBAL_AMN_KEY].maps.prettify.delete(name);
};

/**
 * Middle ware to build in amn structure into middleware pipeline
 * must be used in connection with express middleware
 * app.use( amn.init )
 * go along with routers
 */
amn.init = (req, res, next) => {
    debug('------------- AMN INIT ---------------');
    // super unsafe function as may delete anything from objects....
    // enable option to use several contexts on same server!

    if (helper.checkSymbol(req, REQ_INPUT)) {
        helper.erase(req, REQ_INPUT);
    }
    if (helper.checkSymbol(res, RES_OUTPUT)) {
        helper.erase(res, RES_OUTPUT);
    }

    // init amn input data to user in downstream middlewares
    if (!helper.checkSymbol(req, REQ_INPUT)) {
    // we can capture PARAMS ONLY under specific path !!!
    // const { method, body, params, query } = req;
        const { method, body, query } = req;
        // debug('PARAMS: %o', params);
        // this input data capture can be extened onwards by need
        req[REQ_INPUT] = {
            method: method,
            in: { ...query, ...body },
            data: helper.createMap()
        };
    }

    // init input output structure to use in server's response
    if (!helper.checkSymbol(res, RES_OUTPUT)) {
        res[RES_OUTPUT] = {
            // data : {},  // output data here ....
            data: helper.createMap(), // output data here ....
            content: false, // flag whether response should has message-body!
            reference: undefined, // reserved for a function name reference
            prettification: undefined, // reserve name, function to run pretification.
            forward: true // forward in case no reply is needed...
            // mail : [] // ARRAY list of messages!!! back and should sent to users....
        };
    };
    next();
};

amn.validate = (schema, container) =>
    async (req, res, next) => {
        try {
            const input = amnin.getInput(req, container);
            debug('INPUT: %O', input);
            const { error: validationError } = await schema.validate(input);
            const valid = validationError == null;
            if (valid) {
                next();
            } else {
                const { details } = validationError;
                debug('Validation failed: %O', details);
                const message = details.map(i => i.message).join(',');
                debug('Validation failed: %s', message);
                throw error({ code: 400, message: 'BAD_REQUEST', em: 'client request broken' }, message);
            }
        } catch (err) {
            next(err);
        }
    };

/**
 * magic happens here..
 * bases on input from business layer we must construct response to client
 * major assumptions that this middleware reach with success scenario!!!
 * otherwise ERROR middleware envokes!
 */
// response middleware
amn.response = (req, res, next) => {
    try {
        debug('... AMN RESPONSE MIDDLEWARE ...');
        const method = amnin.getMethod(req);
        // get response meta data...
        const { content, name, prettification, forward } = amnout.getResponse(res); // amnoutHepler.getResponse(res);

        debug('content : %O', content);
        debug('name: %O', name);
        debug('prettification foo : %O', prettification);
        debug('forward -> : %O', forward);

        // do nothing as non of bussiness functions hanles with requiest !!!
        if (forward) {
            return next();
        }
        // define retCode
        // 201 - create new object = POST
        // 200 - requets success = PUT
        // 204 - success but not content
        // 200 - success GET // default
        // no message-body for GET && DELETE = 204 - no content ...
        const retCode = ((!content && method === 'GET') || method === 'DELETE') ? 204 : ((method === 'POST') ? 201 : 200);

        // response does not assume any message-body, only http status code....
        // no need to carry over...
        if (!content) {
            // if ret code 204 = empty body...
            return res.sendStatus(retCode);
        }
        // the most compex case.
        // we have content and must prettify it...
        debug('RES AMN OUT: %O', res[RES_OUTPUT]);
        const rowdata = amnout.getData(res, { name });
        debug('ROW DATA: %O', rowdata);
        // TODO: check whether row data is an object and not null or undefined
        if (!rowdata || typeof (rowdata) !== 'object') {
            throw new Error('AMN: unable to capture data for resposnce');
        }
        const retBody = prettification(rowdata);
        return res.status(retCode).json(retBody);
    // end of story
    } catch (err) {
        next(err);
    }
};

global[GLOBAL_AMN_KEY] = {
    // helper to create an error
    error: error,
    // amn middlewares (mw) !
    mw: {
        // middlewares to be build in into pipeline
        init: amn.init, // init amn in Request & Responce node js objects
        validate: amn.validate, // validate client's input
        response: amn.response, // central lpace to handly the responce to a client.
        error: require('./error/mw') // extended error handler
    },
    // utility function to
    use: amn.use,
    in: {
        method: amnin.getMethod,
        input: amnin.getInput,
        push: amnin.push,
        pop: amnin.pop
    },
    out: {
        reply: amnout.setResponse
    },
    // all
    maps: {
        prettify: helper.createMap(),
        preMap: helper.createMap()
    }
};

// ****** Register the only default function FORWARD ***** //
amn.use(_static.FORWARD, helper._forward);

// define the singleton API
var singleton = {};

// we can get amns from anywhere now across all modules.
singleton.get = function () {
    if (!helper.checkSymbol(global, GLOBAL_AMN_KEY)) {
        throw new Error('AMN not found!');
    }
    return global[GLOBAL_AMN_KEY];
};

// ensure the API is never changed
Object.freeze(singleton);

module.exports = singleton.get();
