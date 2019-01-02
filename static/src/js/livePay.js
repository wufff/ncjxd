
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-11-08 10:41:46
 * @version $Id$
 */

require(["jquery","ckplayer"],function($,ckplayer){
	 console.log(ckplayer);
     var RecType = $(".mediaBox").data("type");
     var res = $(".mediaBox").data("res");
     switch(RecType)
	 {
		case 1:                 //视频
		  var html = '<img src="'+res +'" alt = "活动图片">';
          $(".mediaBox").html(html);
		  break;
		case 0:
		  var html = '<div id="video" style="width:865px;height:500px;"></div>';
          $(".mediaBox").html(html);
           var videoObject = {
				container: '#video',//“#”代表容器的ID，“.”或“”代表容器的class
				variable: 'player',//该属性必需设置，值等于下面的new chplayer()的对象
				flashplayer:false,//如果强制使用flashplayer则设置成true
				video:res//视频地址
		  };
          var player = new ckplayer(videoObject);
		  break;
		default:
		  alert("资源未知")
     }
   
})
