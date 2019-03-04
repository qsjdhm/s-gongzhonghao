/**
 * Client.js  与客户端交互的功能js
 * 功能：提供出前端js和android、ios方法的通信与调用
 * 描述：
 *     1. 从客户端获取datajs数据
 *     2. 首页在框架中跳转其他页面
 *     3. 搜索框直接粘贴网址跳转
 *     4. 删除卡片后向客户端传递最新的datajs数据
 *     5. 关闭搜索页面
 *     6. 从搜索页面页面打开一级应用的应用列表
 *     7. 从客户端得到当前的cookie
 *     8. 删除卡片后向客户端传递最新的datajs数据
 */

var Client = function () {};
Client.prototype = function () {

    /* 各个页面所用到的公共方法 */
    // ios平台和js通信方法
    var _setupWebViewJavascriptBridge = function (callback) {
        if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
        if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement("iframe");
        WVJBIframe.style.display = "none";
        WVJBIframe.src = "wvjbscheme://__BRIDGE_LOADED__";
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
    };

    // 从客户端（安卓、ios）获取datajs数据
    var _getDataJSByClient = function (data) {
        $.ajax({
            url: "enterplorer://home/data.js",
            type: "post",
            dataType: "json",
            success: function(result) {
                if (result !== undefined) {
                    if($.isFunction(data.callback)){
                        data.callback(result);
                    }
                } else {
                    alert("从客户端获取datajs数据失败!");
                }
            },
            error: function(e) {
                // 在ios上请求成功会走error，你说蛋疼不蛋疼
                if (e.response !== undefined) {
                    if($.isFunction(data.callback)){
                        data.callback(JSON.parse(e.response));
                    }
                } else {
                    alert("从客户端获取datajs数据失败!");
                }
            }
        });
    };


    /* 首页所用到的方法 */
    // 首页在框架中跳转其他页面
    var _loadEnterURL = function (url, type, title) {
        // 判断是否是window平台，直接给客户端传入信息即可。
        if (window.enterplorer && (window.enterplorer.platform === "mobile" || window.enterplorer.platform === "desktop")) {
            var notice = { method: "loadEnterURL", data: {
                url   : url,
                type  : type,
                title : title
            }};
            window.external.notify(JSON.stringify(notice));
            return;
        } else if (window.enterplorer && window.enterplorer.platform === "pc") {
            var notice = { method: "loadEnterURL", data: {
                url   : url,
                type  : type,
                title : title
            }};
            windowpc.notify(JSON.stringify(notice));
            return;
        }

        // 判断是否是Android平台
        if (window.enterplorer_home) {
            window.enterplorer_home.loadEnterURL(url, type, title);
        } else {  // 是iOS平台
            _setupWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler("loadEnterURL", {
                    url   : url,
                    type  : type,
                    title : title
                }, function responseCallback(responseData) {
                    console.log("JS received response:", responseData)
                })
            });
        }
    };


    /* 搜索页所用到的方法 */
    // 搜索框直接粘贴网址跳转
    var _openNewWindow = function(url) {
        // 判断是否是window平台，直接给客户端传入信息即可。
        if (window.enterplorer && (window.enterplorer.platform === "mobile" || window.enterplorer.platform === "desktop")) {
            window.location = url;
        } else if (window.enterplorer && window.enterplorer.platform === "pc") {
            var notice = { method: "openNewWindow", data: {
                url   : url
            }};
            windowpc.notify(JSON.stringify(notice));
            return;
        } else {
            // 判断是否是Android平台
            if (window.enterplorer_home_search) {
                window.location = url;
            } else {
                _setupWebViewJavascriptBridge(function(bridge) {
                    bridge.callHandler("openNewWindow", {
                        url   : url
                    }, function responseCallback(responseData) {
                        console.log("JS received response:", responseData)
                    })
                });
            }
        }
    };

    // 关闭搜索页面
    var _cancelSearch = function () {
        // 判断是否是window平台，直接给客户端传入信息即可。
        if (window.enterplorer && (window.enterplorer.platform === "mobile" || window.enterplorer.platform === "desktop")) {
            var notice = { method: "cancelSearch", data: {}};
            window.external.notify(JSON.stringify(notice));
            return;
        } else if (window.enterplorer && window.enterplorer.platform === "pc") {
            var notice = { method: "cancelSearch", data: {}};
            windowpc.notify(JSON.stringify(notice));
            return;
        }

        // 判断是否是Android平台
        if (window.enterplorer_home_search) {
            window.enterplorer_home_search.cancelSearch();
        } else {  // 是iOS平台
            _setupWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler("cancelSearch", {}, function responseCallback(responseData) {
                    console.log("JS received response:", responseData)
                })
            });
        }
    };

    // 从搜索页面页面打开一级应用的应用列表
    var _startHomeURL = function (url, type, title) {
        // 判断是否是window平台，直接给客户端传入信息即可。
        if (window.enterplorer && (window.enterplorer.platform === "mobile" || window.enterplorer.platform === "desktop")) {
            var notice = { method: "startHomeURL", data: {
                url   : url,
                type  : type,
                title : title
            }};
            window.external.notify(JSON.stringify(notice));
            return;
        } else if (window.enterplorer && window.enterplorer.platform === "pc") {
            var notice = { method: "startHomeURL", data: {
                url   : url,
                type  : type,
                title : title
            }};
            windowpc.notify(JSON.stringify(notice));
            return;
        }

        // 判断是否是Android平台
        if (window.enterplorer_home_search) {
            window.enterplorer_home_search.startHomeURL(url, type, title);
        } else {  // 是iOS平台
            _setupWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler("startHomeURL", {
                    url   : url,
                    type  : type,
                    title : title
                }, function responseCallback(responseData) {
                    console.log("JS received response:", responseData)
                })
            });
        }
    };


    /* 添加应用卡片所用到的方法 */
    // 从客户端（安卓、ios）获取SID数据
    var _getCookieByClient = function (data) {
        if (window.enterplorer_home_extend) {
            var cookies = window.enterplorer_home_extend.getCookie();
            var cookieArr = cookies.split('; ');
            for (var cookieItem in cookieArr) {
                var cookie = cookieArr[cookieItem].split('=');
                if (cookie[0] === 'browser_server_sid' && cookie.length > 1) {
                    if($.isFunction(data.callback)){
                        data.callback(cookie[1]);
                    }
                    break;
                }
            }
        } else {
            _setupWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler("getCookie", {}, function responseCallback(responseData) {
                    var cookies = responseData;
                    var cookieArr = cookies.split('; ');
                    for (var cookieItem in cookieArr) {
                        var cookie = cookieArr[cookieItem].split('=');
                        if (cookie[0] === 'browser_server_sid' && cookie.length > 1) {
                            if($.isFunction(data.callback)){
                                data.callback(cookie[1]);
                            }
                            break;
                        }
                    }
                })
            });
        }
    };

    // 删除卡片后向客户端传递最新的datajs数据--添加卡片页
    var _modifyDataJsByCard = function (dataJs, refresh) {
        // 判断是否是Android平台
        if (window.enterplorer_home_extend) {
            window.enterplorer_home_extend.modifyDataJs(JSON.stringify(dataJs), refresh);
        } else {  // 是iOS平台
            _setupWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler("modifyDataJs", {
                    "datajs" : dataJs,
                    "refresh": refresh
                }, function responseCallback(responseData) {
                    console.log("JS received response:", responseData)
                })
            });
        }
    };


    return {
        setupWebViewJavascriptBridge : _setupWebViewJavascriptBridge,  // 外放和ios客户端交互时方法
        getDataJSByClient   : _getDataJSByClient   ,  // 从客户端获取datajs数据

        // 首页所需要的接口
        loadEnterURL        : _loadEnterURL        ,  // 首页在框架中跳转其他页面

        // 搜索页所需要的接口
        openNewWindow       : _openNewWindow       ,  // 搜索框直接粘贴网址跳转
        cancelSearch        : _cancelSearch        ,  // 关闭搜索页面
        startHomeURL        : _startHomeURL        ,  // 从搜索页面页面打开一级应用的应用列表

        // 添加应用卡片页所需要的接口
        getCookieByClient   : _getCookieByClient   ,  // 卡片管理页获取当前用户cookie
        modifyDataJsByCard  : _modifyDataJsByCard  ,  // 删除卡片后向客户端传递最新的datajs数据

    };
} ();


