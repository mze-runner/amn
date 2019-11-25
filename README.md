# [AMN](#amn)

In the first instance, amn is the helper wrapper I developed for myself to work with [express](https://expressjs.com/). As long as I go further, the functionality of amn grows and evolve. Onwards I equip all my back-ends with amn as it helps me to simplify the architecture, write less code, and boost my productivity.

> Why amn? I pick the name of the city from the great video game Baldur's Gate II: Shadows of Amn.

### [General description](#general-description)
`Amn` provides the following capabilities:
-	Helper middlewares to work with request, response.
-	Helper functions to work with request and client input.
-   Introduce key, value store to help move data through middleware chain.
-	Centralize and Simplify your response code, provides a response back to client in a single place.
-	Prettification capability to better control data you return to a client.
-	Client’s input validation via schema employ [@hapi/joi](https://hapi.dev/)
-   Introduce own error class, which extends node js Error and provides the capability to deliver response status along with error message
-   Provide error middleware to support extended erorr info (compatible with Error node js class)
-	[under construction] Decorators

### [Request](#amn-request-helpers)

```javascript
amn.in.method(req);
```

```javascript
/**
* @param {Object} req request object from express connect middleware
* @param {String} source [optional] may be 'body', 'params', 'query', if not set all thogether.
*/
amn.in.input(req, source);
```

```javascript
// examples 

// get client input from 'body', 'params', and 'query'
const body = amn.in.input(req);

// get client input 'body' req.body
const body = amn.in.input(req, 'body');

// get client input 'params' req.params
const body = amn.in.input(req, 'params');

// get client input 'query' req.query
const body = amn.in.input(req, 'query');
```

```javascript
amn.in.files(req)
```

### [Responce helper](#amn-responce-helper)

Response hepler and `amn.mw.response` help to organaze a single response point for your client handling middlweware chain. 
This become handly if you still need to call other middlewares after the one which should reply to client.

```javascript
amn.out.reply(res, { empty : true })
```

```javascript
amn.out.reply(res, { name : 'myReplyPrettification', data : { ..., ... } })
```

By default, amn has the only build-in prettificator - 'FORWARD'.
Basicaly, it's do nothing and just forward your data directly to res.json.

```javascript
amn.out.reply(res, { name : 'FORWARD', data : { ..., ... } })
```

```javascript
// example 
const yourMiddlewareWithReply = (req, res, next) => {
    // do something ...

    amn.out.reply(res, { name : 'FORWARD', data : { ..., ... } });
    next();
}

// your routers 
router.put('/your/path' 
    , someMiddlewareOne
    , yourMiddlewareWithReply
    , someMiddlewareTwo
    );

// you server.js routers call.
app.user('/api', 
    amn.init, 
    yourControllers, 
    amn.mw.response
);
```
Additionally, amn through `amn.out.reply` and `amn.mw.response` allow you to define custom data post handlers.
Basically, you can pass to `amn.out.reply` row data, not prepared for a client. Associated prettification function should take care to preprare data and do not allow to leak unwanted for others eyes pieces of information. 

Please see ### Prettification

### [Middlewares](#amn-middlewares)

```javascript
amn.mw.response(req, res, next)
```

### [Store](#amn-store)

AMN store is a simple key-value storage to help to move data through your middleware chain.

```javascript
const amn = require('amn');

const OBJECT_NAME = 'objectName';

const myObjectToStore = { ... };

amn.store.push(req, { name : OBJECT_NAME, data: myObjectToStore});

const myObject = amn.store.pop(req, {{ name : OBJECT_NAME});
// return myObjectToStore

```
### [Prettification](#amn-prettification)

### [Validation](#amn-validation)

### [Amn Error class](#amn-error-class)

### [Error handler](#amn-error-handler)


