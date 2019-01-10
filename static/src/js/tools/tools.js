define(['jquery','path'],function($,path){
     return {
         set:function(str,value){
            var key = $("#wuf"+key);
            if (key.length > 0) {
                if(value && value != 0){
                     key.val(value);
                 }else{
                     key.val("");
                 }
            }else{
                 var str2 = "wf"+str;
             if(value && value != 0){
                  var html = '<input type="hidden" value="'+ value +'" id='+ str2 +'>';
                  $("body").append(html);
             }else{
                  var html = '<input type="hidden" value="" id='+ str2 +'>';
                  $("body").append($(html));
             }
            }
         },
         get:function(key){
            if($("#wf"+key).length == 0){
                console.log("key不存在")
            }
            var value = $("#wf"+key).val();
            return value;
         },

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
        nextWeekPei:function(dateStr,num){
                var sdate = new Date(Date.parse(dateStr.replace(/-/g, "/")))
                var nextDate = new Date(sdate.getTime() + num * 7 * 24 *60 *60 *1000);
                var Reznow = nextDate.toLocaleDateString();
                Rez = Reznow.replace(/\//g,'-')
                return Rez;
        },


        calcDtScopeByMonth:function(index) {
            serachIndex = index;
            var today = new Date();
            var month = today.getMonth();
            var year = today.getFullYear();
            var startS = new Date(year, month + index, 1);
            var millisecond = 1000 * 60 * 60 * 24;
            var lastDay = new Date(year, month + index + 1, 1);
            var lastDay = new Date(lastDay.getTime() - millisecond);
            var startDay = setStandardTimeto(startS);
            var lastDay =  setStandardTimeto(lastDay);
             return {
               start:startDay,
               last:lastDay
             }
        },
        calcDtScopeByWeek:function(index){
            serachIndex = index;
            var today = new Date();
            var day = today.getDate() == 0 ? 7 :today.getDay();
            var millisecond = 1000 * 60 * 60 * 24;
            var addDays = index * 7 - day + 1;
            var mondayDt = new Date(today.getTime() + addDays * millisecond );
            var sundayDt = new Date(today.getTime() + (addDays + 6) * millisecond );
          
            var  startDay = setStandardTimeto(mondayDt);
            var  lastDay =  setStandardTimeto(sundayDt);
            return {
               start:startDay,
               last:lastDay
             }
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
       },
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

function  setStandardTimeto(d){
    // + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
     youWant = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
     return youWant;      
};