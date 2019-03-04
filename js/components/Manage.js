/**
 * Manage.js  卡片管理功能模块
 * 功能：为首页管理当前用户是否显示卡片
 */

var Manage = function () {};
Manage.prototype = function () {

    // 初始化卡片列表
    var _initCardList = function () {
        var cards = APP_DATA.card;
        if (cards && cards.length > 0) {
            for (var i = 0, len = cards.length; i < len; i++) {
                _createCard(cards[i]);
            }
            // 初始化mui组件
            _initMuiPlugins();
        }
    };

    // 创建卡片
    var _createCard = function (cardData) {
        var state_class = "";
        var enable_class = "";
        if (cardData.enable) {state_class = "mui-active";}
        if (!cardData.companyEnable && cardData.companyEnable!==undefined) {enable_class = "mui-disabled ysp-disabled";}

        var html = '';
        html += '<li class="mui-table-view-cell '+enable_class+'">';
        html += '   <div id="'+cardData.id+'">';
        html += '       <img class="mui-media-object mui-pull-left" src="i/weather_icon.png">';
        html += '       <span class="card-news-title">'+cardData.name+'</span>';
        html += '       <div id="'+cardData.id+'_switch" class="mui-switch '+ enable_class + " " +state_class+'">';
        html += '           <div class="mui-switch-handle"></div>';
        html += '       </div>';
        html += '   </div>';
        html += '</li>';

        $("#common_card_list ul").append(html);
    };

    // 初始化mui组件
    var _initMuiPlugins = function () {
        $script = $("<script />", {
            src: "js/lib/mui/js/mui.min.js",
            id: "muiScript"
        });
        $script.appendTo($("body"));
        $script.on("load", function() {
            // 初始化开关组件
            mui.init({
                swipeBack:true //启用右滑关闭功能
            });
            mui(".mui-switch").each(function() { //循环所有toggle
                this.addEventListener("toggle", function(event) {
                    // 根据当前操作，组织最新的卡片状态
                    _dealDataJS($(this).parent("div").attr("id"), event.detail.isActive);
                    // 切换卡片显示状态
                    SERVER.toggleCardEnable(SID, datajs_bak);
                });
            });
            // 初始化TAB页滑动
            mui(".mui-scroll-wrapper").scroll({
                indicators: true //是否显示滚动条
            });
            document.getElementById("slider").addEventListener("slide", function(e) {
                if (e.detail.slideNumber === 1) {
                    document.getElementById("office_card_list").querySelector(".mui-scroll").innerHTML = "";
                }
            });
        });
    };

    // 重新组合datajs_bak的数据
    var _dealDataJS = function (id, enable) {
        for (var i = 0, len = datajs_bak.cards.length; i < len; i++) {
            if (datajs_bak.cards[i].id === id) {
                datajs_bak.cards[i].enable = enable;
                break;
            }
        }
        return datajs_bak;
    };


    return {
        init: function () {
            // 初始化卡片列表
            _initCardList();
        }
    };
} ();


