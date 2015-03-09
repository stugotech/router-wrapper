router-wrapper
==============

This project wraps the [express](https://github.com/strongloop/express) project router to add a couple of useful functions.

First up, promise chain termination: if you pass it a function which returns a promise it'll call the `.done()` method for you.

You can also make it bind your handlers to an object of your choice.

```js
// wrap a router
var expressRouter = express.Router();
var router = new Router(expressRouter);

class MyController {
  constructor(router) {
    router
      // make sure the middleware and action get called with the correct `this`
      .context(this)
      // define a route with args to pass to middleware
      .get('/test', this.testAction);
  }
  
  testAction(request, response) {
    return getAPromiseSomehow()
      .then((x) => response.send(x));
  }
}

```