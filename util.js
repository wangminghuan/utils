/**
 * @author: 王明欢 
 * @date:2017-02-21
 */

/*****************ECMAScript相关方法封装集合**************************/

/**
 * @module 
 * @description 获取url参数
 */
function getUrlArgs() {
    var argStr = window.location.search ? window.location.search.substring(1) : "";
    var argObj = {},
        item = null,
        value = null,
        key = null,
        argArr = argStr.length > 0 ? argStr.split("&") : [];
    for (var i = 0, len = argArr.length; i < len; i++) {
        item = argArr[i].split("=");
        key = item[0];
        value = item[1];
        argObj[key] = value;
    }
    return argObj
}

/**
 * @module  cookie 
 * @description 获取url参数
 * 例子：
 *cookie.get("name");
 *cookie.set("name","minghuang",new Date("May 1,2017"), "/", "58.com")
 *cookie.unset("name","minghuang",new Date("May 1,2017"), "/", "58.com")
 */

var cookie = {
    get: function(name) {
        var cookieName = encodeURIComponent(name) + "=",
            cookieStart = document.cookie.indexOf(cookieName),
            cookieValue = null;
        if (cookieStart > -1) {
            var cookieEnd = document.cookie.indexOf(";", cookieStart);
            if (cookieEnd == -1) {
                cookieEnd = document.cookie.length;
            }
            cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd))
        }
        return cookieValue;
    },
    set: function(name, value, expires, path, domain, secure) {
        var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);
        if (expires instanceof Date) {
            cookieText += "; expires=" + expires.toGMTString();
        }
        if (path) {
            cookieText += "; path=" + path;
        }
        if (domain) {
            cookieText += "; domain=" + domain;
        }
        if (secure) {
            cookieText += "; secure=" + secure;
        }
        document.cookie = cookieText;
    },
    unset: function(name, value, expires, path, domain, secure) {
        this.set(name, "", new Date(0), path, domain, secure);
    }
};

/**
 * @module  browserInfo 
 * @description 获取浏览器UA标识
 */

var browserInfo = (function() {
        var regExp = {
            weixin: /micromessenger\//ig,
            momo: /momowebview\//ig,
            qq: /mqqbrowser\/|\sqq\//ig,
            baidu: /baidu/ig,
            uc: /ucbrowser/ig,
            xiaomi: /xiaomi\//ig,
            firefox: /firefox/ig,
            opera: /opr\/|opera/ig,
            sogou: /sogoumobilebrowser/ig,
            liebao: /liebao/ig,
            oppo: /oppobrowser/ig,
            360: /360 aphone browser/ig,
            //判断完其他的内容后再判断是否为safari
            safari: /version\/([0-9]+\.\d[\.\d]*)\s+mobile\/\w+\s+safari\/([0-9]+\.\d[\.\d]*)/ig,
            chrome: /chrome\/([0-9]+\.\d[\.\d]*)+\s+mobile\s+safari\/([0-9]+\.\d[\.\d]*)$|crios/ig
        };
        var source = "other";
        for (var key in regExp) {
            if (regExp[key].test(navigator.userAgent.toLowerCase())) {
                source = key;
                break;
            }
        }
        return source;
    })() 
    /**
     * @module diffDeviceInfo
     * @description 返回系统平台及ios版本
     */
var deviceInfo = (function() {
    var ua = navigator.userAgent.toLowerCase(),
        isAndroid = ua.match(/(android);?[\s\/]+([\d.]+)?/),
        isIOS = ua.match(/(iphone\sos)\s([\d_]+)/);
    if (isIOS) {
        var versions = /[\S\s]*os ([\d_]+) like/ig.exec(ua);
        // iOS 版本
        var iOSMajorVersion = parseInt(versions[1], 10);
    }
    return {
        "isAndroid": isAndroid || "",
        "isIOS": isIOS || "",
        "iosVersion": iOSMajorVersion || ""
    };
})();


