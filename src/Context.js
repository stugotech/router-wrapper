
var methods = [
  'all', 'checkout', 'connect', 'copy', 'delete', 'get', 'head', 'lock', 'merge', 'mkactivity', 'mkcol', 'move',
  'm-search', 'notify', 'options', 'param', 'patch', 'post', 'propfind', 'proppatch', 'purge', 'put', 'report',
  'search', 'subscribe', 'trace', 'unlock', 'unsubscribe', 'use'
];

export default class Context {

  constructor(router, context) {
    this._router = router;
    this._context = context;

    // install the HTTP methods
    for (let i in methods) {
      var method = methods[i];
      this[method] = this.request.bind(this, method);
    }
  }


  request(method, ...args) {
    let context = this._context;
    let route;

    // the first arg might be a route
    if (typeof args[0] === 'string') {
      route = args.shift();
    }

    // wrap the handlers in promise/context handling functions
    args = args.map((fn) => function (request, response, next) {
      let result = fn.apply(context, arguments);

      if (typeof result !== 'undefined' && result !== null && typeof result.then === 'function') {
        result.then(undefined, next);
      }
    });

    // register the route with express
    if (route) args.unshift(route);
    this._router[method].apply(this._router, args);

    // allow chaining
    return this;
  }


  getRouter() {
    return this._router;
  }
}
