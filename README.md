app唤起说明

## 引用方式
* CommonJS方式
```
var callapp = require('@amibug/callapp');
```

## 调用
**callapp.gotoPage(url, packageName[, forceIntent])**
* url: URL scheme
* packageName: Android下客户端的包名称
* forceIntent: true/false，默认为false，是否强制使用intent协议

```
// 如: app首页
callapp.gotoPage('', 'com.eg.android.xxx');
```
