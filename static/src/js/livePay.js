
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-11-08 10:41:46
 * @version $Id$
 */

require(["layui","page","path","headLogin"],function(layui,pages,path){
     var $ = jQuery = layui.jquery; 
     var RecType = $(".mediaBox").data("type");
     var res = $(".mediaBox").data("res");
     var loading;
     var page;
     initPage(1);
     switch(RecType)
     {
        case 1:     //直播    
          if( $(".mediaBox").data("data-is-start") == 0){
              var html = '<img src="'+res +'" alt = "活动图片">';
              $(".mediaBox").html(html);
          }else {
                // var html = '<div id="video" style="width:865px;height:500px;"></div>';
                // $(".mediaBox").html(html);
                var file_key = $(".mediaBox").attr("data-res");
                // var file_key = "http://pili-live-hls.dodoedu.com/dodoedu/ncjxd-98ui76yhbgtfdser175m.m3u8?sign=ff0d06746b589e2995d8df906e71720f&t=5c3eaa73";
                var html =  '<video id="videjs"  class="video-js vjs-big-play-centered vjs-fluid" controls preload="auto" poster=""><source src="'+ file_key +'" type="application/x-mpegURL"></video>'
                $(".mediaBox").html(html);
                var player = videojs('videjs',{autoplay:true});
                player.play();
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
    



    
   
    function initPage (goPage){
      // loading = layer.load(5);

      var url = path.api+"/api/getLiveList";
      // var url = "http://wangyong.ncjxd.dev.dodoedu.com/api/getLiveList"
      var getData = "page=1&page_count=4";
      pages.getAjax(url,getData,function(data){
         if( data.type == "success"){
             // console.log(data.data.data.list);
              console.log(data);
             if(data.data.data.list.length == 0){
                $("#tbody").hmtl("<tr><td>无数据<td></tr>")
                $("#pageNum").html(""); 
                return;
             }
             var total = data.data.data.total;
             // console.log(total)
             console.log(total);
             page =  new pages.jsPage(total,"pageNum","4",url,getData,buildTable,goPage,null);
             pages.pageMethod.call(page); 
           }else{
             layer.msg(data.msg)
             return;
         }
      })
    function buildTable(data) {
    if (data.type == "success") {
      var data = data.data.data.list;
      console.log(data);
      var html = '';
      for (var i = 0; i < data.length; i++) {
       html +=     '<div class="col-md-6 item">'
       html +=     ' <div class="media">'
       html +=          '<a class="pull-left" href="/live/detail/'+data[i].ai_encrypt_id+'">'
       html +=              '<img class="media-object" src="'+ data[i].ai_cover_url+'" >'
       html +=          '</a>'
       html +=         ' <div class="media-body">'
       html +=              '<h5 class="media-heading">'+ data[i].ai_title+'</h5>'
       html +=              '<div class="title_min">'+ data[i].ai_describe +'</div>'
       html +=              '<div class="title_beizhu">'+ data[i].ai_start_time_chs+'</div>'
       html +=          '</div>'
       html +=      '</div>'
       html +=  '</div>'
      }
      $("#row").html(html);
      layer.close(loading);
    }
  }
 }

})
