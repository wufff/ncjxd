
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-11-08 10:41:46
 * @version $Id$
 */

require(["jquery"],function($){
     var RecType = $(".mediaBox").data("type");
     var res = $(".mediaBox").data("res");
     // var res = "http://img.ksbbs.com/asset/Mon_1703/d0897b4e9ddd9a5.mp4";
     switch(RecType)
     {
        case 1:     //直播    
          if( $(".mediaBox").data("data-is-start") == 0){
              var html = '<img src="'+res +'" alt = "活动图片">';
              $(".mediaBox").html(html);
          }else {
             // var html = '<div id="video" style="width:865px;height:500px;"></div>';
             // $(".mediaBox").html(html);
                var file_key = "http://pili-live-hls.dodoedu.com/dodoedu/ncjxd-98ui76yhbgtfdser175m.m3u8?sign=30d77a90155281684918ee45be9287a0&t=5c3dabd5";
                var html =  '<video id="videjs"  class="video-js vjs-big-play-centered vjs-4-3" controls preload="auto" poster=""><source src="'+ file_key +'"></video>'
                $(".mediaBox").html(html);
                var player = videojs('videjs');
          }
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
     }   

     //添加直播
     $("#addlive").click(function(){
        window.location.href = "/live/add";
     })
})
