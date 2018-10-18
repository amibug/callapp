/**
 * @desc debug工具
 */
require('./debug.less');
import tool from './tool.js';
import tpls from './template.js';

let debug = {};

// var a = NaN;
// var b = 0;
// var c = 123;
// var d = 'abc';
// var e = {a:1,b:2};
// var f = undefined;
// var g = null;
// var h = function(){};
// var i = [1,2,3,4,5];
// debug.log('aaa',a);
// debug.log(b);
// debug.log(c);
// debug.log(d);
// debug.log(e);
// debug.log(f);
// debug.log(g);
// debug.log(h);
// debug.log(i);
// debug.log('哈哈',i);
// debug.log(i);
// debug.log(i);
// debug.log(i);
// debug.log(i);
// debug.log(i);

/**
 * 日志打印
 * @return {[type]}         [description]
 */
debug.log = function() {
  const $ = window.Zepto;
  if(!$){
    console.log('Zepto is undefined');
    return;
  }
  console.log(arguments);
  if (!tool.getHash('debug')) return;
  if (!document.querySelector('#DebugPop')) {
    $('body').append(tpls.pop());
  }
  const generator = (arg) => {
    let str = '';
    if (arg === undefined || arg === null) str = arg;
    // 打印函数或者NaN
    if (typeof arg === 'function' || typeof arg === 'number') {
      str = arg.toString();
    } else {
      str = JSON.stringify(arg);
    }
    // 布尔值转string
    return str+'';
  };
  let finalStr = '';
  for (let i = 0; i < arguments.length; i++) {
    finalStr += generator(arguments[i]) + ',';
  }
  finalStr = finalStr.substr(0, finalStr.length - 1);
  try {
    $('#DebugPopboxContent').append(tpls.popItem(finalStr));
  } catch (e) {
    console.log('log error', JSON.stringify(e));
  }
  // 清屏
  $('#DebugPopboxClear').on('click', () => {
    $('#DebugPopboxContent').html('');
  });
  // 关闭
  $('#DebugPopboxClose').on('click', () => {
    $('#DebugPop').remove();
  });
};

window.debug = debug;

export default debug;
