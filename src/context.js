
var methods = [
  'checkout', 'connect', 'copy', 'delete', 'get', 'head', 'lock', 'merge', 'mkactivity', 'mkcol', 'move',
  'm-search', 'notify', 'options', 'patch', 'post', 'propfind', 'proppatch', 'purge', 'put', 'report',
  'search', 'subscribe', 'trace', 'unlock', 'unsubscribe'
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
  
  
  request(method, route, ...args) {
    let context = this._context;
    
    args = args.map((fn) => function (request, response, next) {
      let result = fn.call(context, request, response, next);
      
      if (typeof result !== 'undefined' && result !== null && typeof result.then === 'function') {
        result.then(void 0, next);
      }
    });
    
    // register the route with express
    args.unshift(route);
    this._router[method].apply(this._router, args);
  }
}