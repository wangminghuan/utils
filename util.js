/**
 * @module 
 * @description 获取url参数
 */
var getUrlArgs=function(){
	var argStr=window.location.search?window.location.search.substring(1):"";
	var argObj={},item=null,value=null,key=null,
	argArr=argStr.length>0?argStr.split("&"):[];
	for(var i=0,len=argArr.length;i<len;i++){
         item=argArr[i].split("=");
         key=item[0];
         value=item[1];
         argObj[key]=value;
	}
	return argObj
}

/**
 * @module  cookie 
 * @description 获取url参数
 */

 var cookie={
 	get:function(name){
 		var cookieName=encodeURIComponent(name)+"=",
 		    cookieStart=document.cookie.indexOf(cookieName),
            cookieValue=null;
 		if(cookieStart>-1){
            var cookieEnd=document.cookie.indexOf(";",cookieStart);
            if(cookieEnd==-1){
            	cookieEnd=document.cookie.length;
            }
            cookieValue=decodeURIComponent(document.cookie.substring(cookieStart+cookieName.length,cookieEnd))
 		}
 		return cookieValue;
 	},
 	set:function(name, value, expires, path, domain, secure){
       var cookieText=encodeURIComponent(name)+"="+encodeURIComponent(value);
       if(expires instanceof Date){
       	 cookieText+="; expires="+expires.toGMTString();
       }
       if(path){
       	cookieText += "; path=" + path;
       }
       if(domain){
       	cookieText += "; domain=" + domain;
       }
       if(secure){
       	cookieText += "; secure=" + secure;
       }
       document.cookie=cookieText;
 	},
 	unset:function(name, value, expires, path, domain, secure){
       this.set(name, "", new Date(0), path, domain, secure);
 	}
 };

 /*例子：
 cookie.get("name");
 cookie.set("name","minghuang",new Date("May 1,2017"), "/", "58.com")
 cookie.unset("name","minghuang",new Date("May 1,2017"), "/", "58.com")
 */

/**
 * @module  getElementsByClassName
 * @description 获取class名称集合
 */
var getElementsByClassName=function(className, parentNode){
	   if(parentNode.getElementsByClassName(className)){
	   	  return parentNode.getElementsByClassName(className)
	   }
	  var nodes=parentNode.getElementsByTagName("*")||document.all;
	  var classArr=[];
	  for(var i=0;i<nodes.length;i++){
	  var node=nodes[i];
	  	  var classNames=node.className.split(/\s+/);
	  	  for(var k=0;k<classNames.length;k++){
	  	  	  if(classNames[k]==className){
	  	  	  	classArr.push(node);
	  	  	  	break;
	  	  	  }
	  	  }
	  }
	  return classArr
}
/**
 * @module  isArray
 * @description ES5 新增了Array.isArray()方法，兼容处理
 */
var isArray=function(value){
    return Object.prototype.toString.call(value) == "[object Array]";
}

/**
 * @module  isRegExp
 * @description 是否是正则表达式
 */
var isRegExp=function (value){
 return Object.prototype.toString.call(value) == "[object RegExp]";
}

/**
 * @module  isFunction
 * @description 是否是原生函数，低版本IE始终返回false
 */
var isFunction=function (value){
return Object.prototype.toString.call(value) == "[object Function]";
}

/**
 * @module  isEmptyObject 
 * @description 判断是否为空对象
 */ 
var isEmptyObject=function(obj){
    for(var name in obj){
    	return false
    }
    return true
}

/**
 * @module  indexOf 
 * @description 重写原生方法，兼容IE8/7
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
String.prototype._trim = function(){
    return this.replace(/(^\s*)(\s*$)/g, "");  
}; 

/**
 * @module  extend  
 * @description child(子集，多，默认参数) 拷贝继承 father(父集，少，用户参数),返回一个新child
 *  深度复制，子集的修改不会影响父集，依赖isEmptyObjec函数
 *  主要完成属性为object时参数的继承，而非重新赋值。
 */ 
var extend = function(parent, child){
	var child=child||{};
	for(var key in parent){
		if(parent.hasOwnProperty(key)){
            if(typeof parent[key]==="object"){
        		if(isArray(parent[key])){
        			child[key]=[];
        		}else{
                   child[key] = isEmptyObject(child[key])? {}: child[key]
        		}   
               arguments.callee(parent[key], child[key])
            }else{
			   child[key]=parent[key]
			}
			
		}
	} 
	return child;
};

var jsonp=function(){

};

/*
ajax工作步骤
1. 创建XMLHttpRequest对象
2. 同服务器建立联系，open方法
3. 向服务器发送请求，send方法
4. 接收服务器返回请求内容，onreadystatechange
 */
