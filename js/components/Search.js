/**
 * Search.js  搜索页功能模块
 * 功能：搜索本地应用，并且点击应用进行跳转
 */

var Search = function () {};
Search.prototype = function () {

    var url_reg = /((http|ftp|https|enterplorer):\/\/)?(([a-zA-Z0-9\._-]+\.[a-zA-Z]{2,6})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,4})*(\/[a-zA-Z0-9\&%_\.\/-~-]*)?/;

    // 实时搜索相匹配的app
    var _searchApp = function (event, keyword) {
        if (event) {
            event.preventDefault();
        }

        var apps = [];
        var searched_apps = [];
        // 从应用组得到所有应用
        for (var i = 0; i < APP_DATA.groups.length; i++) {
            var groupApps = APP_DATA.groups[i].apps;
            for (var j = 0; j < groupApps.length; j++) {
                apps.push(groupApps[j]);
            }
        }

        for (var i = 0; i <= apps.length - 1; i ++) {
            var app = apps[i];

            // 将app的名字转换成大写，然后再将关键字转换成大写
            var cap_app_name = app.appName.toUpperCase();
            var cap_keyword = keyword.toUpperCase();

            if (cap_app_name.indexOf(cap_keyword) > -1) {
                searched_apps.push(app);
            }
            for (var j = 0; j <= app.subApps.length - 1; j ++) {
                // 得到子app名字，并转换成大写
                var cap_sub_app_name = app.subApps[j].appName.toUpperCase();

                if (cap_sub_app_name.indexOf(cap_keyword) > -1) {
                    searched_apps.push(app.subApps[j]);
                }
            }
        }
        if (searched_apps.length) {
            // 组织搜索到的APP列表
            _dealSearchedApp(searched_apps);
        } else {
            $("#searched_apps").addClass("no-result").html("暂无本地应用");
        }
    };

    // 组织搜索到的APP列表
    var _dealSearchedApp = function (searchedApps) {
        var html    = '',
            regular = /^[a-fA-F0-9]{32}\/index\.html$/;

        for (var i in searchedApps) {
            var app        = searchedApps[i],
                url        = "",
                searchItem = "";

            var app_id       = app.appId === undefined ? "" : app.appId,
                app_name     = app.appName === undefined ? "" : app.appName,
                app_img_url  = app.appImgUrl === undefined ? "" : app.appImgUrl,
                app_link     = app.appLink === undefined ? "" : app.appLink;

            if (app.subApps && app.subApps.length > 0 && regular.test(app_link)) {
                url = _resetSubAppUrl("list.html", app_id, app_name);

                html += '<div class="item" key='+app_id+'>';
                html += '   <a containsSubApp="'+url+'" appName="'+app_name+'" onClick="SEARCH.openSubAppPage(this)">';
                html += '       <img class="icon" alt="图标" src="'+app_img_url+'" onerror="SEARCH.setDefaultImg(this)" />';
                html += '       <span>'+app_name+'</span>';
                html += '   </a>';
                html += '</div>';
            } else {
                url = _resetSubAppUrl(app_link, app_id, app_name);

                html += '<div class="item" key='+app_id+'>';
                html += '   <a href="'+url+'">';
                html += '       <img class="icon" alt="图标" src="'+app_img_url+'" onerror="SEARCH.setDefaultImg(this)" />';
                html += '       <span>'+app_name+'</span>';
                html += '   </a>';
                html += '</div>';
            }
        }

        $("#searched_apps").empty().removeClass("no-result").append(html);
    };

    // 图片加载出错的时候设置默认图片
    var _setDefaultImg = function (img) {
        img.src = "i/default_icon.png";
        img.onerror = null;
    };

    // 打开二级应用列表页面
    var _openSubAppPage = function (item) {
        var $item = $(item);
            path_link = $item.attr("containsSubApp"),
            app_name  = $item.attr("appName");
        // 调用客户端enterplorer_home_search的startHomeURL方法
        CLIENT.startHomeURL(path_link, "ENTERPLORER_LIST", app_name);
    };

    //  对URL添加统计信息
    var _resetSubAppUrl = function (url, app_id, app_name) {
        var new_url         = url,
            app_format_id   = encodeURIComponent(app_id),
            app_format_name = encodeURIComponent(app_name);

        if (url.indexOf("?") >= 0) {
            new_url = url + "&_ysp_appid=" + app_format_id + "&_ysp_appname=" + app_format_name;
        } else {
            new_url = url + "?_ysp_appid=" + app_format_id + "&_ysp_appname=" + app_format_name;
        }

        return new_url;
    };

    var _bindEvent = function () {
        // 取消点击事件
        $("#cancel_search").bind("click", function (e) {
            // 返回首页面
            e.preventDefault();
            // 调用客户端enterplorer_home_search的cancelSearch.
            CLIENT.cancelSearch();
        });

        // 监听搜索框内容变换
        $("#search_input").bind("input propertychange", function(e) {
            var value = e.target.value;
            if (value && value.trim()) {
                // 从数据中搜索
                _searchApp(e, value.trim());
            } else {
                $("#searched_apps").addClass("no-result").html("请搜索本地应用");
            }
        });

        // 监听搜索框手机端回车、前往事件
        $("#search_input").bind("keyup", function (e) {
            var protocol_reg = /^((http|ftp|https|enterplorer):\/\/)/;
            var value = event.target.value;
            if (e.keyCode === 13 || e.key === "Enter") {
                if (url_reg.test(value)) {
                    var url = "";
                    if (protocol_reg.test(value)) {
                        url = value;
                    } else {
                        url = "http://" + value;
                    }
                    CLIENT.openNewWindow(url);
                } else {
                    if (value && value.trim()) {
                        _searchApp(e, value.trim());
                    } else {
                        $("#searched_apps").addClass("no-result").html("请搜索本地应用");
                    }
                }
            }
        });
    };

    return {
        init: function () {
            $("#search_input").focus();
            // 绑定事件
            _bindEvent();
        },
        openSubAppPage : _openSubAppPage,
        setDefaultImg : _setDefaultImg
    };
} ();



















