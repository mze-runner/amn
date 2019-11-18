# AMN

In the first instance, amn is the helper wrapper I developed for myself to work with [express](https://expressjs.com/). As long as I go further, the functionality of amn grows and evolve. Onwards I equip all my back-ends with amn as it helps me to simplify the architecture, write less code, and boost my productivity.

> Why amn? I pick the name of the city from the great video game Baldur's Gate II: Shadows of Amn.

### General description
`Amn` provides the following capabilities:
-	Helper middlewares to work with request, response.
-	Helper functions to work with request and client input.
-	Centralize and Simplify your response code, provides a response back to client in a single place.
-	Prettification capability to better control data you return to a client.
-	Client’s input validation via schema employ [@hapi/joi](https://hapi.dev/)
-   Introduce own error class, which extends node js Error and provides the capability to deliver response status along with error message
-   Provide error middleware to support extended erorr info (compatible with Error node js class)
-	[under construction] Decorators