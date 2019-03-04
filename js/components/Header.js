/**
 * Header.js  首页公司头功能模块
 * 功能：显示公司信息
 */

var Header = function () {};
Header.prototype = function () {

    // 设置公司信息
    var _setCompanyInfo = function () {

        var $companyImg  = $("#company_info img"),
            $companySpan = $("#company_info span");

        // 设置图片和公司信息
        if (!APP_DATA.iconUrl) {
            $companyImg.attr("src", "i/company_logo.png");
        } else {
            $companyImg.attr("src", APP_DATA.iconUrl);
        }

        if (!APP_DATA.companyTitle) {
            $companySpan.html("欢迎使用移动办公平台！");
        } else {
            $companySpan.html(APP_DATA.companyTitle);
        }
    };

    // 绑定事件
    var _bindEvent = function () {

    };

    return {
        init: function () {
            // 设置公司信息
            _setCompanyInfo();

            // 绑定事件
            _bindEvent();
        }
    };
} ();


// 讲解一下为什么把方法绑定到原型链上
//**原型继承模式
//在不使用angular、react写js项目时，我一般会使用面向对象的模式写有规范、利于扩展的模块，然后模块之间互相调用。
//先看第一种模式：
//var Header = function () {
//    // 绑定事件
//    var _bindEvent = function () {
//        // 具体功能
//    };
//    return {
//        init: function () {
//            // 绑定事件
//            _bindEvent();
//        },
//        // 把_bindEvent方法公开，外部可调用
//        callBindEvent: _bindEvent
//    };
//}(); // 自执行
//
//我们解读一下：
//1. 构造函数不用说，首字母大写的方法一般都会被定义为构造函数，这里不同的是一般这些构造函数都没有参数。
//2. Header方法里面有个带下划线的私有功能方法_bindEvent，它会在init中被调用。
//3. 当Header构造函数被实例化的时候，会返回一个object，object中有init、callBindEvent方法，init方法就相当于这个模块的入口；而callBindEvent是调用的Header自身的_bindEvent方法，
//如果_bindEvent方法需要参数，也不需要在这里做处理，只需要header.callBindEvent("参数1", "参数1")，_bindEvent就可以获得参数。
//注：可以看出这样的结构满足模块化、自定义私有公有方法的功能，但是如果了解new的原理的我们可以发现一个问题（new的原理是：
//var o2  ={};
//o2.__proto__ = CO.prototype;
//CO.call(o2);
//return o2;
//可以开出来o2是实例化子类，o2的原型链指向Header的原型。）这个问题就是，当通过new实例化一个子类的时候，子类的原型链指向的是Header的原型，而不是Header本身。
//那么，采用上面的代码，o2调用Header的方法时还得先找一层Header本身，Header发现自身原型没有，会找自己的原型链，通过原型链才能找到callBindEvent方法。这样就多了一层查找。
//function Shape(){console.info('2222222');}
//Shape.prototype.name = "Shape";
//Shape.prototype.toString = function(){return this.name};
//
//var two = new Shape();
//Shape.prototype;  // Shape { name="Shape",  toString=function()}
//Shape.__proto__;  // function () {console.info('2222222');}
//看到Shape原型链是function Shape(){console.info('2222222');}。
//看了上面的例子应该可以理解我上面说的问题了，为了解决这个问题，需要对模块代码进行改造：
//var Header = function () {};
//// 封装私有的function，这样一次性的设置了原型对象
//Header.protype = function () {
//    // 绑定事件
//    var _bindEvent = function () {
//        // 具体功能
//    };
//    return {
//        init: function () {
//            // 绑定事件
//            _bindEvent();
//        },
//        // 把_bindEvent方法公开，外部可调用
//        callBindEvent: _bindEvent
//    };
//}(); // 自执行
//这样，在子类实例化时就不会再多找一层原型链的方法了，直接找原型方法，减少内存占用。
//
//另外，我上面是直接一次性的设置了原型对象，当然我们也可以使用这种方式分开设置原型的每个属性
//var BaseCalculator = function () {
//    //为每个实例都声明一个小数位数
//    this.decimalDigits = 2;
//};
//
////使用原型给BaseCalculator扩展2个对象方法
//BaseCalculator.prototype.add = function (x, y) {
//    return x + y;
//};
//
//BaseCalculator.prototype.subtract = function (x, y) {
//    return x - y;
//};
//但是这样就没办法达到自由的控制原型中哪些方法时public，哪些是private了，所以还是建议采用上面那种最完善的模式写模块代码。
//


