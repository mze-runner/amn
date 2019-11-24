# AMN

In the first instance, amn is the helper wrapper I developed for myself to work with [express](https://expressjs.com/). As long as I go further, the functionality of amn grows and evolve. Onwards I equip all my back-ends with amn as it helps me to simplify the architecture, write less code, and boost my productivity.

> Why amn? I pick the name of the city from the great video game Baldur's Gate II: Shadows of Amn.

### General description
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

### Request helpers

```javascript
amn.in.method(req)
```

```javascript
amn.in.input(req, source)
```

```javascript
amn.in.files(req)
```

### Responce helper 

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

### Middlewares

```javascript
amn.mw.response(req, res, next)
```

### Store 

AMN store is a simple key, value storage to help to move data through your middleware chain.

```javascript
const amn = require('amn');

const OBJECT_NAME = 'objectName';

const myObjectToStore = { ... };

amn.store.push(req, { name : OBJECT_NAME, data: myObjectToStore});

const myObject = amn.store.pop(req, {{ name : OBJECT_NAME});
// return myObjectToStore

```

### Prettification

### Validation

### Error handler