/**
 * @module  isArray
 * @description ES5 新增了Array.isArray()方法，兼容处理
 * @parameter: 要判断的对象
 */
function isArray(value) {
    return Object.prototype.toString.call(value) == "[object Array]";
}

/**
 * @module  isRegExp
 * @description 是否是正则表达式
 * @parameter: 要判断的对象
 */
function isRegExp(value) {
    return Object.prototype.toString.call(value) == "[object RegExp]";
}

/**
 * @module  isFunction
 * @description 是否是原生函数，低版本IE始终返回false
 */
function isFunction(value) {
    return Object.prototype.toString.call(value) == "[object Function]";
}

/**
 * @module  isEmptyObject 
 * @description 判断是否为空对象
 * @parameter: 要判断的对象
 */
function isEmptyObject(obj) {
    for (var name in obj) {
        return false
    }
    return true
}

/**
 * @module  indexOf 
 * @description 重写原生方法，兼容IE8/7
 * @parameter: 要查找的内容
 */
Array.prototype._indexOf = function(n) {
    if ("indexOf" in this) {
        return this["indexOf"](n);
    }
    for (var i = 0; i < this.length; i++) {
        if (n === this[i]) {
            return i;
        }
    }
    return -1;
};

/**
 * @module  trim 
 * @description 重写原生方法，兼容IE8/7
 */
String.prototype._trim = function() {
    return this.replace(/(^\s*)(\s*$)/g, "");
};

/**
 * @module  extend  
 * @description child(子集，多，默认参数) 拷贝继承 father(父集，少，用户参数),返回一个新child
 *  深度复制，子集的修改不会影响父集，依赖isEmptyObject,isArray函数
 *  主要完成属性为object时参数的继承，而非重新赋值。
 */
function extend(parent, child) {
    var child = child || {};
    for (var key in parent) {
        if (parent.hasOwnProperty(key)) {
            if (typeof parent[key] === "object") {
                if (isArray(parent[key])) {
                    child[key] = [];
                } else {
                    child[key] = isEmptyObject(child[key]) ? {} : child[key]
                }
                arguments.callee(parent[key], child[key])
            } else {
                child[key] = parent[key]
            }

        }
    }
    return child;
}

/**
 * @module  jsonp  
 * @description jsonp函数封装，需接口支持jsonp方式。
 * @parameter: 
 * url: 接口url地址
 * callback:回调函数
 * 
 * jsonp原理：其实就是定义一个全局函数(callback)，动态创建一个script标签
 * 标签的src返回的就是一个callback(data),直接执行了js，利用js来进行跨域执行。
 * 使用例子：
 *  jsonp("http://suggest.58.com/searchsuggest_14.do?inputbox=7&cityid=1&catid=0",
 *  function(data){
 *     console.log(data)
 * })
 */

function jsonp(url, callback) {
    if (!url) return;
    //动态命名，区分每次请求
    var callbackName = "callback" + Math.random().toString().substring(2, 6);
    window[callbackName] = function(data) {
        try {
            callback && callback(data)
        } catch (e) {
            console.log("error!!");
            return
        }
    }
    url += "&callback=" + callbackName;
    var script = document.createElement('script');
    script.setAttribute("type", "text/javascript");
    script.src = url;
    document.body.appendChild(script);
};


/**
 * @module  ajax 
 * @description ajax原生js封装
 * @parameter:参数说明:
 **method: 请求方式:GET/POST,默认值:'GET';
 **url:    发送请求的地址, 默认值: 当前页地址;
 **data:   string,json;
 **async:  是否异步:true/false,默认值:true;
 **cache:  是否缓存：true/false,默认值:true;
 **contentType: HTTP头信息，默认值：'application/x-www-form-urlencoded';
 **success: 请求成功后的回调函数;
 **error:   请求失败后的回调函数;
 *  使用例子
 *  ajax({
 *        method: "GET",
 *       url: "/ipservice/",
 *       data: '222',
 *       cache: false,
 *       sucess: function(data) {
 *           //数据默认为字符串形式
 *           console.log(JSON.parse(data).localname)
 *       },
 *       error: function(err) {console.log(err)}
 *   });
 */
