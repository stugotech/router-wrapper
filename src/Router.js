import Context from './Context';


var global = (function () {
  return this;
})();


export default class Router extends Context {
  constructor(router) {
    super(router, global);
  }
  
  context(ctx) {
    return new Context(this._router, ctx);
  }
}

export { Context };