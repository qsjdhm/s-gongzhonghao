/**
 * Card.js  首页各种卡片功能模块
 * 功能：在首页显示功能性卡片（天气、新闻）
 */

var Card = function () {};
Card.prototype = function () {

    var fun_card_data   = [],  // 功能卡片的数据
        lastCategory    = "",  // 上一次选中的频道
        pageList        = [];  // 保存所有频道的当前页数

    // 根据后台返回的card数据，分别创建各种类型的卡片
    var _dealCardData = function () {
        var cards = APP_DATA.card;
        if (cards && cards.length > 0) {
            for (var i = 0, len = cards.length; i < len; i++) {
                if (cards[i].type === "fun") {
                    fun_card_data.push(cards[i]);
                }
            }
        }
        // 根据各种类型的卡片数据初始化卡片
        _initCardByType();
    };

    // 根据各种类型的卡片数据初始化卡片
    var _initCardByType = function () {
        if (fun_card_data && fun_card_data.length > 0) {
            _initFunCard(fun_card_data);
        }
    };

    // 初始化功能卡片
    var _initFunCard = function (card_data) {
        if (card_data && card_data.length > 0) {
            for (var i = 0, len = card_data.length; i < len; i++) {
                // 当用户、公司都为true时，才创建卡片
                var userEnable = card_data[i].enable;
                var companyEnable = card_data[i].companyEnable;
                if ((userEnable && companyEnable) || (userEnable && companyEnable===undefined)) {
                    switch (card_data[i].id) {
                        case "weather":  // 创建天气卡片
                            _createWeatherCard(card_data[i]);
                            break;
                        case "news":     // 创建新闻卡片
                            if (card_data[i].value.length > 0) {
                                _createNewsCard(card_data[i]);
                            }
                            break;
                        default:
                            console.info("功能性未知类型卡片");
                    }
                }
            }
        }
    };

    // 创建天气卡片
    var _createWeatherCard = function (card_info) {
        var DATE    = new Date(),
            YEAR    = DATE.getFullYear(),
            MONTH   = DATE.getMonth() + 1,
            DAY     = DATE.getDate();

        var week = new Date(YEAR, MONTH-1, DAY).getDay();
        if (week === 0) {
            week = "星期日";
        } else if (week === 1) {
            week = "星期一";
        } else if (week === 2) {
            week = "星期二";
        } else if (week === 3) {
            week = "星期三";
        } else if (week === 4) {
            week = "星期四";
        } else if (week === 5) {
            week = "星期五";
        } else if (week === 6) {
            week = "星期六";
        }

        var html = '';
        html += '<div id="'+card_info.id+'" class="card-item fun-card-item fun-card-'+card_info.id+'">';
        html += '    <div class="card-header" style="border-bottom: 0px solid #eaeaea;">';
        html += '        <img class="card-icon" src="i/sun.png"/>';
        html += '        <span style="line-height: 40px;" class="card-title">天气</span>';
        html += '    </div>';
        html += '    <div style="padding: 0 5px;margin:0 10px;border-top: 1px solid #eaeaea;color: #030303;" class="card-content">';
        html += '        <div class="top-div">';
        html += '           <span id="weather_date" class="top-date">'+YEAR+'年'+MONTH+'月'+DAY+'日</span>';
        html += '           <span id="weather_week" class="top-week">'+week+'</span>';
        html += '           <span id="weather_location" class="top-location">未知</span>';
        html += '        </div>';
        html += '    <div class="middle-div">';
        html += '        <span id="weather_temperature" class="middle-temperature">-°C</span>';
        html += '        <span id="weather_weather" class="middle-weather">晴</span>';
        html += '        <img  id="weather_weather_icon" class="middle-weather-icon" src="i/999.png"/>';
        html += '    </div>';
        html += '    <div class="bottom-div">';
        html += '        <span id="weather_air" class="bottom-air">良</span>';
        html += '        <span id="weather_temperature_interval" class="bottom-temperature-interval">30/16°C</span>';
        html += '        <img  id="weather_wind_icon" class="bottom-wind-icon" src="i/wind.png"/>';
        html += '        <span id="weather_air" id="weather_air" class="bottom-wind">轻微</span>';
        html += '    </div>';
        html += '</div>';

        $("#fun_cards").append(html);
    };

    // 根据地理位置请求天气信息 -- 和风天气
    // http://www.heweather.com
    // yan.zhang@yunshipei.com
    // z000000
    var _queryWeather = function (location) {
        // 天气卡片存在并且没有请求过天气
        if ($("#weather").length === 1 && $("#weather_temperature").html() === "-°C") {
            $("#weather_location").html(location);
            var requestParam = {
                location: location,
                callback: function (response) {
                    // 创建新闻列表
                    var temp = response["HeWeather5"][0]["aqi"];
                    var data = response["HeWeather5"][0]["now"];
                    var dail = response["HeWeather5"][0]["daily_forecast"];
                    var wind = response["HeWeather5"][0]["hourly_forecast"];
                    if (data != null) {
                        // 设置天气信息
                        $("#weather_weather").html(data.cond.txt);
                        $("#weather_weather_icon").attr("src", "enterplorer://static/img/weather_new/" + data.cond.code + ".png");
                        $("#weather_temperature").html(data.tmp+"°C");

                        $("#weather_air").html(temp.city.qlty);
                        $("#weather_temperature_interval").html(dail[0].tmp.max+"/"+dail[0].tmp.min+"°C");
                        $("#weather_air").html(wind[0].wind.sc);
                    }
                }
            };
            SERVER.getWeather(requestParam);
        }
    };

    // 创建新闻卡片
    var _createNewsCard = function (card_info) {
        var html = '';
        html += '<div id="'+card_info.id+'" class="card-item fun-card-item fun-card-'+card_info.id+'">';
        html += '    <div class="card-news-top card-header" style="border-bottom: 0px solid #eaeaea;">';
        html += '        <img class="card-icon" src="i/news.png"/>';
        html += '        <span style="line-height: 40px;" class="card-title">企业新闻</span>';
        html += '        <div id="news_batch">';
        html += '            <img class="refresh-icon" src="i/refresh_icon.png"/>';
        html += '            <span class="news-batch">换一批&nbsp;&nbsp;|&nbsp;&nbsp;</span>';
        html += '        </div>';
        html += '        <span id="news_more" class="card-operation">全部</span>';
        html += '    </div>';
        // 新闻频道
        html += '    <div class="news-content">';
        html += '        <div id="sliderSegmentedControl" class="mui-scroll-wrapper mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">';
        html += '            <div class="mui-scroll">';
        if (card_info.value && card_info.value.length > 0) {
            for (var i = 0, len = card_info.value.length; i < len; i++) {
                if (i === 0) {
                    html += '        <a index="'+(i+1)+'" industry="'+card_info.value[i].industry+'" category="'+card_info.value[i].category+'" class="mui-control-item mui-active" href="javascript:void(0)">'+card_info.value[i].category+'</a>';
                } else {
                    html += '        <a index="'+(i+1)+'" industry="'+card_info.value[i].industry+'" category="'+card_info.value[i].category+'" class="mui-control-item" href="javascript:void(0)">'+card_info.value[i].category+'</a>';
                }
                pageList.push({"category": card_info.value[i].category, "page": 0});
            }
        }
        html += '           </div>';
        html += '       </div>';
        // 新闻列表
        html += '       <div id="news_list" class="card-news-list"></div>';
        html += '       <div id="news_bottom" class="card-news-bottom"></div>';
        html += '   </div>';
        html += '</div>';
        $("#fun_cards").append(html);
        // 初始化频道--可左右滑动
        var selectItem = {
            index    : 1,
            industry : card_info.value[0].industry,
            category : card_info.value[0].category
        };
        _initCategory(selectItem);
    };

    // 初始化频道--可左右滑动
    var _initCategory = function (selectItem) {
        // 初始化频道
        var deceleration = mui.os.ios?0.003:0.0009;
        mui('.mui-scroll-wrapper').scroll({
            indicators: true, //是否显示滚动条
            deceleration:deceleration, //阻尼系数,系数越小滑动越灵敏
            bounce: true //是否启用回弹
        });

        // 根据选中的频道获取新闻
        _byCategoryQueryNews(selectItem);
    };

    // 根据选中的频道获取新闻
    var _byCategoryQueryNews = function (selectItem) {
        var index    = selectItem.index,
            industry = selectItem.industry,
            category = selectItem.category;

        var requestParam = {
            number: 4,
            page: 0,
            industry: industry,
            category: category,
            callback: function (response) {
                if (response.status === 1) {
                    // 创建新闻列表
                    _createNewsList(industry, category, index, response.data);
                    lastCategory = category;
                }
            }
        };
        SERVER.getNews(requestParam);
    };

    // 创建新闻列表
    var _createNewsList = function (industry, category, index, newsList) {
        var html = '';
        $(".news-show").removeClass("news-show");
        html += '<ul id="'+category+'_list" industry="'+industry+'" category="'+category+'" index="'+index+'" class="mui-table-view news-show">';
        if (newsList && newsList.length > 0) {
            for (var i = 0, len = newsList.length; i < len; i++) {
                var time = newsList[i].time.split(" ")[1];
                time = time.split(":")[0]+":"+time.split(":")[1];
                html += '<li class="mui-table-view-cell mui-media">';
                if (i === 0) {
                    html += '    <a href="'+newsList[i].url+'">';
                    html += '        <img class="mui-media-object mui-pull-left" src="'+newsList[i].image+'">';
                    html += '        <div class="mui-media-body">';
                    html += '            <p class="mui-ellipsis" style="color: #030303;">'+newsList[i].title+'</p>';
                    html += '            <p class="mui-ellipsis" style="color: #8f8e94;">'+time+'</p>';
                    html += '        </div>';
                    html += '    </a>';
                } else {
                    html += '    <a class="card-news-item" href="'+newsList[i].url+'">';
                    html += '        <span class="card-news-title">'+newsList[i].title+'</span>';
                    html += '        <span class="card-news-time">'+time+'</span>';
                    html += '    </a>';
                }
                html += '</li>';
            }
        }
        html += '</ul>';

        $("#news_list").append(html);
    };

    var _bindEvent = function () {
        // 添加卡片点击事件
        $("#add_card").bind("click", function (e) {
            e.preventDefault();
            // 调用客户端enterplorer_home的loadEnterURL方法
            CLIENT.loadEnterURL("manage.html", "ENTERPLORER_EXTEND", "添加应用");
        });

        // 频道点击事件
        $(".mui-control-item").tap( function(e) {
            var index    = $(this).attr("index");
            var industry = $(this).attr("industry");
            var category = $(this).attr("category");
            if (lastCategory != category) {
                lastCategory = category;
                // 获取当前频道数据
                var selectItem = {
                    index    : index,
                    industry : industry,
                    category : category
                };
                if ($("#"+category+"_list").length === 0) {
                    // 根据选中的频道获取新闻
                    _byCategoryQueryNews(selectItem);
                } else {
                    $(".news-show").removeClass("news-show");
                    $("#"+category+"_list").addClass("news-show");
                }
            }
        });

        // 更多推荐新闻点击事件
        $("#news_more").bind("click", function (e) {
            e.preventDefault();
            window.location.href = "news.html";
        });

        // 换一批新闻点击事件
        $("#news_batch").bind("click", function (e) {
            e.preventDefault();
            var nowCategoryPage = 1;
            // 找出当前频道的页数
            var $nowNews = $(".news-show");
            var index    = $nowNews.attr("index");
            var industry = $nowNews.attr("industry");
            var category = $nowNews.attr("category");
            for (var i = 0, len = pageList.length; i < len; i++) {
                if (pageList[i].category === category) {
                    pageList[i].page++;
                    nowCategoryPage = pageList[i].page;
                    break;
                }
            }
            // 换一批新闻
            _batchNews($nowNews, index, industry, category, nowCategoryPage);
        });
    };

    // 换一批新闻
    var _batchNews = function ($nowNews, index, industry, category, nowCategoryPage) {
        var requestParam = {
            number: 4,
            page: nowCategoryPage,
            industry: industry,
            category: category,
            callback: function (response) {
                if (response.status === 1) {
                    var html = '';
                    for (var i = 0, len = response.data.length; i < len; i++) {
                        var time = response.data[i].time.split(" ")[1];
                        time = time.split(":")[0]+":"+time.split(":")[1];
                        html += '<li class="mui-table-view-cell mui-media">';
                        if (i === 0) {
                            html += '    <a href="'+response.data[i].url+'">';
                            html += '        <img class="mui-media-object mui-pull-left" src="'+response.data[i].image+'">';
                            html += '        <div class="mui-media-body">';
                            html += '            <p class="mui-ellipsis" style="color: #030303;">'+response.data[i].title+'</p>';
                            html += '            <p class="mui-ellipsis" style="color: #8f8e94;">'+time+'</p>';
                            html += '        </div>';
                            html += '    </a>';
                        } else {
                            html += '    <a class="card-news-item" href="'+response.data[i].url+'">';
                            html += '        <span class="card-news-title">'+response.data[i].title+'</span>';
                            html += '        <span class="card-news-time">'+time+'</span>';
                            html += '    </a>';
                        }
                        html += '</li>';
                    }
                    $nowNews.html(html);
                }
            }
        };
        SERVER.getNews(requestParam);
    };

    return {
        init: function () {
            _dealCardData();
            // 绑定事件
            _bindEvent();
        },
        queryWeather: _queryWeather
    };
} ();



