var ajax_0 = function(opts) {
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

        if (typeof defaults.data == 'object') {
            var dataStr = "";
            for (var k in defaults.data) {
                dataStr += encodeURIComponent(k) + "=" + encodeURIComponent(defaults.data[k]) + "&"
                }
            defaults.data = dataStr.substring(0, dataStr.length - 1)
            }
            //将请求方式改为大写
            defaults.method = defaults.method.toUpperCase();

            //设置cache ,cache为false时设置随机数，防止缓存
            defaults.cache = defaults.cache? "": "&"+(new Date()).getTime();
            //设置异步
            if (defaults.method == "GET" && (defaults.data||defaults.cache)) {
                defaults.url += "?" + defaults.data+ defaults.cache;
            }

            //1. 创建XMLHttpRequest对象
            var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

            //2. 同服务器建立联系，open方法
            xhr.open(defaults.method, defaults.url, defaults.async)
                //3. 向服务器发送请求，send方法
            if (defaults.method == "GET") {
                xhr.send()
            } else {
                xhr.setHttpRequestHeader('Content-Type', defaults.contentType)
                xhr.send(defaults.data);
            }
            //4. 接收服务器返回请求内容，onreadystatechange
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        defaults.sucess(JSON.parse(xhr.responseText))
                    } else {
                        defaults.error(xhr.status)
                    }
                }
            }
};




/**
 * @module  ajax 
 * @description 简易ajax实现原理
 */ 
var ajax2=function (method, url, data, success) {
	var xhr = null;
	try {
		xhr = new XMLHttpRequest();
	} catch (e) {
		xhr = new ActiveXObject('Microsoft.XMLHTTP');
	}
	
	if (method == 'get' && data) {
		url += '?' + data;
	}
	/*
			open方法
			参数
				1.打开方式
				2.地址
				3.是否异步
					异步:非阻塞 前面的代码不会影响后面代码的执行
					同步:阻塞 前面的代码会影响后面代码的执行
		*/
	xhr.open(method,url,true);

/*	2.post
        理论上无限制
        enctype : 提交的数据格式，默认application/x-www-form-urlencoded*/
	if (method == 'get') {
		xhr.send();
	} else {
		xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
		xhr.send(data);
	}
	
	/*onreadystatechange事件
	readyState属性：请求状态
	0	（初始化）还没有调用open()方法
	1	（载入）已调用send()方法，正在发送请求
	2	（载入完成）send()方法完成，已收到全部响应内容
	3	（解析）正在解析响应内容
	4	（完成）响应内容解析完成，可以在客户端调用了
	status属性：服务器(请求资源)的状态
	返回的内容
	responseText：返回以文本形式存放的内容
	responseXML：返回XML形式的内容*/
   //等待服务器返回内容
		/*
			readyState : ajax工作状态
			responseText : ajax请求返回的内容就被存放到这个属性下面
			on readystate change : 当readyState改变的时候触发
			status : 服务器状态，http状态码
		*/
	xhr.onreadystatechange = function() {
		
		if ( xhr.readyState == 4 ) {
			if ( xhr.status == 200 ) {
				success && success(xhr.responseText);
			} else {
				alert('出错了,Err：' + xhr.status);
			}
		}
		
	}
};

/**
 * @module  ajax 
 * @description ajax原生js封装
   *参数说明:
   **method: 请求方式:GET/POST,默认值:'GET';
   **url:    发送请求的地址, 默认值: 当前页地址;
   **data:   string,json;
   **async:  是否异步:true/false,默认值:true;
   **cache:  是否缓存：true/false,默认值:true;
   **contentType: HTTP头信息，默认值：'application/x-www-form-urlencoded';
   **success: 请求成功后的回调函数;
   **error:   请求失败后的回调函数;
 */
 var ajax = function (opts) {
    //设置默认参数
    var defaults = {
        method: 'GET',
        url: '',
        data: '',
        async: true,
        cache: true,
        contentType: 'application/x-www-form-urlencoded',
        success: function() {},
        error: function() {}
    };

    //默认参数继承用户参数 
    for (var key in opts) {
        defaults[key] = opts[key];
    }

    //对数据进行处理
    if (typeof defaults.data === 'object') { //处理 data
        var str = '';
        for (var key in defaults.data) {
            str += key + '=' + defaults.data[key] + '&';
        }
        defaults.data = str.substring(0, str.length - 1);
    }

       defaults.method = defaults.method.toUpperCase(); //处理 method

       defaults.cache = defaults.cache ? '' : '&' + new Date().getTime(); //处理 cache

    if (defaults.method === 'GET' && (defaults.data || defaults.cache)){
       defaults.url += '?' + defaults.data + defaults.cache; //处理 url    
    }
    //开始编写ajax
    //1.创建ajax对象
    var oXhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    
    //2.和服务器建立联系，告诉服务器你要取什么文件
    oXhr.open(defaults.method, defaults.url, defaults.async);
    
    //3.发送请求
    if (defaults.method === 'GET')
        oXhr.send(null);
    else {
        oXhr.setRequestHeader("Content-Type", defaults.contentType);
        oXhr.send(defaults.data);
    }
    //4.等待服务器回应
    oXhr.onreadystatechange = function() {
        if (oXhr.readyState === 4) {
            if (oXhr.status === 200)
                defaults.success.call(oXhr, oXhr.responseText);
            else {
                defaults.error();
            }
        }
    };
}

