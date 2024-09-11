// new操作符实现

function MyNew(Fun, ...args) {
  let newObj = {};
  newObj.__proto__ = Fun.prototype;
  const res = Fun.apply(newObj, args);
  return res instanceof Object ? res : newObj;
}

// call方法
Function.prototype.myCall = function (context) {
  const obj = context || window;
  const args = [...arguments].slice(1);
  obj.fn = this;
  let res = null;
  res = obj.fn(...args);
  delete obj.fn;
  return res;
}

// apply方法
Function.prototype.myApply = function (context, args) {
  let res = null;
  const obj = context || window;
  obj.fn = this;
  if (args) {
    res = obj.fn(...args);
  } else {
    res = obj.fn();
  }
  delete obj.fn;
  return res;
}

// bind方法
Function.prototype.myBind = function (context) {
  const args1 = [...arguments].slice(1);
  const self = this;
  const temp = function() {};
  const fn = function () {
    const obj = this instanceof temp ? this : (context || window);
    const args2 = [...arguments];
    return self.apply(obj, [...args1, ...args2]);
  }
  temp.prototype = self.prototype;
  fn.prototype = new temp();
  return fn;
}