/*
 **ajax工作步骤
 **1. 创建XMLHttpRequest对象
 **2. 同服务器建立联系，open方法
 **3. 向服务器发送请求，send方法
 **4. 接收服务器返回请求内容，onreadystatechange
 */
function ajax(opts) {
    var defaults = {
        method: "GET",
        url: "",
        data: '',
        async: true,
        cache: true,
        contentType: 'application/x-www-form-urlencoded',
        sucess: function() {},
        error: function() {}
    };
    for (var key in opts) {
        defaults[key] = opts[key]
    }

    //处理用户输入的data数据

    if (typeof defaults.data == 'object' && !Object.prototype.toString.call(defaults.data) == "[object Array]") {
        var dataStr = "";
        for (var k in defaults.data) {
            dataStr += encodeURIComponent(k) + "=" + encodeURIComponent(defaults.data[k]) + "&"
        }
        defaults.data = dataStr.substring(0, dataStr.length - 1)
    }
    //将请求方式改为大写
    defaults.method = defaults.method.toUpperCase();

    //设置cache ,cache为false时设置随机数，防止缓存
    defaults.cache = defaults.cache ? "" : "&" + (new Date()).getTime();

    //GET方式下将data拼接到url中进行传递
    if (defaults.method == "GET" && (defaults.data || defaults.cache)) {
        defaults.url += "?" + defaults.data + defaults.cache;
    }

    //1. 创建XMLHttpRequest对象
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

    //2. 同服务器建立联系，open方法
    xhr.open(defaults.method, defaults.url, defaults.async)

    //3. 向服务器发送请求，send方法
    if (defaults.method == "GET") {
        xhr.send()
    } else {
        xhr.setRequestHeader('Content-Type', defaults.contentType);
        //提交的数据格式，默认application/x-www-form-urlencoded
        xhr.send(defaults.data);
    }

    //4. 接收服务器返回请求内容，onreadystatechange

    /* *onreadystatechange事件
      * readyState属性：请求状态
      * 0 （初始化）还没有调用open()方法
      * 1 （载入）已调用send()方法，正在发送请求
      * 2 （载入完成）send()方法完成，已收到全部响应内容
      * 3 （解析）正在解析响应内容
      * 4 （完成）响应内容解析完成，可以在客户端调用了
      * status属性：服务器(请求资源)的状态,http状态码

      * 返回的内容
      * responseText：返回以文本形式存放的内容
      * responseXML：返回XML形式的内容
      */
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                defaults.sucess(xhr.responseText)
            } else {
                defaults.error(xhr.status)
            }
        }
    }
}
/**
 * @module loadJS
 * @description 加载外部js文件
 * @parameter:
 */

/**补充：
 * Document 的 readyState 属性有两个可能的值：
 * loading，正在加载文档；
 * complete，已经加载完文档
 */
function loadJS(url, callback) {

    var script = document.createElement('script');
    var onload = function() {
        var readyState = script.readyState; //针对IE
        console.log(readyState);
        if (typeof readyState == 'undefined' || /^(loaded|complete)$/.test(readyState)) {
            script.onload = null;
            script.onreadystatechange = null;
            script = null;
            callback && callback();
        }
    };
    script.async = true; //异步加载
    script.src = url;
    if (script.readyState) {
        script.onreadystatechange = onload;
    } else {
        script.onload = onload;
    }

    var parent = document.getElementsByTagName('head')[0] || document.body;
    parent.appendChild(script) && (parent = null);
}


/*****************DOM相关方法封装集合**************************/

