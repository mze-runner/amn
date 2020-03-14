# AMN

In the first instance, amn is the wrapper I developed for myself to work with [express](https://expressjs.com/). As long as I go further, the functionality of amn grows and evolve. Onwards I equip all my back-ends with amn as it helps me to simplify the architecture, write less code, and boost my productivity.

> Why amn? I pick the name of the city from the great video game Baldur's Gate II: Shadows of Amn.

### General description
`Amn` provides the following capabilities:
- [Response middleware](#response-middleware). Centralize and Simplify your response flow, responds to the client in a single place.
- [Prettification](#prettification). Prettification feature is to control better data you return to a client.
- [Validation](#validation). Client’s input validation via schema employ [@hapi/joi](https://hapi.dev/)
- [Request helpers](#request-helpers). Helper functions to work with request and client input.
- [Store](#store). Introduce a key-value store to help share data through the middleware chain.
- [Amn Error class](#amn-error-class). introduces error class, which extends node js Error and provides the capability to deliver response status along with error message.
- [Error middleware](#error-middleware)
- [under construction] Decorators


##### Disclamer

AMN itself has no dependency and ultra-light; nevertheless, as being a simple wrapper on top of express, the express has to be installed upfront.

Beside, AMN leverage schema validation for client's input through [@hapi/joi](https://hapi.dev/), hence, it's your responsibility to install the package before use `amn.mw.validate`.

### Initialization

To build-in amn into your middleware pipeline, you have to call `amn.mw.init` before any other router chained middlewares.

You can initialize amn in two ways.

```javascript
// example 1
app.use(amn.mw.init); // init amn itself 
app.use(yourControllers); // your controller 
app.use(amn.mw.response); // amn responce middleware 
app.use(amn.mw.error); // amn error middlware
```
```javascript
// example 2
// you server.js routers call may looks like this.
app.user('/api', 
    amn.mw.init,  // please note `amn init` first middleware at the router middlewares pipeline
    yourControllers, 
    amn.mw.response,  // produce a response to a client
    amn.mw.error // close the chain by error handler middleware
);
```
Besides, you easily can mix both scenarios.Obviously, the only matter is an order.
- (1) amn.mw.init
- (2) controllers
- (3) amn.mw.response
- (4) amn.mw.error

### Response middleware

The main idea is to have a single response point to the client. It means that a middleware which has to build a response no longer need to be at the end of the middlewares call chain. 
AMN achieve it through the interim call of `amn.out.reply` to record reply message and keep it till the time `amn.mw.response` lock the chain.

```javascript 
myServiceMiddleware = (req, res, next) => {
    // so somthing usefull 
    const messageToClient = { ... , ... , ... };

    amn.out.reply(res, { name : 'myPrettificationFunc', data : messageToClient} ); // amn.out.reply store data and alias for prettification
    next(); // this is mandatory to call next once middleware done it's job
}

// In case you do not need to send a body to the client, you can simply call amn.out.reply wity empty - true
amn.out.reply(res, { empty : true } ); // return to client empty body and status 201
```

By default, amn has the only build-in prettificator - 'FORWARD'.
Basicaly, it's do nothing and just forward your data directly to res.json.

```javascript
amn.out.reply(res, { name : 'FORWARD', data : { ..., ... } })
```

Eventually, your middleware chain may look at the example below. 
The key benefit, in case any error occurs at the middleware which goes after the one with `reply`, the client gets right error notification and your server will not cause a double reply error.

```javascript
// your routers 
router.put('/your/path' 
    , someMiddlewareOne
    , yourMiddlewareWithReply
    , someMiddlewareTwo
    );
```

### Prettification

As long you are working with your data within server-side service layer, your data most likely has values you are not keen to share the the client. 
It means before you reply you have to clean data up and prepare it. In case you have pretty much end-points which have to return same object to a client you need to be sure you post-process your data before it out.
AMN Preffification is came to simply this flow and centrolize the logic you want to have at each time your server have to return same object to the client. 
Besides, you be able to deeply customize the response, e.g. remove data from response, add new fields, adjust or fully rewrite values your back-end share with outter world.

In order to leverage this AMN feature, in the first instance you have to register all your own prettification functions. 

```javascript 
const foo = ({ ..., ..., ... }) => {
    // do much stuff with your data
    return { ..., ..., ...};
}
/**
 * @param {String} alias a string name for your prettification function.
 * @param {Function} foo a custom function to post-process your resposnce data
 */
amn.prettify('myPrettificationFunc', foo); 
```

Once your register all your custome post-processing functions, the functions become avaliable to `amn.out.reply`

```javascript 
amn.out.reply(res, { name : 'myPrettificationFunc', data : yourRowData } ); // amn.out.reply store data and alias for prettification
```

`amn.mw.response` middleware will check whether resonse data and pretification function avaliable to run your code behind the scene before sending anything to the cleint.

### Validation

AMN delegeates all the validation logic to [@hapi/joi](https://hapi.dev/).

```javascript 

const validationSchema = Joi.object().keys({
    username : Joi.string().required(),
    password : Joi.string().required(),
});

router.post('/resources'
    , amn.mw.validate(validationSchema, 'body') // perform validatino over input on body 
    , yourSinginMiddleware
);

router.put('/resources/:id'
    , amn.mw.validate(validationResourceID, 'params') // perform validation over :id param 
    , amn.mw.validate(validationBody, 'body') // perform validatino over input on body 
    , yourServiceMiddleware
);
```

Needless to say, the second parameter have to be one of the following: 'body', 'params', or 'query'. But you can ommit it and in this case AMN perform validation across 'body', 'params', and 'query' all together. Please note, this is not recommended scenario!

> AMN has no dependencies, hence, it's your responsibility to install [@hapi/joi](https://hapi.dev/) package before use `amn.validate`.

### Request helpers

The goal of the request handler is to provide a more convenient way to work with the client's input. Basically, it's a simple wrapper on top of `req.body`, `req.params`, `req.query`. But also allows you to get client's input from all three sources at once.

```javascript
/**
* @param {Object} req request object from express connect middleware
* @param {String} source [optional] may be 'body', 'params', 'query', if ommited set all thogether.
*/
amn.in.input(req, source);
```

```javascript
// examples 

// get client input from 'body', 'params', and 'query' at once
const body = amn.in.input(req);

// get client input 'body' req.body
const body = amn.in.input(req, 'body');

// get client input 'params' req.params
const params = amn.in.input(req, 'params');

// get client input 'query' req.query
const query = amn.in.input(req, 'query');
```

```javascript
// return uploaded files array (if any) othwewise return empty array
amn.in.files(req)
```

```javascript
// return request method
amn.in.method(req);
```

### Store

AMN store is a simple key-value storage to help to share data through your middleware chain.

```javascript
const OBJECT_NAME = 'objectName';

const myObjectToStore = { ... };

amn.store.push(req, { name : OBJECT_NAME, data: myObjectToStore});

const myObject = amn.store.pop(req, { name : OBJECT_NAME});
// return myObjectToStore
```

In case an object hasn't been placed into store `amn.store.pop` by default will throw and error. Nevertheless, you can pass `strict : false` to force the function to ignore missing data and return `undefined`.

```javascript
amn.store.push(req, { name : OBJECT_NAME, data: undefined });

const myObject = amn.store.pop(req, { name : OBJECT_NAME, strict : false});
// return undefined
```

### Amn Error class

`AmnError` class extends node js `Error` class and add responce status and extra message. 
You should not call `AmnError` directly, the `amn.error()` create and return instance of the class.

```javascript
/**
 * @param {number} status - http status code
 * @param {string} code - error code
 * @param {string} message - text message to support error code 
 * @param {string} exp - [optional] explanation of error nature
 **/

throw amn.error({ status : 401, code : 'UNAUTHORIZED', message : 'user is not authorized', exp : 'extra message to explain more if needed' );
```

### Error middleware
To support `AmnError`, amn provides own error middleware.

Just simply add `amn.mw.error` to middleware pipline.

