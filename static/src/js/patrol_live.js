require(["jquery","boot-dropdown"],function($){
  var videoBox = [];
 $(".video").each(function(index, el) {
        var file_key = $(this).attr("data-hls");    
        if (file_key){
          var id =  $(this).attr("id"); 
          var videoObject = {
              //playerID:'ckplayer01',//播放器ID，第一个字符不能是数字，用来在使用多个播放器时监听到的函数将在所有参数最后添加一个参数用来获取播放器的内容
              container: '#'+id, //容器的ID或className
              variable: 'player', //播放函数名称
              autoplay: true, //是否自动播放
              config: '', //指定配置函数
              debug: true, //是否开启调试模式
              flashplayer: true, //强制使用flashplayer
              //mobileCkControls:true,//是否在移动端（包括ios）环境中显示控制栏
              //live:true,//是否是直播视频，true=直播，false=点播
              live:true,
              video: file_key 
          }
          videoBox[index] = new ckplayer(videoObject);
        }
   });
    // var videoObject = {
    //     //playerID:'ckplayer01',//播放器ID，第一个字符不能是数字，用来在使用多个播放器时监听到的函数将在所有参数最后添加一个参数用来获取播放器的内容
    //     container: '#video', //容器的ID或className
    //     variable: 'player', //播放函数名称
    //     autoplay: true, //是否自动播放
    //     config: '', //指定配置函数
    //     debug: true, //是否开启调试模式
    //     flashplayer: true, //强制使用flashplayer
    //     //mobileCkControls:true,//是否在移动端（包括ios）环境中显示控制栏
    //     //live:true,//是否是直播视频，true=直播，false=点播
    //     live:true,
    //     video: rec 
    //   };
    //   var player = new ckplayer(videoObject);
  console.log(videoBox);
})