/**
 * @module  getElementsByClassName
 * @description 获取class名称集合
 * @parameter: 
 * className:类名，string
 * parentNode: 父节点，document等
 */
function getElementsByClassName(className, parentNode) {
    if (parentNode.getElementsByClassName) {
        return parentNode.getElementsByClassName(className)
    }
    var nodes = parentNode.getElementsByTagName("*") || document.all;
    var classArr = [];
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var classNames = node.className.split(/\s+/);
        for (var k = 0; k < classNames.length; k++) {
            if (classNames[k] == className) {
                classArr.push(node);
                break;
            }
        }
    }
    return classArr
}

/**
 * @module perLoadImage
 * @description 图片预加载，依赖isArray方法
 * @parameter:
 * arr：图片url组成的数组, array
 * callback: 图片加载完毕后的回调函数，形参为传入的arr数组
 */

function perLoadImage(arr, callback) {

    var imageObjArr = [],
        hasloadImageLen = 0;
    var __arr = isArray(arr) ? arr : [arr],
        __callback = callback || function() {};
    for (var i = 0, len = __arr.length; i < len; i++) {
        imageObjArr[i] = new Image();
        imageObjArr[i].src = __arr[i];
        imageObjArr[i].onload = function() {
            hasloadImageLen++;
            hasloadImageLen == arr.length && __callback(__arr)
        }
        imageObjArr[i].onerror = function() {
            hasloadImageLen++;
            hasloadImageLen == arr.length && __callback(__arr)
        }
    }
}

/**
 * @module lazyLoadImage
 * @description 图片懒加载
 */
function lazyLoadImage(opts) {
    var defaults = {
        target: "img", //懒加载对象
        container: document, //懒加载对象的容器
        data_attribute: "data-src", //默认图片标签地址data-src
        //placeholder: "http://img.58cdn.com.cn/n/images/list/noimg2.gif"
    };
    for (var k in opts) {
        defaults[k] = opts[k]
    }
    var oImg = defaults.container.getElementsByTagName(defaults.target);
    var imgArr = [],
        len = oImg.length;
    for (var j = 0; j < len; j++) {
        imgArr[j] = j
    }
    showImage();
    window.onscroll = showImage;

    function isInViewport(ele) {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
            eleTop = getElementTop(ele) + ele.clientHeight,
            winTop = scrollTop + document.documentElement.clientHeight;
        //当 scrollTop <= eleTop <= winTop, 认为元素在窗口内
        return winTop >= eleTop && eleTop >= scrollTop ? true : false
    }

    function showImage() {
        if (imgArr.length < 1) return
        for (var i = 0; i < len; i++) {
            if (isInViewport(oImg[imgArr[i]])) {
                oImg[imgArr[i]].src = oImg[imgArr[i]].getAttribute(defaults.data_attribute);
                oImg[imgArr[i]].removeAttribute(defaults.data_attribute);
                imgArr.splice(i, 1);
                i--
                len--;
            }
        }

    }
}

/**
 * @module getElementTop
 * @description 获取元素在页面上的左边偏移量
 * offsetLeft：元素的左外边框至包含元素的左内边框之间的像素距离。
 * 通过循环累加元素父级(到body)，得到最终的相对页面的偏移量
 */
function getElementLeft(element) {
    var actualLeft = element.offsetLeft;
    var current = element.offsetParent;
    while (current !== null) { //body.offsetParent=null
        actualLeft += current.offsetLeft;
        current = current.offsetParent;
    }
    return actualLeft;
};

/**
 * @module getElementTop
 * @description 获取元素在页面上的顶部偏移量
 */
function getElementTop(element) {
    var actualTop = element.offsetTop;
    var current = element.offsetParent;
    while (current !== null) {
        actualTop += current.offsetTop;
        current = current.offsetParent;
    }
    return actualTop;
};
/**
 * @module getViewport
 * @description 获取viewport及其内边距占据的空间大小(不包含margin,border)
 *             document.body：混杂模式
 *             document.documentElement：现代浏览器
 */
