import tool from '../utils/tool.js';
import debug from '../utils/debug.js';

const callapp = {};
let ua = '';
if (tool.getHash('debug') && tool.getHash('ua')) {
  ua = tool.getHash('ua');
} else {
  ua = window.navigator.userAgent;
}

// 确定OS系统及版本
let isAndroid = false;
let isIOS = false;
let osVersion = '';
let matched = ua.match(/Android[\s\/]([\d\.]+)/);
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
  const v1 = a.split('.');
  const v2 = b.split('.');

  for (let i = 0; i < v1.length || i < v2.length; i += 1) {
    const n1 = parseInt(v1[i], 10) || 0;
    const n2 = parseInt(v2[i], 10) || 0;

    if (n1 < n2) {
      return -1;
    } else if (n1 > n2) {
      return 1;
    }
  }

  return 0;
}

// 确定浏览器类型
let isChrome = false;
let isSafari = false;
let isWebview = false;
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

const doc = window.document;
let iframe;

function callInIframe(url) {
  debug.log('in iframe func', url);
  if (!iframe) {
    debug.log('create iframe');
    iframe = doc.createElement('iframe');
    iframe.id = `callapp_iframe_${Date.now()}`;
    iframe.frameborder = '0';
    iframe.style.cssText = 'display:none;border:0;width:0;height:0;';
    doc.body.appendChild(iframe);
  }

  iframe.src = url;
}

function useAnchorLink(url) {
  const a = doc.createElement('a');
  a.setAttribute('href', url);
  a.style.display = 'none';
  doc.body.appendChild(a);

  const e = doc.createEvent('HTMLEvents');
  e.initEvent('click', false, false);
  a.dispatchEvent(e);
}


/**
 * 判断schema是不是url
 * @param  {[type]}  str [schema参数]
 * @return {Boolean}     [description]
 */
function isUrl(str) {
  return /^(http|https)\:\/\//.test(str);
}

callapp.gotoPage = function gotoPage(url, packageName, forceIntent) {
  let targetUrl = url;
  debug.log('targetUrl', url);
  // intent 协议资料参考https://developer.chrome.com/multidevice/android/intents
  // 标准 Android Chrome 浏览器（包括 Android 原生的 Chrome 浏览器）需要用 intent 协议
  const isOriginalChrome = isAndroid && isChrome && !isWebview;
  // 三星4.3/4.4的一些机型，原生浏览器需要 intent 协议
  const fixUgly = isAndroid && !!ua.match(/samsung/i) && verCompare(osVersion, '4.3') >= 0 && verCompare(osVersion, '4.5') < 0;
  // iOS 9.0及以上需要用a标签的href
  const ios9SafariFix = isIOS && verCompare(osVersion, '9.0') >= 0 && isSafari;

  debug.log('isOriginalChrome', isOriginalChrome);
  debug.log('fixUgly', fixUgly);
  debug.log('ios9SafariFix', ios9SafariFix);
  debug.log('forceIntent', forceIntent);

  if (isOriginalChrome || !!forceIntent) {
    // Chrome 里用 intent 协议
    const protocol = targetUrl.substring(0, targetUrl.indexOf('://'));
    const hash = `#Intent;scheme=${protocol};package=${packageName};end`;
    targetUrl = targetUrl.replace(/.*?\:\/\//, 'intent://');
    targetUrl += hash;
    debug.log('Intent', targetUrl);
  }
  if (ios9SafariFix) {
    if (isUrl(targetUrl)) {
      window.Tracker && window.Tracker.click && window.Tracker.click('not_schema');
      console.log('not schema');
      return;
    }
    setTimeout(() => {
      useAnchorLink(targetUrl)
    }, 100);
  } else if (targetUrl.indexOf('intent:') === 0) {
    // 用 intent 协议时，直接 location 跳转
    debug.log('jump intent');
    setTimeout(() => {
      // window.open(targetUrl);
      window.location.href = targetUrl
    }, 100);
  } else {
    // 在 iframe 中无法使用 intent 协议
    const reg = /^(http(s)?\:|javascript\:|vbscript\:|file\:|data\:|sms\:|smsto\:|tel\:|mailto\:|aliim\:|dingtalk\:|weixin\:)/;
    if (!reg.test(targetUrl.toLocaleLowerCase())) {
      debug.log('call in iframe');
      callInIframe(targetUrl);
    } else {
      debug.log('schema is url');
    }
  }
};

export default callapp;
