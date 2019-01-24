
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2019-01-07 08:50:59
 * @version $Id$
 */
 
require(["jquery","layui","path","ckplayer","boot-dropdown"],function($,layui,path,ckplayer){
  var layer = layui.layer;
  var form = layui.form;
  var obj = [];
 $(".video").each(function(index, el) {
 	    var id = $(el).attr("id");
 	    var videoObject = {
				container: '#'+id,//“#”代表容器的ID，“.”或“”代表容器的class
				variable: 'player_'+index,//该属性必需设置，值等于下面的new chplayer()的对象
				flashplayer:false,//如果强制使用flashplayer则设置成true
				video:"http://video.rjs.dodoedu.com/rjs5b7a853e0ae89.mp4",//视频地址
				autoplay:true   //是否自动播放
		  };
         obj[index] = new ckplayer(videoObject);
   });
  console.log(obj)
})