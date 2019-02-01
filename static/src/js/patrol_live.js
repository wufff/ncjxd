
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2019-01-07 08:50:59
 * @version $Id$
 */
 
require(["jquery","layui","path","ckplayer","boot-dropdown"],function($,layui,path,ckplayer){
  var layer = layui.layer;
  var form = layui.form;
  var obj = {};
 // $(".video").each(function(index, el) {
 //               var file_key = $(this).attr("data-hls");
 //                // var file_key = "http://pili-live-hls.dodoedu.com/dodoedu/ncjxd-98ui76yhbgtfdser175m.m3u8?sign=ff0d06746b589e2995d8df906e71720f&t=5c3eaa73";
 //                var html =  '<video id="id_'+index+'"  class="video-js vjs-big-play-centered vjs-fluid" controls preload="auto" poster=""><source src="'+ file_key +'" type="application/x-mpegURL"></video>'
 //                $(this).html(html);          
 //   });

 //               // arry[index] = videojs('videjs');
 //               //  arry[index].play();
 //  $(".video-js").each(function(index,el){
 //  	  var id = $(this).attr("id");
 //      obj[id] = videojs(id);
 //      console.log(obj);
 //  })

   var file_key = $(".video").eq(0).attr("data-hls");
   var html =  '<video id="videjs"  class="video-js vjs-big-play-centered vjs-fluid" controls preload="auto" poster=""><source src="'+ file_key +'" type="application/x-mpegURL"></video>'
   $(".video").eq(0).html(html); 
   var player = videojs('videjs');
   player.play();

})