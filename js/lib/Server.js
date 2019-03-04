/**
 * Server.js  与服务端交互的功能js
 * 功能：提供出前端与后台服务端沟通、传递数据的功能类
 * 描述：
 *     1. 修改卡片显示状态
 *     2. 根据位置获取天气
 *     3. 根据频道获取新闻
 */

var Server = function () {};
Server.prototype = function () {

    // 修改卡片显示状态
    var _toggleCardEnable = function (cookie, datajs) {
        $.ajax({
            url: BASE_URL + "/v2/toggleCardEnable?sid="+cookie,
            type: "post",
            data: {
                cards: datajs.cards
            },
            dataType: "json",
            beforeSend: function(request) {
                request.setRequestHeader("sid", cookie);
            },
            success: function(result) {
                CLIENT.modifyDataJsByCard(datajs, true);  // 自动刷新页面
            },
            error: function(result) {
                // 如果出现错误，把卡片状态恢复成显示
                alert('设置卡片状态出错');
            }
        });
    };

    // 根据位置获取天气
    // http://www.heweather.com
    // yan.zhang@yunshipei.com
    // z000000
    var _getWeather = function (data) {
        // 新的v5接口
        $.ajax({
            url: "https://free-api.heweather.com/v5/weather?city="+data.location+"&key=ee62e55b19da4bb489ff359649cd0418",
            type: "POST",
            dataType: "json",
            success: function(result) {
                try {
                    if($.isFunction(data.callback)){
                        data.callback(result);
                    }
                } catch (error) {
                    console.error(error);
                }
            },
            error: function() {
                console.error("请求天气信息出错!");
            }
        });
        // 旧的v3接口
        //$.ajax({
        //    url: "https://api.heweather.com/x3/weather?city="+data.location+"&key=ee62e55b19da4bb489ff359649cd0418",
        //    type: "POST",
        //    dataType: "json",
        //    success: function(result) {
        //        try {
        //            if($.isFunction(data.callback)){
        //                data.callback(result);
        //            }
        //        } catch (error) {
        //            console.error(error);
        //        }
        //    },
        //    error: function() {
        //        console.error("请求天气信息出错!");
        //    }
        //});
    };

    // 根据频道获取新闻
    var _getNews = function (data) {
        $.ajax({
            url: BASE_URL + "/v2/getNewsInfo",
            type: "post",
            data: {
                num : data.number,
                page : data.page,
                firsttype : data.industry,
                secondtype : data.category
            },
            dataType: "json",
            success: function(result) {
                if (result && result.status === 1) {
                    if($.isFunction(data.callback)){
                        data.callback(result);
                    }
                } else {
                    alert("从服务器获取新闻数据失败!");
                }
            },
            error: function(e) {
                console.error(e);
            }
        });
    };


    return {
        toggleCardEnable  : _toggleCardEnable  ,  // 修改卡片显示状态
        getWeather        : _getWeather        ,  // 获取天气
        getNews           : _getNews           ,  // 获取新闻
    };
} ();


