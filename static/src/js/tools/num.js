define(function () {
	return {
		Hanzi:function(num){
		var numMap = {
            0:'零',
            1:'一',
            2:'二',
            3:'三',
            4:'四',
            5:'五',
            6:'六',
            7:'七',
            8:'八',
            9:'九',
            10:'十'
        };
        var unitMap = {
            1:'',
            2:'十',
            3:'百',
            4:'千'
        };
        var num = String(num);
        var len = num.length;
        if(len > 4){
            //console.log('该函数只处理千位及以下');
            return null;
        }
        var hanzi = '';
        for(var i=0;i<len;i++){
            var unit = unitMap[len-i];
            var charStr = num.charAt(i);
            var digit = numMap[charStr]
            if(digit == '零'){
                unit = '';
            }
            if(unit == '十'&& digit == '一'){
                digit = '';
            }
            var part = digit + unit;
            if(hanzi.charAt(hanzi.length-1)=='零' && part == '零'){
                continue;
            }
            hanzi += part;
        };
        var hanziLen = hanzi.length;
        for(var i=0;i<hanziLen;i++){
            var str = hanzi.charAt(hanzi.length-1);
            if(str == '零'){
                hanzi = hanzi.substr(0,hanzi.length-1)
            }
        }
        return hanzi;
		},
        makeClassStatus:function(data){
           if(data == 1) {
              return "实际已开";
           }else if(data == 4){
             return "实际未开";
           }else{
             return "";
           }

        },
        patrolStatus:function(data){
           if(data == 1) {
              return "进行中";
           }else if( data == 2) {
              return "已结束";
           }else if( data == 0) {
               return "未开始";
           }

        },
        teacherStatus:function(data){
          if(data == 0) {
              return "无编制";
           }else if( data == 1) {
              return "有编制";
           }
        }
	}
})