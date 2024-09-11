class HashRouter {
  constructor() {
    this.router = {};
    window.addEventListener('hashchange', this.load.bind(this));
  }
  // 用于注册每个视图
  register(hash, callback = function() {}) {
    this.router[hash] = callback;
  }
  // 用于注册首页
  registerIndex(callback = function() {}) {
    this.router['index'] = callback;
  }
  registerNotFound(callback = function() {}) {
    this.router['404'] = callback;
  }
  registerError(callback = function() {}) {
    this.router['error'] = callback;
  }
  // 用于调用不同视图的回调函数
  load() {
    const hash = location.hash.slice(1);
    let hander;
    // 没有hash默认设置为首页
    if (!hash) {
      hander = this.router.index;
    } else if (!this.router.hasOwnProperty(hash)) {
      hander = this.router['404'] || function() {};
    } else {
      hander = this.router[hash];
    }
    // 执行注册的回调函数
    try {
      hander.call(this);
    } catch (error) {
      (this.router['error'] || function() {}).call(this, error);
    }
  }
}