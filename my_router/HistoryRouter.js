/**
 * 浏览器History对象方法：
 * history.go(-1) // 后退一页
 * history.go(2) // 前进两页
 * history.forward() // 前进一页
 * history.goback() // 后退一页
 * 
 * HTML5规范新增的API：
 * history.pushState() // 添加新的状态到历史状态栈
 * history.replaceState() // 用新的状态代替当前状态
 * history.state() // 返回当前状态对象
 * 
 * history.pushState() 和 history.replaceState() 均接收3个参数(state, title, url)
 * 1. state: 合法的JavaScript对象，可以用在popstate事件中
 * 2. title: 现在大多数浏览器忽略此参数，可直接用null代替
 * 3. url: 任意有效的url，用于更新浏览器的地址栏
 * 
 * 区别：
 * history.pushState()在保留当前历史记录的同时，将url加入到历史记录中；
 * history.replaceState()会将历史记录中的当前页面历史替换为url
 * 
 * 由于history.pushState() 和 history.replaceState() 可以改变url的同时不刷新页面，所以在HTML5中的history具备了实现前端路由的能力。
 */

/**
 * history改变不会触发任何事件，所以无法直接监听history改变而做出相应改变。
 * 我们可以列出所有能触发history改变的情况，并进行一一拦截，变相监听history改变。
 * 
 * 对于单页面应用的history而言，url只能由以下4种方式改变：
 * 1. 点击浏览器前进或后退按钮
 * 2. 点击 a 标签
 * 3. 在JavaScript代码中触发history.pushState方法
 * 4. 在JavaScript代码中触发history.replaceState方法
 */

const basePath = '/JavaScript/my_router/testHistory.html';
class HistoryRouter {
  constructor() {
    this.router = {};
    this.listenPopstate();
    this.listenLinkClick();
  }
  getFullPath(path) {
    return basePath + path;
  }
  // 监听popstate事件，处理浏览器前进或后退按钮
  listenPopstate() {
    window.addEventListener('popstate', (e) => {
      const state = e.state || {};
      const path = state.path || '';
      this.dealPath(path);
    });
  }
  // 全局组织a链接的默认事件，获取a链接的href属性，调用history.pushState方法
  listenLinkClick() {
    window.addEventListener('click', (e) => {
      const dom = e.target || {};
      if (dom.tagName.toUpperCase() === 'A' && dom.getAttribute('href')) {
        e.preventDefault();
        const href = dom.getAttribute('href');
        this.assign(href);
      };
    });
  }
  load() {
    const path = location.pathname;
    this.dealPath(path);
  }
  // 注册path
  register(path, callback = function () { }) {
    this.router[path] = callback;
  }
  registerIndex(callback = function () { }) {
    this.router[basePath] = callback;
  }
  registerNotFound(callback = function () { }) {
    this.router['404'] = callback;
  }
  registerError(callback = function () { }) {
    this.router['error'] = callback;
  }
  // 定义assign方法，用于js触发pushState方法
  assign(path) {
    history.pushState({ path }, null, path);
    this.dealPath(path)
  }
  // 定义replace方法，用于js触发replaceState方法
  replace(path) {
    history.replaceState({ path }, null, path);
    this.dealPath(path);
  }
  dealPath(path) {
    let handler;
    if (!this.router.hasOwnProperty(path)) {
      handler = this.router['404'] || function() {};
    } else {
      handler = this.router[path];
    }
    try {
      handler.call(this);
    } catch (error) {
      (this.router['error'] || function() {}).call(this, error);
    }
  }
}