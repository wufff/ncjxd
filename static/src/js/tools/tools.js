define(['jquery','path'],function(path){
     return {
         fomartTime:function(timestamp){
         	    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
		        var Y = date.getFullYear() + '-';
		        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
		        var D = date.getDate();
		        var h = date.getHours() + ':';
		        var m = date.getMinutes() + ':';
		        var s = date.getSeconds();
		        return Y+M+D;
         },
         fomartNone:function(a){
         	  if(!a && a != 0){
                  return "";
         	  }else{
         	  	return a;
         	  }
         },
        prevWeek:function(dateStr){
                var sdate = new Date(Date.parse(dateStr.replace(/-/g, "/")))
                var prevDate = new Date(sdate.getTime() - 7 * 24 *60 *60 *1000);
                var Reznow = prevDate.toLocaleDateString();
                Rez = Reznow.replace(/\//g,'-')
                return Rez;
                
            },
        nextWeek:function(dateStr){
                var sdate = new Date(Date.parse(dateStr.replace(/-/g, "/")))
                var nextDate = new Date(sdate.getTime() + 7 * 24 *60 *60 *1000);
                var Reznow = nextDate.toLocaleDateString();
                Rez = Reznow.replace(/\//g,'-')
                return Rez;
        },
        queryString:function(paramName){
            var url = location.search; //获取url中"?"符后的字串
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
            }
            return theRequest[paramName];
          },
        request:function  (name) {
        var args = getQueryStringArgs ()
        var result = "";
        if (args) {
            $.each(args, function (key, value) {
                if (key == name) {
                    result = value;
                    //退出遍历
                    return false;
                }
            });
        }
        return result;
       }
    }  
})

function getQueryStringArgs () {
        //取得查询字符串并去掉问号
        var qs = location.search.length > 0 ? location.search.substring(1) : "";
        //保存数据的对象
        var args = {};
        //取得每一项
        var items = qs.length ? qs.split("&") : [];
        var item = null;
        var value = null;
        var len = items.length;
        for (var i = 0; i < len; i++) {
            item = items[i].split("=");
            //参数解码
            name = decodeURIComponent(item[0])
            value = decodeURIComponent(item[1]);
            if (name.length) {
                args[name] = value;
            }
        }
        return args;
    };