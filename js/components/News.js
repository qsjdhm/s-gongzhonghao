/**
 * News.js  新闻列表功能模块
 * 功能：频道滑动和新闻列表向上滑动加载
 */

var News = function () {};
News.prototype = function () {

    var lastCategory = "";  // 上一次选中的频道
    var pageList     = [];  // 保存所有频道的当前页数

    // 初始化频道列表
    var _initCategory = function () {
        var cardInfo = [];
        var html = '';

        for (var i = 0, len = APP_DATA.card.length; i < len; i++) {
            if (APP_DATA.card[i].id === "news") {
                cardInfo = APP_DATA.card[i].value;
                break;
            }
        }

        for (var i = 0, len = cardInfo.length; i < len; i++) {
            if (i === 0) {
                html += '<a industry="'+cardInfo[i].industry+'" category="'+cardInfo[i].category+'" class="mui-control-item mui-active" href="javascript:void(0)">'+cardInfo[i].category+'</a>';
            } else {
                html += '<a industry="'+cardInfo[i].industry+'" category="'+cardInfo[i].category+'" class="mui-control-item" href="javascript:void(0)">'+cardInfo[i].category+'</a>';
            }
            pageList.push({"category": cardInfo[i].category, "page": 0});
        }

        $("#category_list").append(html);
        // 根据选中的频道获取新闻
        _byCategoryQueryNews(cardInfo[0].industry, cardInfo[0].category);
    };

    // 根据选中的频道获取新闻
    var _byCategoryQueryNews = function (industry, category) {
        var requestParam = {
            number: 20,
            page: 0,
            industry: industry,
            category: category,
            callback: function (response) {
                // 创建新闻列表
                _createNewsList(industry, category, response.data);
                lastCategory = category;
            }
        };
        SERVER.getNews(requestParam);
    };

    // 创建新闻列表
    var _createNewsList = function (industry, category, newsList) {
        var html = '';
        html += '<div id="'+category+'_list_pack" class="mui-slider-item mui-control-content news-show">';
        html += '   <div class="mui-scroll-wrapper">';
        html += '       <div class="mui-scroll">';

        html += '           <ul id="'+category+'_list" industry="'+industry+'" category="'+category+'" class="mui-table-view">';
        for (var i = 0, len = newsList.length; i < len; i++) {
            var time = newsList[i].time.split(" ")[1];
            time = time.split(":")[0]+":"+time.split(":")[1];
            html += '<li class="mui-table-view-cell mui-media">';
            html += '    <a href="'+newsList[i].url+'">';
            html += '        <img class="mui-media-object mui-pull-left" src="'+newsList[i].image+'">';
            html += '        <div class="mui-media-body">';
            html += '            <p class="mui-ellipsis" style="color: #030303;">'+newsList[i].title+'</p>';
            html += '            <p class="mui-ellipsis" style="color: #8f8e94;">'+time+'</p>';
            html += '        </div>';
            html += '    </a>';
            html += '</li>';
        }
        html += '           </ul>';
        html += '       </div>';
        html += '   </div>';
        html += '</div>';

        $("#news_list").append(html);
        // 初始化滑动组件
        _initSlidePlugin(category+"_list_pack", industry, category);
    };


    // 初始化滑动组件
    var _initSlidePlugin = function (id, industry, category) {
        //阻尼系数
        var deceleration = mui.os.ios?0.003:0.0009;
        mui('#'+id+' .mui-scroll-wrapper').scroll({
            bounce: false,
            indicators: true, //是否显示滚动条
            deceleration:deceleration
        });
        mui('.mui-slider-group #'+id+' .mui-scroll').pullToRefresh({
            up: {
                callback: function() {
                    var self = this;
                    var nowCategoryPage = 1;
                    for (var i = 0, len = pageList.length; i < len; i++) {
                        if (pageList[i].category === category) {
                            pageList[i].page++;
                            nowCategoryPage = pageList[i].page;
                            break;
                        }
                    }

                    var requestParam = {
                        number: 20,
                        page: nowCategoryPage,
                        industry: industry,
                        category: category,
                        callback: function (response) {
                            // 创建新闻列表
                            _createFragment(category, response.data, nowCategoryPage);
                            self.endPullUpToRefresh();
                            lastCategory = category;
                        }
                    };
                    SERVER.getNews(requestParam);
                }
            }
        });
    };

    var _createFragment = function(category, newsList, nowCategoryPage) {
        var html = '';
        for (var i = 0, len = newsList.length; i < len; i++) {
            var time = newsList[i].time.split(" ")[1];
            time = time.split(":")[0]+":"+time.split(":")[1];
            html += '<li class="mui-table-view-cell mui-media">';
            html += '    <a href="'+newsList[i].url+'">';
            html += '        <img class="mui-media-object mui-pull-left" src="'+newsList[i].image+'">';
            html += '        <div class="mui-media-body">';
            html += '            <p class="mui-ellipsis" style="color: #030303;">'+newsList[i].title+'</p>';
            html += '            <p class="mui-ellipsis" style="color: #8f8e94;">'+time+'</p>';
            html += '        </div>';
            html += '    </a>';
            html += '</li>';
        }
        $("#"+category+"_list").append(html);
    };

    var _bindEvent = function () {
        // 频道点击事件
        $(".mui-control-item").tap( function(e) {
            var industry = $(this).attr("industry");
            var category = $(this).attr("category");
            if (lastCategory != category) {
                lastCategory = category;
                // 隐藏当前显示的新闻列表
                $(".news-show").css("display", "none").removeClass("news-show");
                if ($("#"+category+"_list_pack").length === 0) {
                    // 根据选中的频道获取新闻
                    _byCategoryQueryNews(industry, category);
                } else {
                    $("#"+category+"_list_pack").addClass("news-show");
                }
            }
        });
    };


    return {
        init: function () {
            // 初始化频道列表
            _initCategory();
            // 绑定事件
            _bindEvent();
        }
    };
} ();

