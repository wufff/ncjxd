
/**static/src/img/user_mr.gif
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-11-19 15:36:08
 * @version $Id$
 */
 
require(["jquery","api","path","layui","star","boot-dropdown"],function($,api,path,layui){
 // vidoe();
 var layer = layui.layer;
 var activity_id = $("input[name=activity_id]").val(); 
 var user_score = $("#user_score").val();  
 var player;
 var is_play = false;
 var example = "http://images.dev.dodoedu.com/resource/77c3a6512aea3519.mp4";
 var as = $("#aboutVidoe a");

 //处理播放还是等待
  as.each(function(index, el) {
       if($(el).attr("data-status") == 1){
              if(!is_play){
                    $(el).addClass('active');
                    var mp4_rec =$(el).attr("download");
                    console.log(mp4_rec);
                    var videoObject = {
                    container: '#video',//“#”代表容器的ID，“.”或“”代表容器的class
                    variable: 'player',//该属性必需设置，值等于下面的new chplayer()的对象
                    flashplayer:false,//如果强制使用flashplayer则设置成true
                    video:mp4_rec,//视频地址
                    logo:null
                    };
                    player = new ckplayer(videoObject);
                    is_play = true;
              }  
       }else {
             var text = $(el).text();
             var str = text.slice(0,5) + "... " + "视频转换中..稍后刷新可观看";
             $(el).text(str);
       }
   });



 
setTimeout(function(){
            star();
  },100)




 //切换播放
  $("#aboutVidoe a").click(function(){
       if($(this).attr("data-status") == 0) {
          return;
       }
       $("#aboutVidoe a").removeClass('active');
       $(this).addClass('active');
       var videSrc = $(this).attr("download")
       changeVideo(videSrc,player);
    })


  function changeVideo(videoUrl, player) {
    if (!player && player != 0) {
      var videoObject = {
        container: '#video', //“#”代表容器的ID，“.”或“”代表容器的class
        variable: 'player', //该属性必需设置，值等于下面的new chplayer()的对象
        flashplayer: false, //如果强制使用flashplayer则设置成true
        video: videoUrl, //视频地址
        logo: null
      };
      player = new ckplayer(videoObject);
    } else {
      var newVideoObject = {
        container: '#video', //容器的ID
        variable: 'player',
        autoplay: true, //是否自动播放
        // loaded: 'loadedHandler', //当播放器加载后执行的函数
        flashplayer: false,
        logo: null,
        video: videoUrl
      }
      if (player.playerType == 'html5video') {
        if (player.getFileExt(videoUrl) == '.flv' || player.getFileExt(videoUrl) == '.m3u8' || player.getFileExt(videoUrl) == '.f4v' || videoUrl.substr(0, 4) == 'rtmp') {
          player.removeChild();
          player = null;
          player = new ckplayer();
          player.embed(newVideoObject);
        } else {
          player.newVideo(newVideoObject);
        }
      } else {
        if (player.getFileExt(videoUrl) == '.mp4' || player.getFileExt(videoUrl) == '.webm' || player.getFileExt(videoUrl) == '.ogg') {
          player = null;
          player = new ckplayer();
          player.embed(newVideoObject);
        } else {
          player.newVideo(newVideoObject);
        }
      }
    }
  }
     


  
  function star(){
        var _star = $("#star-score");
        if( user_score == "0"){
          _star.raty({
            precision: true,
            targetKeep: true,
            readOnly: false,
            size: 22,
            width: 130,
            path: path.img,
            targetType: 'hint',
            number: 5,
            target:'#star-hint',
            precision: true,
            // round: { down: .25, full: .6, up: .76 }, 
            hints:['一星','二星','三星','四星','五星'],
            targetForma: '{score}',
            score: function(){
              return user_score;
            },
            mouseover:function(){
              var num = $("#star-hint").text() *2;
               $("#fen").css("visibility","visible");
              $("#fen").html("<span class='code'>"+ num.toFixed(0) +"</span> 分")
            },
             mouseout:function(){
              $("#fen").css("visibility","hidden");
            },
            click:function(){
                    var num = $("#star-hint").text() *2;
                    var myConde = num.toFixed(0);
                    var url = path.api + '/api/setActivityScore';
                    var getData = {
                        activity_id:activity_id,
                        score:myConde
                    }
                    api.ajaxGet(url,getData,function(res){
                          console.log(res);
                        if(res.type == "success") {
                            layer.msg("评分成功");
                            user_score = myConde;
                            var average_score = res.data.average_score;
                            $("#total_code").text(average_score);
                            starReadOnly(user_score/2);     
                        }else{
                            layer.msg(res.message,{icon:5});
                        }
                    })
               
             }
          });
        }else{
           starReadOnly(user_score/2);    
        }
       }

    function starReadOnly(num){
        var _star = $("#star-score");
        _star.raty({
            precision: true,
            targetKeep: false,
            readOnly:true,
            size: 22,
            width: 130,
            path:path.img,
            number: 5,
            precision: false,
            // round: { down: .25, full: .6, up: .76 },
            score: function(){
              $("#fen").html("<span class='code'>"+ num*2 +"</span> 分");
              $("#fen").css("visibility","visible");
              $("#star-score").find('img').attr("title","");
              return num; 
            },
        });
          setTimeout(function(){
           $("#star-score").find('img').attr("title","");
         },150)
      }
})

