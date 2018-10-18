/**
 * 工具类函数
 */

const tool = {};

/**
 * 获取url参数
 * @param  {string} key 要获取的参数名称
 */
tool.getHash = (key) => {
  const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)');
  const r = window.location.search.substr(1).match(reg);
  if (r !== null) return unescape(r[2]);
  return null;
};

/**
 * 判断跳转白名单
 * @param {*} url
 * @param {*} allowDomains
 */
tool.isAllowDomains = function (url, allowDomains) {
  var domainStr = "",
    i = 0,
    result = [];
  if (!url) {
    return false;
  }
  for (i; i < allowDomains.length; i++) {
    allowDomains[i] = "(" + allowDomains[i].replace(".", "\\.") + ")";
  }
  domainStr = "(" + allowDomains.join("|") + ")";
  const regStr = new RegExp("^((http://)|(https://)|(//))?([0-9a-zA-Z\\._:\\-]*[\\.@])?" + domainStr + "(:[0-9]+)?(\/.*)?$");
  result = url.match(regStr);
  return !!(result && result[0]);
};

/**
 * 添加参数
 * @param {*} url
 * @param {*} param
 */
tool.insertParam = function addParameterToURL(url, param) {
  if (typeof param === 'object') {
    const keys = Object.keys(param);
    keys.forEach((key, idx) => {
      if (param[key]) {
        url += (url.split('?')[1] ? '&' : '?') + key + '=' + param[key];
      }
    });
    return url;
  }
  if (typeof param === 'string') {
    url += (url.split('?')[1] ? '&' : '?') + param;
    return url;
  }
};

/**
 * 获取url参数
 * @param  {string} key 要获取的参数名称
 */
tool.getHashWithOutUnescape = function (key) {
  var reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)');
  var r = window.location.search.substr(1).match(reg);
  if (r !== null) return r[2];
  return null;
};

/**
 * 时间戳格式化
 * @param  {number} smpt 时间戳
 * @param  {string} fmt 格式
 * (new Date()).Format("yyyy-MM-dd h:m:s.S") ==> 2016-10-20 8:9:4.18
 */
tool.dateFormat = (smpt, fmt) => {
  smpt = smpt ? parseInt(smpt) : new Date().getTime();
  fmt = fmt || 'yyyy-MM-dd hh:mm:ss';
  const dateObj = new Date(smpt);
  const o = {
    'M+': dateObj.getMonth() + 1, // 月份
    'd+': dateObj.getDate(), // 日
    'h+': dateObj.getHours(), // 小时
    'm+': dateObj.getMinutes(), // 分
    's+': dateObj.getSeconds(), // 秒
    'q+': Math.floor((dateObj.getMonth() + 3) / 3), // 季度
    'S': dateObj.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (dateObj.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
  return fmt;
};

/**
 * 判断终端
 * tool.browser.mobile/ios/android
 */
tool.browser = (() => {
  const u = navigator.userAgent,
    app = navigator.appVersion;
  return {
    mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/),
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1
  };
})();

/**
 * 数组/对象的深拷贝
 * @param  {[type]} origin [description]
 */
tool.clone = (origin) => {
  if (typeof origin !== 'object') {
    console.log('非对象');
    return;
  }
  return JSON.parse(JSON.stringify(origin));
};


tool.addHandler = (element, type, handler) => {
  if (element.addEventListener) {
    element.addEventListener(type, handler, false);
  } else if (element.attachEvent) {
    element.attachEvent('on' + type, handler);
  } else {
    element['on' + type] = handler;
  }
};

export default tool;