function getViewport() {
    //判断是否在混杂模式
    if (document.compatMode == "BackCompat") {
        return {
            width: document.body.clientWidth,
            height: document.body.clientHeight
        };
    } else {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        };
    }
};
/**
 * @module getDoc
 * @description 获得页面高度和宽度
 */
function getDoc() {
    if (document.compatMode == "BackCompat") {
        return {
            width: Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth),
            height: Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight)
        }
    } else {
        return {
            width: Math.max(document.body.scrollWidth, document.body.clientWidth),
            height: Math.max(document.body.scrollHeight, document.body.clientHeight)
        }
    }
};

/**
 * @module scrollToTop
 * @description 将页面返回顶部
 */
function scrollToTop() {
    if (document.body.scrollTop != 0) {
        document.body.scrollTop = 0;
    }
};

/**
 * @module getBoundingClientRect
 * @description 获取元素在页面中相对于视口的位置
 * 依赖getElementLeft和getElementTop方法
 */
function getBoundingClientRect(element) {
    var scrollTop = document.documentElement.scrollTop;
    var scrollLeft = document.documentElement.scrollLeft;
    //支持原生方法getBoundingClientRect的情况下
    if (element.getBoundingClientRect) {
        if (typeof arguments.callee.offset != "number") {
            var temp = document.createElement("div");
            temp.style.cssText = "position:absolute;left:0;top:0;";
            document.body.appendChild(temp);
            arguments.callee.offset = -temp.getBoundingClientRect().top - scrollTop;
            document.body.removeChild(temp);
            temp = null;
        }
        var rect = element.getBoundingClientRect();
        var offset = arguments.callee.offset;
        //IE7及以下起始坐标点是(2,2)，首先将得到的坐标存在offset属性下
        //第二次调用减去这个属性中的坐标即可得到纠正(原点坐标的一直都是0)。
        return {
            left: rect.left + offset,
            right: rect.right + offset,
            top: rect.top + offset,
            bottom: rect.bottom + offset
        };
    } else {
        //不支持原生方法的话，通过计算得到
        var actualLeft = getElementLeft(element);
        var actualTop = getElementTop(element);
        return {
            left: actualLeft - scrollLeft,
            right: actualLeft + element.offsetWidth - scrollLeft,
            top: actualTop - scrollTop,
            bottom: actualTop + element.offsetHeight - scrollTop
        }
    }
};


/**
 * @module 事件处理对象
 * @description 绑定事件和解绑事件，兼容性处理
 * @parameter:
 * element: html元素
 * type: 事件类型
 * handler:绑定的事件，绑定跟解绑必须是外部定义的事件，因为如果
 *         参数中直接定义的，每次定义都会开辟一个新内存(即使一模一样)
 */
var EventUtil = {
    //绑定事件
    addHandler: function(element, type, handler) {
        if (element.addEventListener) {
            //冒泡阶段处理事件
            element.addEventListener(type, handler, false)
        } else if (element.attachEvent) {
            //IE只有冒泡
            element.attachEvent("on" + type, handler)
        } else {
            element["on" + type] = handler;
        }
    },
    //解绑事件
    removeHandler: function(element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false)
        } else if (element.detachEvent) {
            element.detachEvent("on" + type, handler)
        } else {
            element["on" + type] = null;
        }
    },
    //获取事件对象
    getEvent: function(e) {
        //window.event:IE/Chrome,实际测试发现IE跟chrome也支持参数获取
        //event：作为参数，FF;
        return e ? e : window.event;
    },
    //阻止冒泡
    stopPropagation: function(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
    },
    //获取目标元素
    getTarget: function(e) {
        return event.target || event.srcElement;
    },
    //阻止默认事件
    preventDefault: function(e) {
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            event.returnValue = false;
        }
    }

}
