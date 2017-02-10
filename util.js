/**
 * @module 
 * @description 获取url参数
 */
function getUrlArgs(){
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