define(['layui','path'],function(layui,path){
     var $ = jQuery = layui.jquery;
     return {
         //存储
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
                //console.log("key不存在")
            }
            var value = $("#wf"+key).val();
            return value;
         },
        //格式化
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

         //时间
        prevWeek:function(dateStr){
                var sdate = new Date(Date.parse(dateStr.replace(/-/g, "/")))
                var prevDate = new Date(sdate.getTime() - 7 * 24 *60 *60 *1000);
                var Reznow = prevDate.toLocaleDateString('zh-Hans-CN').replace(/日/g, '').replace(/\/|年|月/g, '-').replace(/[^\d-]/g,'');
                Rez = Reznow.replace(/\//g,'-')
                return Rez;
                
            },
        nextWeek:function(dateStr){
                var sdate = new Date(Date.parse(dateStr.replace(/-/g, "/")))
                var nextDate = new Date(sdate.getTime() + 7 * 24 *60 *60 *1000);
                var Reznow = nextDate.toLocaleDateString('zh-Hans-CN').replace(/日/g, '').replace(/\/|年|月/g, '-').replace(/[^\d-]/g,'');
                Rez = Reznow.replace(/\//g,'-')
                return Rez;
        },
        nextWeekPei:function(dateStr,num){
                var sdate = new Date(Date.parse(dateStr.replace(/-/g, "/")))
                var nextDate = new Date(sdate.getTime() + num * 7 * 24 *60 *60 *1000);
                var Reznow = nextDate.toLocaleDateString('zh-Hans-CN').replace(/日/g, '').replace(/\/|年|月/g, '-').replace(/[^\d-]/g,'');;
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
       //获得url   
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
       //jueryCook
    cookie:function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options = $.extend({}, options); // clone object since it's unexpected behavior if the expired property were changed
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // NOTE Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
},
    //时间上下午
      formatminutesUp:function (date) {                                   //格式化时间基于layui上午
            $(".laydate-time-text").eq(0).html("上课时间");
            $(".laydate-time-text").eq(1).html("下课时间");
            $(".laydate-time-list").map(function(index,ele){
                var am = $(ele).find("ol").eq(0).find('li');
                for (var i = 0; i < am.length; i++) {
                var am00 = am[i].innerText;
                if (am00 != "08" && am00 != "09"  && am00 != "10" && am00 != "11" && am00 != "12") {
                    am[i].remove()
                  } 
                }  
             //    var showtime = $(ele).find("ol").eq(1).find('li');
             //    for (var i = 0; i < showtime.length; i++) {
             //    var t00 = showtime[i].innerText;
             //    if (t00 != "00" && t00 != "15"  && t00 != "25" && t00 != "30"   && t00 != "40" && t00 != "45" ) {
             //        showtime[i].remove()
             //    }
             // }
              $(ele).find("ol").eq(2).find('li').remove();
           })
            // ar showtime = $(".laydate-time-livst li ol").eq(1).find("li");
            // for (var i = 0; i < showtime.length; i++) {
            //     var t00 = showtime[i].innerText;
            //     if (t00 != "00" && t00 != "20"  && t00 != "25" && t00 != "30"  && t00 != "35" && t00 != "40" && t00 != "45" && t00 != "50") {
            //         showtime[i].remove()
            //     }
            // }
            // $($(".laydate-time-list li ol")[2]).find("li").remove();  //清空秒
  
       },
     formatminutesDown:function(date) {
             $(".laydate-time-text").eq(0).html("上课时间");
             $(".laydate-time-text").eq(1).html("下课时间");
            $(".laydate-time-list").map(function(index,ele){
                var am = $(ele).find("ol").eq(0).find('li');
                for (var i = 0; i < am.length; i++) {
                var am00 = am[i].innerText;
                if (am00 != "14" && am00 != "15"  && am00 != "16" && am00 != "18" && am00 != "19" && am00 != "20" ) {
                    am[i].remove()
                  } 
                }  
             //    var showtime = $(ele).find("ol").eq(1).find('li');
             //    for (var i = 0; i < showtime.length; i++) {
             //    var t00 = showtime[i].innerText;
             //    if (t00 != "00" && t00 != "15"  && t00 != "25" && t00 != "30"   && t00 != "40" && t00 != "45" ) {
             //        showtime[i].remove()
             //    }
             // }
              $(ele).find("ol").eq(2).find('li').remove();
           })
            // ar showtime = $(".laydate-time-livst li ol").eq(1).find("li");
            // for (var i = 0; i < showtime.length; i++) {
            //     var t00 = showtime[i].innerText;
            //     if (t00 != "00" && t00 != "20"  && t00 != "25" && t00 != "30"  && t00 != "35" && t00 != "40" && t00 != "45" && t00 != "50") {
            //         showtime[i].remove()
            //     }
            // }
            // $($(".laydate-time-list li ol")[2]).find("li").remove();  //清空秒
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

function  setStandardTimeto(d){
    // + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
     youWant = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
     return youWant;      
};