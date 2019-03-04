/**
 * newsIndex.js  新闻列表页面初始js
 * 功能：新闻列表页功能入口，获取datajs和调用具体功能
 */

var APP_DATA   = null ,  // 后台向前台传递的datajs中的数据
    datajs_bak = null ,  // 后台向前台传递的datajs中的数据--BAK 用于对天气操作后传递给客户端
    BASE_URL   = ""   ,  // 路径

    CLIENT     = null ,
    SERVER     = null ,
    NEWS       = null ;


$(function () {
    // 1.初始化连接客户端工具类
    initClient();
    // 2.初始化连接服务器端工具类
    initServer();
    // 3.进行相关数据获取和基础参数的配置
    initBasis();

    //initServer();
    //FastClick.attach(document.body);
    //// 模拟的数据
    //var datajs = {"noticeTitle":"云适配UED","noticeContent":"","logoUrl":"http:\/\/192.168.2.135:10000\\files\/icons\/companylogo\/50aa94a0bb9011e6ae31ef1b9814d194.png","iconUrl":"http:\/\/192.168.2.135:10000\\files\/icons\/companyicon\/50aa6d90bb9011e6ae31ef1b9814d194.png","companyTitle":"UED移动办公平台","bgPicUrl":"","cards":[{"type":"fun","id":"weather","enable":true,"icon":"card_default.png","title":"天气卡片"},{"type":"fun","id":"news","enable":true,"icon":"card_default.png","title":"企业新闻","value":[{"industry":"金融业","category":"互联网金融"},{"industry":"金融业","category":"保险业"},{"industry":"金融业","category":"证券业"},{"industry":"餐饮业","category":"快餐服务"}]}],"managerServer":"http:\/\/192.168.2.15:10000","groupList":[{"_id":"57ac173894f830b025e41b43","type":0,"name":"默认应用组","apps":[{"appId":"57b127ffcac2014821dbc064","appImgUrl":"http:\/\/192.168.2.15:10000\/files\/icons\/defaultAppLogo\/checkin.png","appName":"签到系统","appType":"defaultApp","appLink":"http:\/\/211.157.174.250:8990\/mobile\/index.html","index":2,"level":"1","useVpn":false,"vpnIds":[],"scope":"","hosts":[],"subApps":[],"parentAppId":"","applicationGroupId":"57ac173894f830b025e41b43","createdTime":"2016-08-15T02:25:03.100Z"},{"appId":"57a8bf370e1a131b587c7952","appImgUrl":"http:\/\/192.168.2.48:10000\/files\/icons\/defaultAppLogo\/checkin.png","appName":"签到系统","appType":"defaultApp","appLink":"http:\/\/192.168.2.100:4000","index":5,"level":"1","useVpn":false,"vpnIds":[],"scope":"","hosts":[],"subApps":[],"parentAppId":"","applicationGroupId":"57ac173894f830b025e41b43","createdTime":"2016-08-08T17:19:51.459Z"},{"appId":"5760218efc7c0e38de37e5cc","appImgUrl":"http:\/\/192.168.2.48:10000\/files\/icons\/defaultAppLogo\/email.png","appName":"邮箱","appType":"defaultApp","appLink":"enterplorer:\/\/email\/","index":6,"level":"1","useVpn":false,"vpnIds":[],"scope":"","hosts":[],"subApps":[],"parentAppId":"","applicationGroupId":"57ac173894f830b025e41b43","createdTime":"2016-06-14T15:23:58.941Z"},{"appId":"57b178c8c076386023b51518","appImgUrl":"http:\/\/192.168.2.135:10000\/files\/icons\/defaultAppLogo\/formtalk.png","appName":"FormTalk","appType":"defaultApp","appLink":"enterplorer:\/\/formtalk\/","index":7,"level":"1","useVpn":false,"vpnIds":[],"scope":"","hosts":[],"subApps":[],"parentAppId":"","applicationGroupId":"57ac173894f830b025e41b43","createdTime":"2016-08-15T08:09:44.058Z"},{"appId":"5760218efc7c0e38de37e5cd","appImgUrl":"http:\/\/192.168.2.48:10000\/files\/icons\/defaultAppLogo\/reminder.png","appName":"智能提醒","appType":"defaultApp","appLink":"enterplorer:\/\/todo\/","index":8,"level":"1","useVpn":false,"vpnIds":[],"scope":"","hosts":[],"subApps":[],"parentAppId":"","applicationGroupId":"57ac173894f830b025e41b43","createdTime":"2016-06-14T15:23:58.943Z"}]}],"applist":[{"appId":"57b127ffcac2014821dbc064","appImgUrl":"http:\/\/192.168.2.15:10000\/files\/icons\/defaultAppLogo\/checkin.png","appName":"签到系统","appType":"defaultApp","appLink":"http:\/\/211.157.174.250:8990\/mobile\/index.html","index":2,"level":"1","useVpn":false,"vpnIds":[],"scope":"","hosts":[],"subApps":[],"parentAppId":"","applicationGroupId":"57ac173894f830b025e41b43","createdTime":"2016-08-15T02:25:03.100Z"},{"appId":"57a8bf370e1a131b587c7952","appImgUrl":"http:\/\/192.168.2.48:10000\/files\/icons\/defaultAppLogo\/checkin.png","appName":"签到系统","appType":"defaultApp","appLink":"http:\/\/192.168.2.100:4000","index":5,"level":"1","useVpn":false,"vpnIds":[],"scope":"","hosts":[],"subApps":[],"parentAppId":"","applicationGroupId":"57ac173894f830b025e41b43","createdTime":"2016-08-08T17:19:51.459Z"},{"appId":"5760218efc7c0e38de37e5cc","appImgUrl":"http:\/\/192.168.2.48:10000\/files\/icons\/defaultAppLogo\/email.png","appName":"邮箱","appType":"defaultApp","appLink":"enterplorer:\/\/email\/","index":6,"level":"1","useVpn":false,"vpnIds":[],"scope":"","hosts":[],"subApps":[],"parentAppId":"","applicationGroupId":"57ac173894f830b025e41b43","createdTime":"2016-06-14T15:23:58.941Z"},{"appId":"57b178c8c076386023b51518","appImgUrl":"http:\/\/192.168.2.135:10000\/files\/icons\/defaultAppLogo\/formtalk.png","appName":"FormTalk","appType":"defaultApp","appLink":"enterplorer:\/\/formtalk\/","index":7,"level":"1","useVpn":false,"vpnIds":[],"scope":"","hosts":[],"subApps":[],"parentAppId":"","applicationGroupId":"57ac173894f830b025e41b43","createdTime":"2016-08-15T08:09:44.058Z"},{"appId":"5760218efc7c0e38de37e5cd","appImgUrl":"http:\/\/192.168.2.48:10000\/files\/icons\/defaultAppLogo\/reminder.png","appName":"智能提醒","appType":"defaultApp","appLink":"enterplorer:\/\/todo\/","index":8,"level":"1","useVpn":false,"vpnIds":[],"scope":"","hosts":[],"subApps":[],"parentAppId":"","applicationGroupId":"57ac173894f830b025e41b43","createdTime":"2016-06-14T15:23:58.943Z"},{"appId":"57ac49ef67d6f2a000f7155a","appImgUrl":"http:\/\/192.168.2.135:10000\/files\/icons\/defaultAppLogo\/default_icon.png","appName":"测试11","appType":"onlineApp","appLink":"https:\/\/www.baidu.com","index":14,"level":"1","useVpn":false,"vpnIds":[],"scope":"","hosts":[],"subApps":[],"parentAppId":"","createdTime":"2016-08-11T09:48:31.051Z"}]};
    //setAppData(datajs);
});

// 进行相关数据获取和基础参数的配置
function initBasis () {
    // 首先取消js在客户端的点击事件300毫秒延迟
    FastClick.attach(document.body);
    // 功能入口：初始化参数变量
    initParameter();
}

// 初始化参数变量
function initParameter () {
    // 请求datajs数据
    var requestParam = {
        callback: function (response) {
            console.info(response);
            setAppData(response);
        }
    };
    CLIENT.getDataJSByClient(requestParam);
}

// 根据后台请求的数据设置APP_DATA
function setAppData (result) {
    if (result) {
        // 获取动态manager服务器地址
        if (result.managerServer == null) { alert('manager服务器地址为空，请检查!'); return false; }
        BASE_URL = result.managerServer;
        APP_DATA = {
            groups: result.groupList,
            card: result.cards,
            logo: result.logoUrl,
            background: result.bgPicUrl,
            companyTitle: result.companyTitle,
            iconUrl: result.iconUrl
        };
    }

    // 4.初始化新闻
    initNews();
}


// 初始化客户端模块
function initClient () {
    CLIENT = new Client();
}

// 初始化服务器端模块
function initServer () {
    SERVER = new Server();
}

// 初始化新闻
function initNews () {
    NEWS = new News();
    NEWS.init();
}












