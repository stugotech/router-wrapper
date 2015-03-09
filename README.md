router-wrapper
==============

This project wraps the [express](https://github.com/strongloop/express) project router to add a couple of useful functions.

First up, promise chain termination: if you pass it a function which returns a promise it'll call the `.done()` method for you.

You can also make it bind your handlers to an object of your choice, and add route middleware to all routes.

```js
// wrap a router
var expressRouter = express.Router();
var router = new Router(expressRouter);

class MyController {
  constructor(router) {
    router
      // make sure the middleware and action get called with the correct `this`
      .context(this)
      // add route-level middleware for all routes
      .middleware(this.auth)
      // define a route with args to pass to middleware
      .get('/test', ['admin'], this.testAction);
  }
  
  auth(request, response, next, groups) {
    // the fourth arg and any after that get passed
    // in from when the route was set up
    // so groups == ['admin']
    if (currentUserHasAnyGroup(groups)) {
      next();
    } else {
      response.status(403).send();
    }
  }
  
  testAction(request, response) {
    return getAPromiseSomehow()
      .then((x) => response.send(x));
  }
}

```