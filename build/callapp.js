(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("callapp", [], factory);
	else if(typeof exports === 'object')
		exports["callapp"] = factory();
	else
		root["callapp"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _tool = __webpack_require__(1);

	var _tool2 = _interopRequireDefault(_tool);

	var _debug = __webpack_require__(2);

	var _debug2 = _interopRequireDefault(_debug);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var callapp = {};
	var ua = '';
	if (_tool2.default.getHash('debug') && _tool2.default.getHash('ua')) {
	  ua = _tool2.default.getHash('ua');
	} else {
	  ua = window.navigator.userAgent;
	}

	// 确定OS系统及版本
	var isAndroid = false;
	var isIOS = false;
	var osVersion = '';
	var matched = ua.match(/Android[\s\/]([\d\.]+)/);
	if (matched) {
	  isAndroid = true;
	  osVersion = matched[1];
	} else if (ua.match(/(iPhone|iPad|iPod)/)) {
	  isIOS = true;
	  matched = ua.match(/OS ([\d_\.]+) like Mac OS X/);
	  if (matched) {
	    osVersion = matched[1].split('_').join('.');
	  }
	}

	// OS系统版本比较
	function verCompare(a, b) {
	  var v1 = a.split('.');
	  var v2 = b.split('.');

	  for (var i = 0; i < v1.length || i < v2.length; i += 1) {
	    var n1 = parseInt(v1[i], 10) || 0;
	    var n2 = parseInt(v2[i], 10) || 0;

	    if (n1 < n2) {
	      return -1;
	    } else if (n1 > n2) {
	      return 1;
	    }
	  }

	  return 0;
	}

	// 确定浏览器类型
	var isChrome = false;
	var isSafari = false;
	var isWebview = false;
	if (ua.match(/(?:Chrome|CriOS)\/([\d\.]+)/)) {
	  isChrome = true;
	  if (ua.match(/Version\/[\d+\.]+\s*Chrome/)) {
	    isWebview = true;
	  }
	} else if (ua.match(/iPhone|iPad|iPod/)) {
	  if (ua.match(/Safari/) && ua.match(/Version\/([\d\.]+)/)) {
	    isSafari = true;
	  } else if (ua.match(/OS ([\d_\.]+) like Mac OS X/)) {
	    isWebview = true;
	  }
	}

	var doc = window.document;
	var iframe = void 0;

	function callInIframe(url) {
	  _debug2.default.log('in iframe func', url);
	  if (!iframe) {
	    _debug2.default.log('create iframe');
	    iframe = doc.createElement('iframe');
	    iframe.id = 'callapp_iframe_' + Date.now();
	    iframe.frameborder = '0';
	    iframe.style.cssText = 'display:none;border:0;width:0;height:0;';
	    doc.body.appendChild(iframe);
	  }

	  iframe.src = url;
	}

	function useAnchorLink(url) {
	  var a = doc.createElement('a');
	  a.setAttribute('href', url);
	  a.style.display = 'none';
	  doc.body.appendChild(a);

	  var e = doc.createEvent('HTMLEvents');
	  e.initEvent('click', false, false);
	  a.dispatchEvent(e);
	}

	/**
	 * 判断schema是不是url
	 * @param  {[type]}  str [schema参数]
	 * @return {Boolean}     [description]
	 */
	function isUrl(str) {
	  return (/^(http|https)\:\/\//.test(str)
	  );
	}

	callapp.gotoPage = function gotoPage(url, packageName, forceIntent) {
	  var targetUrl = url;
	  _debug2.default.log('targetUrl', url);
	  // intent 协议资料参考https://developer.chrome.com/multidevice/android/intents
	  // 标准 Android Chrome 浏览器（包括 Android 原生的 Chrome 浏览器）需要用 intent 协议
	  var isOriginalChrome = isAndroid && isChrome && !isWebview;
	  // 三星4.3/4.4的一些机型，原生浏览器需要 intent 协议
	  var fixUgly = isAndroid && !!ua.match(/samsung/i) && verCompare(osVersion, '4.3') >= 0 && verCompare(osVersion, '4.5') < 0;
	  // iOS 9.0及以上需要用a标签的href
	  var ios9SafariFix = isIOS && verCompare(osVersion, '9.0') >= 0 && isSafari;

	  _debug2.default.log('isOriginalChrome', isOriginalChrome);
	  _debug2.default.log('fixUgly', fixUgly);
	  _debug2.default.log('ios9SafariFix', ios9SafariFix);
	  _debug2.default.log('forceIntent', forceIntent);

	  if (isOriginalChrome || !!forceIntent) {
	    // Chrome 里用 intent 协议
	    var protocol = targetUrl.substring(0, targetUrl.indexOf('://'));
	    var hash = '#Intent;scheme=' + protocol + ';package=' + packageName + ';end';
	    targetUrl = targetUrl.replace(/.*?\:\/\//, 'intent://');
	    targetUrl += hash;
	    _debug2.default.log('Intent', targetUrl);
	  }
	  if (ios9SafariFix) {
	    if (isUrl(targetUrl)) {
	      window.Tracker && window.Tracker.click && window.Tracker.click('not_schema');
	      console.log('not schema');
	      return;
	    }
	    setTimeout(function () {
	      useAnchorLink(targetUrl);
	    }, 100);
	  } else if (targetUrl.indexOf('intent:') === 0) {
	    // 用 intent 协议时，直接 location 跳转
	    _debug2.default.log('jump intent');
	    setTimeout(function () {
	      // window.open(targetUrl);
	      window.location.href = targetUrl;
	    }, 100);
	  } else {
	    // 在 iframe 中无法使用 intent 协议
	    var reg = /^(http(s)?\:|javascript\:|vbscript\:|file\:|data\:|sms\:|smsto\:|tel\:|mailto\:|aliim\:|dingtalk\:|weixin\:)/;
	    if (!reg.test(targetUrl.toLocaleLowerCase())) {
	      _debug2.default.log('call in iframe');
	      callInIframe(targetUrl);
	    } else {
	      _debug2.default.log('schema is url');
	    }
	  }
	};

	exports.default = callapp;
	module.exports = exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	/**
	 * 工具类函数
	 */

	var tool = {};

	/**
	 * 获取url参数
	 * @param  {string} key 要获取的参数名称
	 */
	tool.getHash = function (key) {
	  var reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)');
	  var r = window.location.search.substr(1).match(reg);
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
	  var regStr = new RegExp("^((http://)|(https://)|(//))?([0-9a-zA-Z\\._:\\-]*[\\.@])?" + domainStr + "(:[0-9]+)?(\/.*)?$");
	  result = url.match(regStr);
	  return !!(result && result[0]);
	};

	/**
	 * 添加参数
	 * @param {*} url
	 * @param {*} param
	 */
	tool.insertParam = function addParameterToURL(url, param) {
	  if ((typeof param === 'undefined' ? 'undefined' : _typeof(param)) === 'object') {
	    var keys = Object.keys(param);
	    keys.forEach(function (key, idx) {
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
	tool.dateFormat = function (smpt, fmt) {
	  smpt = smpt ? parseInt(smpt) : new Date().getTime();
	  fmt = fmt || 'yyyy-MM-dd hh:mm:ss';
	  var dateObj = new Date(smpt);
	  var o = {
	    'M+': dateObj.getMonth() + 1, // 月份
	    'd+': dateObj.getDate(), // 日
	    'h+': dateObj.getHours(), // 小时
	    'm+': dateObj.getMinutes(), // 分
	    's+': dateObj.getSeconds(), // 秒
	    'q+': Math.floor((dateObj.getMonth() + 3) / 3), // 季度
	    'S': dateObj.getMilliseconds() // 毫秒
	  };
	  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (dateObj.getFullYear() + '').substr(4 - RegExp.$1.length));
	  for (var k in o) {
	    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
	  }return fmt;
	};

	/**
	 * 判断终端
	 * tool.browser.mobile/ios/android
	 */
	tool.browser = function () {
	  var u = navigator.userAgent,
	      app = navigator.appVersion;
	  return {
	    mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/),
	    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
	    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1
	  };
	}();

	/**
	 * 数组/对象的深拷贝
	 * @param  {[type]} origin [description]
	 */
	tool.clone = function (origin) {
	  if ((typeof origin === 'undefined' ? 'undefined' : _typeof(origin)) !== 'object') {
	    console.log('非对象');
	    return;
	  }
	  return JSON.parse(JSON.stringify(origin));
	};

	tool.addHandler = function (element, type, handler) {
	  if (element.addEventListener) {
	    element.addEventListener(type, handler, false);
	  } else if (element.attachEvent) {
	    element.attachEvent('on' + type, handler);
	  } else {
	    element['on' + type] = handler;
	  }
	};

	exports.default = tool;
	module.exports = exports['default'];

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _tool = __webpack_require__(1);

	var _tool2 = _interopRequireDefault(_tool);

	var _template = __webpack_require__(3);

	var _template2 = _interopRequireDefault(_template);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @desc debug工具
	 */
	__webpack_require__(4);


	var debug = {};

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
	debug.log = function () {
	  var $ = window.Zepto;
	  if (!$) {
	    console.log('Zepto is undefined');
	    return;
	  }
	  console.log(arguments);
	  if (!_tool2.default.getHash('debug')) return;
	  if (!document.querySelector('#DebugPop')) {
	    $('body').append(_template2.default.pop());
	  }
	  var generator = function generator(arg) {
	    var str = '';
	    if (arg === undefined || arg === null) str = arg;
	    // 打印函数或者NaN
	    if (typeof arg === 'function' || typeof arg === 'number') {
	      str = arg.toString();
	    } else {
	      str = JSON.stringify(arg);
	    }
	    // 布尔值转string
	    return str + '';
	  };
	  var finalStr = '';
	  for (var i = 0; i < arguments.length; i++) {
	    finalStr += generator(arguments[i]) + ',';
	  }
	  finalStr = finalStr.substr(0, finalStr.length - 1);
	  try {
	    $('#DebugPopboxContent').append(_template2.default.popItem(finalStr));
	  } catch (e) {
	    console.log('log error', JSON.stringify(e));
	  }
	  // 清屏
	  $('#DebugPopboxClear').on('click', function () {
	    $('#DebugPopboxContent').html('');
	  });
	  // 关闭
	  $('#DebugPopboxClose').on('click', function () {
	    $('#DebugPop').remove();
	  });
	};

	window.debug = debug;

	exports.default = debug;
	module.exports = exports['default'];

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * @desc 模板工具
	 */

	var templates = {

	  /**
	   * 弹窗模板
	   * @return {[type]} [description]
	   */
	  pop: function pop() {
	    return "\n      <div id=\"DebugPop\">\n        <div id=\"DebugPopbox\">\n          <ul id=\"DebugPopboxContent\">\n          </ul>\n        </div>\n        <button id=\"DebugPopboxClear\" class=\"debug-button\">\u6E05\u5C4F</button>\n        <button id=\"DebugPopboxClose\" class=\"debug-button\">\u5173\u95ED</button>\n      </div>\n    ";
	  },
	  /**
	   * 每条log
	   * @param  {string} content [log内容]
	   * @return {[type]}         [description]
	   */
	  popItem: function popItem(content) {
	    return "\n      <li>" + content + "</li>\n    ";
	  }
	};

	exports.default = templates;
	module.exports = exports["default"];

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(5);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// Prepare cssTransformation
	var transform;

	var options = {}
	options.transform = transform
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, options);
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../node_modules/_css-loader@0.28.11@css-loader/index.js!../node_modules/_autoprefixer-loader@3.2.0@autoprefixer-loader/index.js!../node_modules/_less-loader@4.1.0@less-loader/dist/cjs.js!./debug.less", function() {
				var newContent = require("!!../node_modules/_css-loader@0.28.11@css-loader/index.js!../node_modules/_autoprefixer-loader@3.2.0@autoprefixer-loader/index.js!../node_modules/_less-loader@4.1.0@less-loader/dist/cjs.js!./debug.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)(false);
	// imports


	// module
	exports.push([module.id, "#DebugPop {\n  position: fixed;\n  right: 0;\n  bottom: 0;\n  width: 4.5rem;\n  height: 7rem;\n}\n#DebugPop #DebugPopbox {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  overflow-x: hidden;\n  overflow-y: auto;\n  border-radius: 0.1rem;\n  background: rgba(0, 0, 0, 0.5);\n  color: #fff;\n}\n#DebugPop #DebugPopbox ul {\n  width: 100%;\n  height: 100%;\n}\n#DebugPop #DebugPopbox ul li {\n  line-height: 0.3rem;\n  border-bottom: 1px dotted rgba(255, 255, 255, 0.6);\n  background: rgba(0, 0, 0, 0.5);\n  color: rgba(255, 255, 255, 0.9);\n  text-align: left;\n  padding: 0.1rem 0.05rem;\n  word-break: break-all;\n}\n#DebugPop #DebugPopbox ul li:last-child {\n  border-bottom: none;\n}\n#DebugPop .debug-button {\n  position: absolute;\n  z-index: 1000;\n  right: 0;\n  height: 0.4rem;\n  line-height: 0.4rem;\n  width: 0.8rem;\n  top: -0.43rem;\n  color: rgba(255, 255, 255, 0.8);\n  border-radius: 0.1rem;\n  background: transparent;\n  border: 1px solid rgba(0, 0, 0, 0.5);\n  background: rgba(0, 0, 0, 0.4);\n  cursor: pointer;\n}\n#DebugPop .debug-button:active {\n  color: rgba(255, 255, 255, 0.6);\n  background: rgba(0, 0, 0, 0.6);\n}\n#DebugPop #DebugPopboxClear {\n  right: 0.9rem;\n}\n", ""]);

	// exports


/***/ }),
/* 6 */
/***/ (function(module, exports) {

	"use strict";

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function (useSourceMap) {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			return this.map(function (item) {
				var content = cssWithMappingToString(item, useSourceMap);
				if (item[2]) {
					return "@media " + item[2] + "{" + content + "}";
				} else {
					return content;
				}
			}).join("");
		};

		// import a list of modules into the list
		list.i = function (modules, mediaQuery) {
			if (typeof modules === "string") modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for (var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if (typeof id === "number") alreadyImportedModules[id] = true;
			}
			for (i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if (mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if (mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};

	function cssWithMappingToString(item, useSourceMap) {
		var content = item[1] || '';
		var cssMapping = item[3];
		if (!cssMapping) {
			return content;
		}

		if (useSourceMap && typeof btoa === 'function') {
			var sourceMapping = toComment(cssMapping);
			var sourceURLs = cssMapping.sources.map(function (source) {
				return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
			});

			return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
		}

		return [content].join('\n');
	}

	// Adapted from convert-source-map (MIT)
	function toComment(sourceMap) {
		// eslint-disable-next-line no-undef
		var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
		var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

		return '/*# ' + data + ' */';
	}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			// Test for IE <= 9 as proposed by Browserhacks
			// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
			// Tests for existence of standard globals is to allow style-loader 
			// to operate correctly into non-standard environments
			// @see https://github.com/webpack-contrib/style-loader/issues/177
			return window && document && document.all && !window.atob;
		}),
		getElement = (function(fn) {
			var memo = {};
			return function(selector) {
				if (typeof memo[selector] === "undefined") {
					memo[selector] = fn.call(this, selector);
				}
				return memo[selector]
			};
		})(function (styleTarget) {
			return document.querySelector(styleTarget)
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [],
		fixUrls = __webpack_require__(8);

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		options.attrs = typeof options.attrs === "object" ? options.attrs : {};

		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the <head> element
		if (typeof options.insertInto === "undefined") options.insertInto = "head";

		// By default, add <style> tags to the bottom of the target
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list, options);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList, options);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	};

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list, options) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = options.base ? item[0] + options.base : item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var styleTarget = getElement(options.insertInto)
		if (!styleTarget) {
			throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
		}
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				styleTarget.insertBefore(styleElement, styleTarget.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				styleTarget.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				styleTarget.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			styleTarget.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		options.attrs.type = "text/css";

		attachTagAttrs(styleElement, options.attrs);
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		options.attrs.type = "text/css";
		options.attrs.rel = "stylesheet";

		attachTagAttrs(linkElement, options.attrs);
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function attachTagAttrs(element, attrs) {
		Object.keys(attrs).forEach(function (key) {
			element.setAttribute(key, attrs[key]);
		});
	}

	function addStyle(obj, options) {
		var styleElement, update, remove, transformResult;

		// If a transform function was defined, run it on the css
		if (options.transform && obj.css) {
		    transformResult = options.transform(obj.css);
		    
		    if (transformResult) {
		    	// If transform returns a value, use that instead of the original css.
		    	// This allows running runtime transformations on the css.
		    	obj.css = transformResult;
		    } else {
		    	// If the transform function returns a falsy value, don't add this css. 
		    	// This allows conditional loading of css
		    	return function() {
		    		// noop
		    	};
		    }
		}

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement, options);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, options, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		/* If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
		*/
		var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

		if (options.convertToAbsoluteUrls || autoFixUrls){
			css = fixUrls(css);
		}

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	"use strict";

	/**
	 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
	 * embed the css on the page. This breaks all relative urls because now they are relative to a
	 * bundle instead of the current page.
	 *
	 * One solution is to only use full urls, but that may be impossible.
	 *
	 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
	 *
	 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
	 *
	 */

	module.exports = function (css) {
		// get current location
		var location = typeof window !== "undefined" && window.location;

		if (!location) {
			throw new Error("fixUrls requires window.location");
		}

		// blank or null?
		if (!css || typeof css !== "string") {
			return css;
		}

		var baseUrl = location.protocol + "//" + location.host;
		var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

		// convert each url(...)
		/*
	 This regular expression is just a way to recursively match brackets within
	 a string.
	 	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	    (  = Start a capturing group
	      (?:  = Start a non-capturing group
	          [^)(]  = Match anything that isn't a parentheses
	          |  = OR
	          \(  = Match a start parentheses
	              (?:  = Start another non-capturing groups
	                  [^)(]+  = Match anything that isn't a parentheses
	                  |  = OR
	                  \(  = Match a start parentheses
	                      [^)(]*  = Match anything that isn't a parentheses
	                  \)  = Match a end parentheses
	              )  = End Group
	              *\) = Match anything and then a close parens
	          )  = Close non-capturing group
	          *  = Match anything
	       )  = Close capturing group
	  \)  = Match a close parens
	 	 /gi  = Get all matches, not the first.  Be case insensitive.
	  */
		var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function (fullMatch, origUrl) {
			// strip quotes (if they exist)
			var unquotedOrigUrl = origUrl.trim().replace(/^"(.*)"$/, function (o, $1) {
				return $1;
			}).replace(/^'(.*)'$/, function (o, $1) {
				return $1;
			});

			// already a full url? no change
			if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
				return fullMatch;
			}

			// convert the url to a full url
			var newUrl;

			if (unquotedOrigUrl.indexOf("//") === 0) {
				//TODO: should we add protocol?
				newUrl = unquotedOrigUrl;
			} else if (unquotedOrigUrl.indexOf("/") === 0) {
				// path should be relative to the base url
				newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
			} else {
				// path should be relative to current directory
				newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
			}

			// send back the fixed url(...)
			return "url(" + JSON.stringify(newUrl) + ")";
		});

		// send back the fixed css
		return fixedCss;
	};

/***/ })
/******/ ])
});
;