/**
 * GroupApp.js  首页应用组功能模块
 * 功能：以九宫格形式展示首页APP列表
 */

var GroupApp = function () {};
GroupApp.prototype = function () {

    // 根据datajs的数据组织组应用列表
    var _createGroup = function () {
        var html = '';
        if (APP_DATA.groups && APP_DATA.groups.length) {
            for (var i in APP_DATA.groups) {
                var group = APP_DATA.groups[i],
                    app   = group.apps,
                    hiddenAppLength = 0;  // 隐藏应用个数

                for (var j = 0, len = app.length; j < len; j++) {
                    if (app[j].appName.indexOf("hidden_") === 0) {
                        hiddenAppLength ++;
                    }
                }
                // 此应用组的应用个数和隐藏应用个数相等，就不用去画应用组了
                if (hiddenAppLength !== app.length && app.length > 0) {
                    if (group.type == 0) {
                        // 创建默认应用组
                        html += '<div class="group default-group">';
                        html += '    <div class="mui-content">';
                        html += '       <ul class="mui-table-view mui-grid-view mui-grid-9">';
                        html +=             _createAPP(app);
                        html += '       </ul>';
                        html += '    </div>';
                        html += '</div>';
                    } else {
                        // 创建其他应用组
                        html += '<div class="group">';
                        html += '    <div class="group-header">';
                        html += '       <span class="group-title">'+group.name+'</span>';
                        html += '    </div>';
                        html += '    <div class="mui-content">';
                        html += '       <ul class="mui-table-view mui-grid-view mui-grid-9">';
                        html +=             _createAPP(app);
                        html += '       </ul>';
                        html += '    </div>';
                        html += '</div>';
                    }
                }
            }
        } else {
            html = '<div class="no-app">您暂时没有应用组，请联系管理员</div>';
        }
        $("#groups").append(html);
        // 初始化九宫格
        //mui.init({
        //    swipeBack:true
        //});
    };

    // 创建APP
    var _createAPP = function (apps) {
        var htmls     = '';
        for (var i in apps) {
            var html         = '',
                app          = apps[i],
                app_id       = app.appId === undefined ? "" : app.appId,
                app_name     = app.appName === undefined ? "" : app.appName,
                app_img_url  = app.appImgUrl === undefined ? "" : app.appImgUrl,
                app_link     = app.appLink === undefined ? "" : app.appLink,
                sub_apps     = app.subApps,
                cut_app_name = "",
                regular      = /^[a-fA-F0-9]{32}\/index\.html$/;

            if (app_name.indexOf("hidden_") === -1) {
                //  先根据个数判断是否添加...
                if (_getLength(app_name) > 12) {
                    cut_app_name = _cutStr(app_name, 12);
                } else {
                    cut_app_name = app_name;
                }

                if (sub_apps && sub_apps.length !== 0 && regular.test(app_link)) {
                    var path_link = _resetAppUrl("list.html", app_id, app_name);
                    if ((parseInt(i)+1)%3 == 0) {
                        html += '<li style="border-right: 0px solid #eee;" class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-4">';
                    } else {
                        html += '<li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-4">';
                    }
                    html += '   <a containsSubApp="'+path_link+'" appName="'+app_name+'" onClick="GROUP.openSubAppPage(this)">';
                    html += '      <img style="width:48px;" alt="图标" src="'+app_img_url+'" onerror="GROUP.setDefaultImg(this)"/>';
                    html += '      <div class="mui-media-body">'+cut_app_name+'</div>';
                    html += '   </a>';
                    html += '</li>';
                } else {
                    var path_link = _resetAppUrl(app_link, app_id, app_name);
                    if ((parseInt(i)+1)%3 == 0) {
                        html += '<li style="border-right: 0px solid #eee;" class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-4">';
                    } else {
                        html += '<li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-4">';
                    }
                    html += '   <a href="'+path_link+'">';
                    html += '      <img style="width:48px;" alt="图标" src="'+app_img_url+'" onerror="GROUP.setDefaultImg(this)"/>';
                    html += '      <div class="mui-media-body">'+cut_app_name+'</div>';
                    html += '   </a>';
                    html += '</li>';
                }
            }

            htmls += html;
        }

        return htmls;
    };

    // 图片加载出错的时候设置默认图片
    var _setDefaultImg = function (img) {
        img.src = "i/default_icon.png";
        img.onerror = null;
    };

    // 打开二级应用列表页面
    var _openSubAppPage = function (item) {
        var path_link = $(item).attr("containsSubApp"),
            app_name  = $(item).attr("appName");

        // 调用客户端enterplorer_home的loadEnterURL方法
        CLIENT.loadEnterURL(path_link, "ENTERPLORER_LIST", app_name);
    };

    // 绑定事件
    var _bindEvent = function(){

    };

    //  获取字符串长度，兼容中英文
    var _getLength = function (str) {
        var real_length = 0,
            char_code = -1;
        for (var i = 0, len = str.length; i < len; i++) {
            char_code = str.charCodeAt(i);
            if (char_code >= 0 && char_code <= 128) {
                real_length += 1;
            } else {
                real_length += 2;
            }
        }
        return real_length;
    };

    //  根据个数截取字符串，兼容中英文
    var _cutStr = function (str, len) {
        var str_length = 0,
            str_cut    = "";

        // 先算出来字符串原始的长度
        var originalLen = 0;
        for (var i = 0, ilen = str.length; i < ilen; i++) {
            originalLen++;
            if (escape(str.charAt(i)).length > 4) {
                originalLen++;
            }
        }

        for (var i = 0, str_len = str.length; i < str_len; i++) {
            str_length++;
            if (escape(str.charAt(i)).length > 4) {
                str_length++;
            }
            str_cut = str_cut.concat(str.charAt(i));
            if (str_length >= len) {
                // 如果出现11个字符中文混合情况
                if (originalLen !== len+1) {
                    str_cut = str_cut.concat("...");
                }
                return str_cut;
            }
        }
        if (str_length < len) {
            return str;
        }
    };

    //  对URL添加统计信息
    var _resetAppUrl = function (url, app_id, app_name) {
        var new_url = url;
        var app_format_id = encodeURIComponent(app_id);
        var app_format_name = encodeURIComponent(app_name);

        if (url.indexOf("?") >= 0) {
            new_url = url + "&_ysp_appid=" + app_format_id + "&_ysp_appname=" + app_format_name;
        } else {
            new_url = url + "?_ysp_appid=" + app_format_id + "&_ysp_appname=" + app_format_name;
        }

        return new_url;
    };

    return {
        init: function () {
            // 根据datajs的数据组织应用组列表
            _createGroup();
            // 绑定事件
            _bindEvent();
        },
        openSubAppPage: _openSubAppPage,
        setDefaultImg : _setDefaultImg
    };
} ();


