
/**static/src/img/user_mr.gif
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-11-19 15:36:08
 * @version $Id$
 */
 
require(["jquery","ckplayer","expression","api","path","page","layui"],function($,ckplayer,face,api,path,pages,layui){
    vidoe();
    // comment();
    initPage (1);
    face.showFace("#showFace",".commentText");
    var layer = layui.layer;
    var activity_id = $("input[name=activity_id]").val(); 
   

 function  vidoe () {
   /*初始化*/ 
    var mp4_rec = $("#aboutVidoe a").eq(0).attr("download");
    var videoObject = {
		container: '#video',//“#”代表容器的ID，“.”或“”代表容器的class
		variable: 'player',//该属性必需设置，值等于下面的new chplayer()的对象
		flashplayer:false,//如果强制使用flashplayer则设置成true
		video:mp4_rec,//视频地址
    logo:null
		};
		var player = new ckplayer(videoObject);

  /*切换视频*/ 
   $("#aboutVidoe a").click(function(){
       $("#aboutVidoe a").removeClass('active');
       $(this).addClass('active');
       var videSrc = $(this).attr("download")
       changeVideo(videSrc,player);
    })

}


   function comment () {
       var requestData = "activity_id="+ activity_id +"&page_num=10&page=1";
       api.ajaxPost(path.api+"/api/getActivityCommentList",requestData,renderComment); //渲染评论
                                             //渲染表情  
       $("#commtentBt").click(function(){                                              //发表评论
          var content = $(".commentText").val();
          if(content && content !=0){
            var postdata = "activity_id="+ activity_id +"&comment="+content;
            api.ajaxPost(path.api+"/api/setUserComment",postdata,renderPublishComment);
          }
       })   
   }


  
    
      function changeVideo(videoUrl,player) {
        if(!player & player !=0) {
          return;
        }

        var newVideoObject = {
          container: '#video', //容器的ID
          variable: 'player',
          autoplay: true, //是否自动播放
          // loaded: 'loadedHandler', //当播放器加载后执行的函数
          flashplayer:false,
          logo:null,
          video: videoUrl
        }
        //判断是需要重新加载播放器还是直接换新地址

        if(player.playerType == 'html5video') {
          if(player.getFileExt(videoUrl) == '.flv' || player.getFileExt(videoUrl) == '.m3u8' || player.getFileExt(videoUrl) == '.f4v' || videoUrl.substr(0, 4) == 'rtmp') {
            player.removeChild();
            player = null;
            player = new ckplayer();
            player.embed(newVideoObject);
          } else {
            player.newVideo(newVideoObject);
          }
        } else {
          if(player.getFileExt(videoUrl) == '.mp4' || player.getFileExt(videoUrl) == '.webm' || player.getFileExt(videoUrl) == '.ogg') {
            player = null;
            player = new ckplayer();
            player.embed(newVideoObject);
          } else {
            player.newVideo(newVideoObject);
          }
        }
      }
     

       // function renderComment (data){
       //     // uc_avatar: ""
       //      // uc_comment: "我在评论"
       //      // uc_createtime: "2018-11-21 14:45"
       //      // uc_id: "1490493"
       //      // uc_obj_id: "1490493"
       //      // uc_uid: "1490493"
       //      // uc_uname: "测试用户"
       //     if(data.type == "success"){
       //          console.log(data);
       //          var list = data.data.list;
       //          var html = "";
       //          var mrAutor = path.img + "/user_mr.gif";
       //          for(var i = 0; i < list.length; i++){
       //          var headimg = list[i].uc_avatar ? list[i].uc_avatar : mrAutor;
       //          html  += '<div class="item">'
       //          html  +=        '<div class="media">'
       //          html  +=        '<a class="pull-left">'
       //          html  +=           '<img class="media-object author" src="'+ headimg +'">'
       //          html  +=      '</a>'
       //          html  +=     '<div class="media-body">'
       //          html  +=        '<h5 class="media-heading"><span class="name">'+list[i].uc_uname +'</span>'+list[i].uc_createtime +'</h5>'
       //          html  +=       '<div class="content">'+ list[i].uc_comment +'</div>'
       //          html  +=    '</div>'
       //          html  +=    '</div>'
       //          html  +=  '</div>'
       //          }
       //         $("#commentContent").html(html);
       //     }else{


       //     }
       // }


//评论

$("#commtentBt").click(function(){
   var comment = $(".commentText").val();
   if(!comment){
     return;
   }
   var url = "/api/setUserComment";
   api.ajaxPost(url,{activity_id:activity_id,comment:comment},function(res){
     if(res.type == "success"){
        layer.msg("评论成功！",{time:800});
        $(".commentText").val("");
        initPage (1);
     }
   })
})
     



    
  function initPage (goPage){
       var activity_id = $("input[name=activity_id]").val();
       var requestData = "activity_id="+ activity_id +"&page_count=6&page=1&v="+ new Date().getTime();
       var url = path.api+"/api/getActivityCommentList";
      pages.getAjax(url,requestData,function(data){
         if( data.type == "success"){
             var total = data.data.data.total;
             page =  new pages.jsPage(total, "pageNum","6",url,requestData,buildTable,goPage,null);
             pages.pageMethod.call(page); 
           }else{
             // $("#tbody").html('<tr><td colspan="5">暂无数据~！</td></td>');
             // $(".tableLoading").html('');
              $("#commentContent").html("");
              $("#totComment").html("0");
             return;
         }
      })
    function buildTable(res) {
    if (res.type == "success") {
        var list = res.data.data.list;
        console.log(res);
        var html = "";
        var mrAutor = path.img + "/user_mr.gif";
        for(var i = 0; i < list.length; i++){
        var headimg = list[i].uc_avatar ? list[i].uc_avatar : mrAutor;
        html  += '<div class="item">'
        html  +=        '<div class="media">'
        html  +=        '<a class="pull-left">'
        html  +=           '<img class="media-object author" src="'+ headimg +'">'
        html  +=      '</a>'
        html  +=     '<div class="media-body">'
        html  +=        '<h5 class="media-heading"><span class="name">'+list[i].uc_uname +'</span>'+list[i].uc_createtime +'</h5>'
        html  +=       '<div class="content">'+ face.replaceSmile(list[i].uc_comment) +'</div>'
        html  +=    '</div>'
        html  +=    '</div>'
        html  +=  '</div>'
        }
       $("#commentContent").html(html);
        var total = res.data.data.total;
       $("#totComment").html(total);

    }
    if(res.type == "error") {
        var mun = goPage - 1;
        pages.gotopage.call(page,mun,false);
    }
  }
 }

    
})

